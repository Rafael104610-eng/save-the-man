import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Empty } from '../../components/ui';
import { categoryById } from '../../data/categories';
import { currentStreak, formatTime, isDueOn, toDateKey } from '../../services/dates';
import { useApp } from '../../store/AppContext';
import { colors } from '../../theme';

export default function Today() {
  const { reminders, people, doneDays, hydrated } = useApp();
  if (!hydrated) return null;

  const today = new Date();
  const key = toDateKey(today);
  const due = reminders
    .filter((r) => isDueOn(r, today))
    .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
  const pending = due.filter((r) => r.lastDone !== key);
  const done = due.filter((r) => r.lastDone === key);
  const streak = currentStreak(doneDays);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.hero}>
        <Text style={styles.heroTitle}>
          {pending.length === 0 && due.length > 0 ? 'Tudo em dia hoje! 💖' : 'Hoje é dia de cuidar de quem você ama'}
        </Text>
        <Text style={styles.heroText}>
          {streak > 0
            ? `🔥 ${streak} ${streak === 1 ? 'dia seguido' : 'dias seguidos'} cuidando dos seus`
            : 'Conclua um lembrete para começar sua sequência.'}
        </Text>
      </Card>

      {due.length === 0 ? (
        <Empty
          emoji="🌷"
          title="Nenhum lembrete para hoje"
          text="Crie sua primeira rotina na aba Lembretes. Ex.: elogiar, mandar bom dia, tirar o lixo."
        />
      ) : null}

      {[...pending, ...done].map((r) => {
        const cat = categoryById(r.category);
        const person = people.find((p) => p.id === r.personId);
        const isDone = r.lastDone === key;
        return (
          <Pressable key={r.id} onPress={() => router.push({ pathname: '/lembrete/[id]', params: { id: r.id } })}>
            <Card style={[styles.row, isDone && { backgroundColor: colors.successSoft }]}>
              <Text style={{ fontSize: 28 }}>{isDone ? '✅' : cat.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, isDone && styles.doneTitle]}>{r.title}</Text>
                <Text style={styles.meta}>
                  {person ? `${person.name} · ` : ''}
                  {formatTime(r.hour, r.minute)}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Card>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  hero: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  heroTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  heroText: { fontSize: 14, color: colors.muted, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  doneTitle: { textDecorationLine: 'line-through', color: colors.muted },
  meta: { fontSize: 13, color: colors.muted, marginTop: 2 },
  chevron: { fontSize: 28, color: colors.muted },
});
