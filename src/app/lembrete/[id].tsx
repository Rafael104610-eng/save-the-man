import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Empty, Field } from '../../components/ui';
import { categoryById } from '../../data/categories';
import { DEFAULT_MESSAGES, applyName } from '../../data/messages';
import { describeSchedule, toDateKey } from '../../services/dates';
import { openWhatsApp } from '../../services/whatsapp';
import { useApp } from '../../store/AppContext';
import { colors } from '../../theme';

export default function ReminderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reminders, people, customMessages, markDone, deleteReminder } = useApp();
  const reminder = reminders.find((r) => r.id === id);
  const person = people.find((p) => p.id === reminder?.personId);

  const initialMessage = () => {
    if (!reminder) return '';
    const fallback = DEFAULT_MESSAGES[reminder.category]?.[0] ?? '';
    return applyName(reminder.message ?? fallback, person?.name);
  };
  const [message, setMessage] = useState(initialMessage);
  const [suggestion, setSuggestion] = useState(1);

  if (!reminder) {
    return <Empty emoji="🤷" title="Lembrete não encontrado" text="Ele pode ter sido apagado." />;
  }

  const cat = categoryById(reminder.category);
  const doneToday = reminder.lastDone === toDateKey();

  const shuffle = () => {
    const pool = [
      ...(DEFAULT_MESSAGES[reminder.category] ?? []),
      ...customMessages.filter((m) => m.category === reminder.category).map((m) => m.text),
    ];
    if (pool.length === 0) return;
    setMessage(applyName(pool[suggestion % pool.length], person?.name));
    setSuggestion(suggestion + 1);
  };

  const send = async () => {
    await openWhatsApp(message, person?.phone);
  };

  const confirmDelete = () =>
    Alert.alert('Apagar lembrete?', undefined, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          await deleteReminder(reminder.id);
          router.back();
        },
      },
    ]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Card>
        <Text style={{ fontSize: 40 }}>{cat.emoji}</Text>
        <Text style={styles.title}>{reminder.title}</Text>
        <Text style={styles.meta}>
          {person ? `${person.name} · ` : ''}
          {describeSchedule(reminder)}
        </Text>
      </Card>

      {cat.sendsMessage ? (
        <View>
          <Field
            label="Mensagem (você pode editar antes de enviar)"
            value={message}
            onChangeText={setMessage}
            multiline
            style={{ minHeight: 110, textAlignVertical: 'top' }}
          />
          <Button label="✨ Outra sugestão" variant="secondary" onPress={shuffle} style={{ marginBottom: 12 }} />
          <Button
            label={person?.phone ? `Enviar no WhatsApp para ${person.name}` : 'Enviar no WhatsApp'}
            onPress={send}
            disabled={!message.trim()}
            style={{ marginBottom: 12 }}
          />
          {!person?.phone ? (
            <Text style={styles.hint}>Sem número cadastrado, o WhatsApp vai pedir para você escolher o contato.</Text>
          ) : null}
        </View>
      ) : null}

      <Button
        label={doneToday ? 'Desmarcar como feito' : '✅ Marcar como feito'}
        variant={doneToday ? 'secondary' : 'success'}
        onPress={() => markDone(reminder.id, !doneToday)}
        style={{ marginBottom: 12 }}
      />
      <Button
        label="Editar lembrete"
        variant="secondary"
        onPress={() => router.push({ pathname: '/lembrete-form', params: { id: reminder.id } })}
        style={{ marginBottom: 12 }}
      />
      <Button label="Apagar lembrete" variant="danger" onPress={confirmDelete} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 8 },
  meta: { fontSize: 14, color: colors.muted, marginTop: 4 },
  hint: { fontSize: 13, color: colors.muted, marginBottom: 16 },
});
