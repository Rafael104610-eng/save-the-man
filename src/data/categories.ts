import { CategoryId } from './types';

export type Category = {
  id: CategoryId;
  label: string;
  emoji: string;
  /** Categorias de mensagem podem ser enviadas por WhatsApp */
  sendsMessage: boolean;
};

export const CATEGORIES: Category[] = [
  { id: 'elogio', label: 'Elogio', emoji: '🌹', sendsMessage: true },
  { id: 'saudade', label: 'Saudade', emoji: '💌', sendsMessage: true },
  { id: 'bomdia', label: 'Bom dia', emoji: '☀️', sendsMessage: true },
  { id: 'parabens', label: 'Parabéns', emoji: '🎂', sendsMessage: true },
  { id: 'gratidao', label: 'Gratidão', emoji: '🙏', sendsMessage: true },
  { id: 'desculpa', label: 'Desculpa', emoji: '🤝', sendsMessage: true },
  { id: 'presente', label: 'Presente', emoji: '🎁', sendsMessage: false },
  { id: 'tarefa', label: 'Tarefa em casa', emoji: '🏠', sendsMessage: false },
];

export const categoryById = (id: CategoryId): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
