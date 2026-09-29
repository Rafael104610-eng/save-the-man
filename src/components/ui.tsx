import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors, radius } from '../theme';

export function Button({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const bg = { primary: colors.primary, secondary: colors.primarySoft, danger: colors.card, success: colors.success }[variant];
  const fg = { primary: '#fff', secondary: colors.primary, danger: colors.danger, success: '#fff' }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === 'danger' && { borderWidth: 1, borderColor: colors.danger },
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Field({ label, ...props }: { label: string } & TextInputProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted} {...props} style={[styles.input, props.style]} />
    </View>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function Empty({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <View style={styles.empty}>
      <Text style={{ fontSize: 48 }}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

export const Row = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }, style]}>{children}</View>
);

const styles = StyleSheet.create({
  button: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: radius, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '700' },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 14 },
  chipTextSelected: { color: '#fff', fontWeight: '700' },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 12 },
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 6 },
});
