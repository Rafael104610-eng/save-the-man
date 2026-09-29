import { Reminder } from '../data/types';

const pad = (n: number) => String(n).padStart(2, '0');

export const toDateKey = (d: Date = new Date()): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const formatTime = (hour: number, minute: number): string => `${pad(hour)}:${pad(minute)}`;

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const isDueOn = (r: Reminder, date: Date): boolean => {
  if (!r.enabled) return false;
  switch (r.repeat) {
    case 'daily':
      return true;
    case 'weekly':
      return r.weekday === date.getDay() + 1;
    case 'yearly':
      return r.day === date.getDate() && r.month === date.getMonth() + 1;
    case 'once':
      return r.day === date.getDate() && r.month === date.getMonth() + 1 && r.year === date.getFullYear();
  }
};

export const describeSchedule = (r: Reminder): string => {
  const time = formatTime(r.hour, r.minute);
  switch (r.repeat) {
    case 'daily':
      return `Todo dia às ${time}`;
    case 'weekly':
      return `Toda ${WEEKDAYS[(r.weekday ?? 1) - 1]} às ${time}`;
    case 'yearly':
      return `Todo ano em ${pad(r.day ?? 1)}/${pad(r.month ?? 1)} às ${time}`;
    case 'once':
      return `${pad(r.day ?? 1)}/${pad(r.month ?? 1)}/${r.year} às ${time}`;
  }
};

/** Sequência de dias seguidos com ao menos um lembrete concluído (hoje ainda não quebra a sequência). */
export const currentStreak = (doneDays: string[]): number => {
  const set = new Set(doneDays);
  const cursor = new Date();
  if (!set.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(toDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

/** Valida dia/mês(/ano) reais; retorna true se a data existe. */
export const isValidDate = (day: number, month: number, year?: number): boolean => {
  if (!Number.isInteger(day) || !Number.isInteger(month)) return false;
  const y = year ?? 2024; // ano bissexto para aceitar 29/02 em lembretes anuais
  const d = new Date(y, month - 1, day);
  return d.getFullYear() === y && d.getMonth() === month - 1 && d.getDate() === day;
};
