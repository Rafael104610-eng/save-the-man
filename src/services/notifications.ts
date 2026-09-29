import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { applyName } from '../data/messages';
import { categoryById } from '../data/categories';
import { Person, Reminder } from '../data/types';

const CHANNEL_ID = 'lembretes';
const { SchedulableTriggerInputTypes: T } = Notifications;

export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function ensureNotificationSetup(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Lembretes',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

const buildTrigger = (r: Reminder): Notifications.NotificationTriggerInput | null => {
  const base = { channelId: CHANNEL_ID, hour: r.hour, minute: r.minute };
  switch (r.repeat) {
    case 'daily':
      return { type: T.DAILY, ...base };
    case 'weekly':
      return { type: T.WEEKLY, weekday: r.weekday ?? 1, ...base };
    case 'yearly':
      // month em 0–11 (padrão do JavaScript), conforme a documentação do expo-notifications
      return { type: T.YEARLY, day: r.day ?? 1, month: (r.month ?? 1) - 1, ...base };
    case 'once': {
      const date = new Date(r.year ?? 0, (r.month ?? 1) - 1, r.day ?? 1, r.hour, r.minute);
      return date.getTime() > Date.now() ? { type: T.DATE, date, channelId: CHANNEL_ID } : null;
    }
  }
};

/** Cancela notificações antigas do lembrete e agenda as novas. Retorna os novos ids. */
export async function scheduleReminder(r: Reminder, person?: Person): Promise<string[]> {
  await cancelReminder(r);
  if (!r.enabled) return [];
  const trigger = buildTrigger(r);
  if (!trigger) return [];
  const cat = categoryById(r.category);
  const who = person ? ` (${person.name})` : '';
  const body = cat.sendsMessage
    ? `Toque para enviar uma mensagem${person ? ` para ${applyName('{nome}', person.name)}` : ''} 💌`
    : 'Toque para ver e marcar como feito.';
  const id = await Notifications.scheduleNotificationAsync({
    content: { title: `${cat.emoji} ${r.title}${who}`, body, data: { reminderId: r.id } },
    trigger,
  });
  return [id];
}

export async function cancelReminder(r: Pick<Reminder, 'notificationIds'>): Promise<void> {
  await Promise.all(
    r.notificationIds.map((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined)),
  );
}
