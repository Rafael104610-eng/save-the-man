import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, Field, Row } from '../../components/ui';
import { CATEGORIES, categoryById } from '../../data/categories';
import { DEFAULT_MESSAGES } from '../../data/messages';
import { CategoryId } from '../../data/types';
import { useApp } from '../../store/AppContext';
import { colors } from '../../theme';

export default function Messages() {
  const { customMessages, addCustomMessage, deleteCustomMessage } = useApp();
  const messageCategories = CATEGORIES.filter((c) => c.sendsMessage);
  const [category, setCategory] = useState<CategoryId>('elogio');
  const [text, setText] = useState('');

  const defaults = DEFAULT_MESSAGES[category] ?? [];
  const mine = customMessages.filter((m) => m.category === category);

  const add = () => {
    if (!text.trim()) return;
    addCustomMessage(category, text.trim());
    setText('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Row>
        {messageCategories.map((c) => (
          <Chip key={c.id} label={`${c.emoji} ${c.label}`} selected={c.id === category} onPress={() => setCategory(c.id)} />
        ))}
      </Row>

      <Text style={styles.section}>Minhas mensagens — {categoryById(category).label}</Text>
      {mine.map((m) => (
        <Card key={m.id}>
          <Text style={styles.msg}>{m.text}</Text>
          <Pressable
            onPress={() =>
              Alert.alert('Apagar mensagem?', undefined, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Apagar', style: 'destructive', onPress: () => deleteCustomMessage(m.id) },
              ])
            }
          >
            <Text style={styles.delete}>Apagar</Text>
          </Pressable>
        </Card>
      ))}
      <Field
        label="Escrever nova (use {nome} para o nome da pessoa)"
        value={text}
        onChangeText={setText}
        multiline
        placeholder="Ex.: {nome}, você é o amor da minha vida ❤️"
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />
      <Button label="Salvar mensagem" variant="secondary" onPress={add} disabled={!text.trim()} style={{ marginBottom: 24 }} />

      <Text style={styles.section}>Mensagens prontas</Text>
      {defaults.map((m) => (
        <Card key={m}>
          <Text style={styles.msg}>{m}</Text>
        </Card>
      ))}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  section: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10 },
  msg: { fontSize: 15, color: colors.text, lineHeight: 21 },
  delete: { marginTop: 8, color: colors.danger, fontWeight: '600' },
});
