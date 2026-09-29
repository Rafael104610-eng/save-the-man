import { Alert, Linking } from 'react-native';

/** Mantém só dígitos; assume Brasil (55) quando o número vem sem DDI. */
export const normalizePhone = (raw: string): string | undefined => {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 10) return undefined;
  if (digits.length <= 11) return `55${digits}`;
  return digits;
};

/** Abre o WhatsApp com a mensagem pronta. A pessoa só precisa apertar enviar. */
export async function openWhatsApp(message: string, phone?: string): Promise<void> {
  const text = encodeURIComponent(message);
  const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Não foi possível abrir o WhatsApp', 'Confira se o WhatsApp está instalado no seu celular.');
  }
}
