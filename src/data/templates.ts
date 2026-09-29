import { CategoryId, Repeat } from './types';

/** Sugestões de rotina para o usuário criar com um toque. */
export type Template = {
  title: string;
  category: CategoryId;
  repeat: Repeat;
  hour: number;
  minute: number;
  weekday?: number;
};

export const TEMPLATES: Template[] = [
  { title: 'Elogiar hoje', category: 'elogio', repeat: 'daily', hour: 18, minute: 0 },
  { title: 'Mandar bom dia', category: 'bomdia', repeat: 'daily', hour: 8, minute: 0 },
  { title: 'Mandar mensagem de saudade', category: 'saudade', repeat: 'weekly', weekday: 1, hour: 10, minute: 0 },
  { title: 'Fazer um café para ela(e)', category: 'tarefa', repeat: 'daily', hour: 7, minute: 30 },
  { title: 'Tirar o lixo', category: 'tarefa', repeat: 'weekly', weekday: 3, hour: 19, minute: 0 },
  { title: 'Passar no açougue', category: 'tarefa', repeat: 'weekly', weekday: 6, hour: 9, minute: 0 },
];
