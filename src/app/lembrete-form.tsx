import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, Field, Label, Row } from '../components/ui';
import { CATEGORIES, categoryById } from '../data/categories';
import { DEFAULT_MESSAGES } from '../data/messages';
import { CategoryId, Repeat } from '../data/types';
import { WEEKDAYS, isValidDate } from '../services/dates';
import { useApp } from '../store/AppContext';
import { colors } from '../theme';

type Params = {
  id?: string;
  title?: string;
  category?: CategoryId;
  repeat?: Repeat;
  hour?: string;
  minute?: string;
  weekday?: string;
  personId?: string;
};

const REPEATS: { id: Repeat; label: string }[] = [
  { id: 'daily', label: 'Todo dia' },
  { id: 'weekly', label: 'Toda semana' },
  { id: 'yearly', label: 'Todo ano' },
  { id: 'once', label: 'Uma vez' },
];

const pad = (n: number) => String(n).padStart(2, '0');

export default function ReminderForm() {
  const params = useLocalSearchParams<Params>();
  const { reminders, people, customMessages, saveReminder } = useApp();
  const existing = reminders.find((r) => r.id === params.id);

  const [title, setTitle] = useState(existing?.title ?? params.title ?? '');
  const [category, setCategory] = useState<CategoryId>(existing?.category ?? params.category ?? 'elogio');
  const [personId, setPersonId] = useState<string | undefined>(existing?.personId ?? params.personId);
  const [message, setMessage] = useState(existing?.message ?? '');
  const [repeat, setRepeat] = useState<Repeat>(existing?.repeat ?? params.repeat ?? 'daily');
  const [time, setTime] = useState(
    `${pad(existing?.hour ?? Number(params.hour ?? 9))}:${pad(existing?.minute ?? Number(params.minute ?? 0))}`,
  );
  const [weekday, setWeekday] = useState<number>(existing?.weekday ?? Number(params.weekday ?? 2));
  const [dateText, setDateText] = useState(
    existing?.day && existing.month
      ? `${pad(existing.day)}/${pad(existing.month)}${existing.year ? `/${existing.year}` : ''}`
      : '',
  );
  const [suggestion, setSuggestion] = useState(0);

  const cat = categoryById(category);
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  const hour = timeMatch ? Number(timeMatch[1]) : NaN;
  const minute = timeMatch ? Number(timeMatch[2]) : NaN;
  const timeValid = hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;

  const dateParts = dateText.trim().split('/').map(Number);
  const day = dateParts[0];
  const month = dateParts[1];
  const year = repeat === 'once' ? dateParts[2] : undefined;
  const needsDate = repeat === 'yearly' || repeat === 'once';
  const dateValid =
    !needsDate ||
    (dateParts.length === (repeat === 'once' ? 3 : 2) &&
      isValidDate(day, month, year) &&
      (repeat !== 'once' || (year ?? 0) >= 2024));

  const canSave = title.trim().length > 0 && timeValid && dateValid;

  const suggestMessage = () => {
    const pool = [...(DEFAULT_MESSAGES[category] ?? []), ...customMessages.filter((m) => m.category === category).map((m) => m.text)];
    if (pool.length === 0) return;
    setMessage(pool[suggestion % pool.length]);
    setSuggestion(suggestion + 1);
  };

  const save = async () => {
    if (!canSave) return;
    await saveReminder({
      id: existing?.id,
      title: title.trim(),
      category,
      personId,
      message: cat.sendsMessage && message.trim() ? message.trim() : undefined,
      repeat,
      hour,
      minute,
      weekday: repeat === 'weekly' ? weekday : undefined,
      day: needsDate ? day : undefined,
      month: needsDate ? month : undefined,
      year: repeat === 'once' ? year : undefined,
      enabled: existing?.enabled ?? true,
    });
    router.back();
  };

  const onPickCategory = (id: CategoryId) => {
    setCategory(id);
    setSuggestion(0);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Field label="O que lembrar?" value={title} onChangeText={setTitle} placeholder="Ex.: Elogiar a Maria" />

      <Label>Tipo</Label>
      <Row>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} label={`${c.emoji} ${c.label}`} selected={category === c.id} onPress={() => onPickCategory(c.id)} />
        ))}
      </Row>

      <Label>Para quem?</Label>
      <Row>
        <Chip label="Ninguém" selected={!personId} onPress={() => setPersonId(undefined)} />
        {people.map((p) => (
          <Chip key={p.id} label={p.name} selected={personId === p.id} onPress={() => setPersonId(p.id)} />
        ))}
      </Row>
      {people.length === 0 ? (
        <Text style={styles.hint}>Cadastre pessoas na aba “Pessoas” para ligar o lembrete a elas.</Text>
      ) : null}

      {cat.sendsMessage ? (
        <View>
          <Field
            label="Mensagem para enviar (use {nome} para o nome da pessoa)"
            value={message}
            onChangeText={setMessage}
            multiline
            placeholder="Escreva ou toque em “Sugerir mensagem”"
            style={{ minHeight: 90, textAlignVertical: 'top' }}
          />
          <Button label="✨ Sugerir mensagem" variant="secondary" onPress={suggestMessage} style={{ marginBottom: 16 }} />
        </View>
      ) : null}

      <Label>Repetir</Label>
      <Row>
        {REPEATS.map((r) => (
          <Chip key={r.id} label={r.label} selected={repeat === r.id} onPress={() => setRepeat(r.id)} />
        ))}
      </Row>

      {repeat === 'weekly' ? (
        <Row>
          {WEEKDAYS.map((w, i) => (
            <Chip key={w} label={w} selected={weekday === i + 1} onPress={() => setWeekday(i + 1)} />
          ))}
        </Row>
      ) : null}

      {needsDate ? (
        <View>
          <Field
            label={repeat === 'once' ? 'Data (DD/MM/AAAA)' : 'Dia e mês (DD/MM)'}
            value={dateText}
            onChangeText={setDateText}
            keyboardType="numbers-and-punctuation"
            placeholder={repeat === 'once' ? '25/12/2026' : '14/02'}
          />
          {dateText.length > 0 && !dateValid ? <Text style={styles.error}>Data inválida.</Text> : null}
        </View>
      ) : null}

      <Field label="Horário (HH:MM)" value={time} onChangeText={setTime} keyboardType="numbers-and-punctuation" placeholder="09:00" />
      {!timeValid ? <Text style={styles.error}>Horário inválido. Use o formato 09:30.</Text> : null}

      <Button label="Salvar lembrete" onPress={save} disabled={!canSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hint: { color: colors.muted, fontSize: 13, marginTop: -8, marginBottom: 16 },
  error: { color: colors.danger, fontSize: 13, marginTop: -8, marginBottom: 12 },
});
