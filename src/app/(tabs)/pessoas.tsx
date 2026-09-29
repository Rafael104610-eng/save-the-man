import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Empty } from '../../components/ui';
import { useApp } from '../../store/AppContext';
import { colors } from '../../theme';

export default function People() {
  const { people, reminders } = useApp();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button label="＋ Nova pessoa" onPress={() => router.push('/pessoa-form')} style={{ marginBottom: 16 }} />
      {people.length === 0 ? (
        <Empty
          emoji="👨‍👩‍👧"
          title="Quem você quer cuidar?"
          text="Cadastre sua esposa, marido, filhos, pais, avós, amigos..."
        />
      ) : null}
      {people.map((p) => {
        const count = reminders.filter((r) => r.personId === p.id).length;
        return (
          <Pressable key={p.id} onPress={() => router.push({ pathname: '/pessoa-form', params: { id: p.id } })}>
            <Card style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{p.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.meta}>
                  {p.relation} · {count} {count === 1 ? 'lembrete' : 'lembretes'}
                </Text>
              </View>
            </Card>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: colors.primary },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.muted, marginTop: 2 },
});
