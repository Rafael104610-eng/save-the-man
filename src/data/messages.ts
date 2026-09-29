import { CategoryId } from './types';

/** Use {nome} onde o nome da pessoa deve aparecer. */
export const DEFAULT_MESSAGES: Partial<Record<CategoryId, string[]>> = {
  elogio: [
    '{nome}, você deixa meus dias mais leves só por existir. Obrigado por ser quem você é. ❤️',
    'Passei o dia pensando em como você é especial, {nome}. Queria que você soubesse disso.',
    '{nome}, admiro muito a pessoa que você é. Você me inspira todos os dias.',
    'Hoje só quero te dizer: você é incrível, {nome}! 🌹',
    'Que sorte a minha ter você na minha vida, {nome}.',
  ],
  saudade: [
    'Oi, {nome}! Bateu saudade aqui. Como você está? 💌',
    'Estava pensando em você, {nome}. Me conta como foi o seu dia?',
    '{nome}, sinto falta de você. Vamos marcar de nos ver?',
    'Passando só para dizer que você está no meu pensamento hoje. ❤️',
    'Oi, {nome}! Faz um tempinho que a gente não conversa. Estou com saudade!',
  ],
  bomdia: [
    'Bom dia, {nome}! Que seu dia seja lindo e leve. ☀️',
    'Bom dia, {nome}! Desejo um dia cheio de coisas boas para você. ❤️',
    'Bom dia! Acordei pensando em você, {nome}. Tenha um ótimo dia!',
    'Bom dia, {nome}! Você merece um dia incrível hoje. ☕',
  ],
  parabens: [
    'Parabéns, {nome}! 🎂 Que você tenha um ano cheio de saúde, alegria e amor. Te amo!',
    'Feliz aniversário, {nome}! Você merece todas as coisas boas do mundo. 🎉',
    '{nome}, hoje é o seu dia! Que Deus te abençoe sempre. Parabéns! 🎈',
    'Parabéns pela sua vida, {nome}! Obrigado por fazer parte da minha. ❤️',
  ],
  gratidao: [
    'Obrigado por tudo que você faz, {nome}. Eu reconheço e valorizo muito. 🙏',
    '{nome}, queria agradecer por estar sempre ao meu lado.',
    'Só passando para dizer: obrigado por existir na minha vida, {nome}. ❤️',
  ],
  desculpa: [
    '{nome}, me desculpa pelo que aconteceu. Quero que a gente fique bem. 🤝',
    'Refleti e percebi que errei, {nome}. Me perdoa? Você é muito importante para mim.',
    '{nome}, não gosto de ficar mal com você. Podemos conversar?',
  ],
};

export const applyName = (text: string, name?: string): string =>
  text.replace(/\{nome\}/g, name ? name.split(' ')[0] : '').replace(/\s+([,!.?])/g, '$1').trim();
