export type Relation =
  | 'esposa'
  | 'marido'
  | 'namorado(a)'
  | 'filho(a)'
  | 'pai'
  | 'mae'
  | 'avo'
  | 'irmao(a)'
  | 'amigo(a)'
  | 'outro';

export type Person = {
  id: string;
  name: string;
  relation: Relation;
  /** Só dígitos, com DDI (ex.: 5511999998888). Opcional. */
  phone?: string;
};

export type CategoryId =
  | 'elogio'
  | 'saudade'
  | 'bomdia'
  | 'parabens'
  | 'gratidao'
  | 'desculpa'
  | 'presente'
  | 'tarefa';

export type Repeat = 'daily' | 'weekly' | 'yearly' | 'once';

export type Reminder = {
  id: string;
  title: string;
  category: CategoryId;
  personId?: string;
  /** Texto que será enviado no WhatsApp. Aceita {nome}. */
  message?: string;
  repeat: Repeat;
  hour: number;
  minute: number;
  /** 1 = domingo ... 7 = sábado (usado em 'weekly') */
  weekday?: number;
  /** Usados em 'yearly' e 'once' */
  day?: number;
  /** 1–12 */
  month?: number;
  year?: number;
  enabled: boolean;
  notificationIds: string[];
  /** Última data (AAAA-MM-DD) em que foi marcado como feito */
  lastDone?: string;
};

export type CustomMessage = {
  id: string;
  category: CategoryId;
  text: string;
};

export type AppData = {
  people: Person[];
  reminders: Reminder[];
  customMessages: CustomMessage[];
  /** Dias (AAAA-MM-DD) em que ao menos um lembrete foi concluído */
  doneDays: string[];
};
