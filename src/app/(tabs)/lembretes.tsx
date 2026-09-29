import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Button, Card, Empty, Label } from '../../components/ui';
import { categoryById } from '../../data/categories';
import { TEMPLATES } from '../../data/templates';
import { describeSchedule } from '../../services/dates';
import { useApp } from '../../store/AppContext';
import { colors } from '../../theme';

export default function Reminders() {
  const { reminders, people, toggleReminder } = useApp();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button label="＋ Novo lembrete" onPress={() => router.push('/lembrete-form')} style={{ marginBottom: 16 }} />

      {reminders.length === 0 ? (
        <Empty emoji="⏰" title="Nenhum lembrete ainda" text="Comece com uma sugestão abaixo ou crie o seu." />
      ) : null}

      {reminders.map((r) => {
        const cat = categoryById(r.category);
        const person = people.find((p) => p.id === r.personId);
        return (
          <Pressable key={r.id} onPress={() => router.push({ pathname: '/lembrete/[id]', params: { id: r.id } })}>
            <Card style={styles.row}>
              <Text style={{ fontSize: 26 }}>{cat.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{r.title}</Text>
                <Text style={styles.meta}>
                  {person ? `${person.name} · ` : ''}
                  {describeSchedule(r)}
                </Text>
              </View>
              <Switch
                value={r.enabled}
                onValueChange={(v) => toggleReminder(r.id, v)}
                trackColor={{ true: colors.primary }}
              />
            </Card>
          </Pressable>
        );
      })}

      <View style={{ marginTop: 16 }}>
        <Label>Sugestões de rotina</Label>
        {TEMPLATES.map((t) => (
          <Pressable
            key={t.title}
            onPress={() =>
              router.push({
                pathname: '/lembrete-form',
                params: {
                  title: t.title,
                  category: t.category,
                  repeat: t.repeat,
                  hour: String(t.hour),
                  minute: String(t.minute),
                  ...(t.weekday ? { weekday: String(t.weekday) } : {}),
                },
              })
            }
          >
            <Card style={styles.row}>
              <Text style={{ fontSize: 22 }}>{categoryById(t.category).emoji}</Text>
              <Text style={[styles.title, { flex: 1 }]}>{t.title}</Text>
              <Text style={{ color: colors.primary, fontWeight: '700' }}>Usar</Text>
            </Card>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.muted, marginTop: 2 },
});
