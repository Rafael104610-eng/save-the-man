import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppData, CategoryId, CustomMessage, Person, Reminder } from '../data/types';
import { toDateKey } from '../services/dates';
import { cancelReminder, ensureNotificationSetup, scheduleReminder } from '../services/notifications';

const STORAGE_KEY = 'lembrando-o-amor:v1';
const EMPTY: AppData = { people: [], reminders: [], customMessages: [], doneDays: [] };

type PersonInput = Omit<Person, 'id'> & { id?: string };
type ReminderInput = Omit<Reminder, 'id' | 'notificationIds' | 'lastDone'> & { id?: string };

type Ctx = AppData & {
  hydrated: boolean;
  savePerson: (input: PersonInput) => string;
  deletePerson: (id: string) => Promise<void>;
  saveReminder: (input: ReminderInput) => Promise<string>;
  deleteReminder: (id: string) => Promise<void>;
  toggleReminder: (id: string, enabled: boolean) => Promise<void>;
  markDone: (id: string, done: boolean) => void;
  addCustomMessage: (category: CategoryId, text: string) => void;
  deleteCustomMessage: (id: string) => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  // Sempre o estado mais recente, para funções assíncronas não usarem dados velhos
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
      } catch {
        // dados corrompidos: começa vazio
      }
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => undefined);
  }, [data, hydrated]);

  const update = useCallback((fn: (d: AppData) => AppData) => setData((d) => fn(d)), []);

  const savePerson: Ctx['savePerson'] = useCallback(
    (input) => {
      const id = input.id ?? Crypto.randomUUID();
      const person: Person = { ...input, id };
      update((d) => ({
        ...d,
        people: d.people.some((p) => p.id === id)
          ? d.people.map((p) => (p.id === id ? person : p))
          : [...d.people, person],
      }));
      return id;
    },
    [update],
  );

  const deletePerson: Ctx['deletePerson'] = useCallback(
    async (id) => {
      const orphans = dataRef.current.reminders.filter((r) => r.personId === id);
      await Promise.all(orphans.map(cancelReminder));
      update((d) => ({
        ...d,
        people: d.people.filter((p) => p.id !== id),
        reminders: d.reminders.filter((r) => r.personId !== id),
      }));
    },
    [update],
  );

  const saveReminder: Ctx['saveReminder'] = useCallback(
    async (input) => {
      const id = input.id ?? Crypto.randomUUID();
      const existing = dataRef.current.reminders.find((r) => r.id === id);
      const draft: Reminder = {
        ...input,
        id,
        notificationIds: existing?.notificationIds ?? [],
        lastDone: existing?.lastDone,
      };
      const person = dataRef.current.people.find((p) => p.id === draft.personId);
      const allowed = draft.enabled ? await ensureNotificationSetup() : false;
      const notificationIds = allowed ? await scheduleReminder(draft, person) : (await cancelReminder(draft), []);
      const saved = { ...draft, notificationIds };
      update((d) => ({
        ...d,
        reminders: d.reminders.some((r) => r.id === id)
          ? d.reminders.map((r) => (r.id === id ? saved : r))
          : [...d.reminders, saved],
      }));
      return id;
    },
    [update],
  );

  const deleteReminder: Ctx['deleteReminder'] = useCallback(
    async (id) => {
      const r = dataRef.current.reminders.find((x) => x.id === id);
      if (r) await cancelReminder(r);
      update((d) => ({ ...d, reminders: d.reminders.filter((x) => x.id !== id) }));
    },
    [update],
  );

  const toggleReminder: Ctx['toggleReminder'] = useCallback(
    async (id, enabled) => {
      const r = dataRef.current.reminders.find((x) => x.id === id);
      if (!r) return;
      await saveReminder({ ...r, enabled });
    },
    [saveReminder],
  );

  const markDone: Ctx['markDone'] = useCallback(
    (id, done) => {
      const today = toDateKey();
      update((d) => {
        const reminders = d.reminders.map((r) =>
          r.id === id ? { ...r, lastDone: done ? today : undefined } : r,
        );
        const anyDoneToday = reminders.some((r) => r.lastDone === today);
        const doneDays = anyDoneToday
          ? Array.from(new Set([...d.doneDays, today]))
          : d.doneDays.filter((x) => x !== today);
        return { ...d, reminders, doneDays };
      });
    },
    [update],
  );

  const addCustomMessage: Ctx['addCustomMessage'] = useCallback(
    (category, text) => {
      const msg: CustomMessage = { id: Crypto.randomUUID(), category, text };
      update((d) => ({ ...d, customMessages: [...d.customMessages, msg] }));
    },
    [update],
  );

  const deleteCustomMessage: Ctx['deleteCustomMessage'] = useCallback(
    (id) => update((d) => ({ ...d, customMessages: d.customMessages.filter((m) => m.id !== id) })),
    [update],
  );

  const value = useMemo<Ctx>(
    () => ({
      ...data,
      hydrated,
      savePerson,
      deletePerson,
      saveReminder,
      deleteReminder,
      toggleReminder,
      markDone,
      addCustomMessage,
      deleteCustomMessage,
    }),
    [data, hydrated, savePerson, deletePerson, saveReminder, deleteReminder, toggleReminder, markDone, addCustomMessage, deleteCustomMessage],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp precisa estar dentro de <AppProvider>');
  return ctx;
}
