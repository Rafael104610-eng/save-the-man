import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Button, Chip, Field, Label, Row } from '../components/ui';
import { Person, Relation } from '../data/types';
import { normalizePhone } from '../services/whatsapp';
import { useApp } from '../store/AppContext';

const RELATIONS: Relation[] = ['esposa', 'marido', 'namorado(a)', 'filho(a)', 'pai', 'mae', 'avo', 'irmao(a)', 'amigo(a)', 'outro'];
const RELATION_LABEL: Record<Relation, string> = {
  esposa: 'Esposa',
  marido: 'Marido',
  'namorado(a)': 'Namorado(a)',
  'filho(a)': 'Filho(a)',
  pai: 'Pai',
  mae: 'Mãe',
  avo: 'Avó/Avô',
  'irmao(a)': 'Irmão(ã)',
  'amigo(a)': 'Amigo(a)',
  outro: 'Outro',
};

export default function PersonForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { people, savePerson, deletePerson } = useApp();
  const existing: Person | undefined = people.find((p) => p.id === id);

  const [name, setName] = useState(existing?.name ?? '');
  const [relation, setRelation] = useState<Relation>(existing?.relation ?? 'esposa');
  const [phone, setPhone] = useState(existing?.phone ?? '');

  const phoneDigits = phone.trim() ? normalizePhone(phone) : undefined;
  const phoneInvalid = phone.trim().length > 0 && !phoneDigits;

  const save = () => {
    if (!name.trim() || phoneInvalid) return;
    savePerson({ id: existing?.id, name: name.trim(), relation, phone: phoneDigits });
    router.back();
  };

  const remove = () => {
    if (!existing) return;
    Alert.alert('Apagar pessoa?', 'Os lembretes ligados a ela também serão apagados.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          await deletePerson(existing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Field label="Nome" value={name} onChangeText={setName} placeholder="Ex.: Maria" autoFocus={!existing} />
      <Label>Quem é essa pessoa para você?</Label>
      <Row>
        {RELATIONS.map((r) => (
          <Chip key={r} label={RELATION_LABEL[r]} selected={relation === r} onPress={() => setRelation(r)} />
        ))}
      </Row>
      <Field
        label="WhatsApp (opcional)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="(11) 99999-8888"
      />
      {phoneInvalid ? <Label>Digite o DDD + número.</Label> : null}
      <Button label="Salvar" onPress={save} disabled={!name.trim() || phoneInvalid} />
      {existing ? <Button label="Apagar pessoa" variant="danger" onPress={remove} style={{ marginTop: 12 }} /> : null}
    </ScrollView>
  );
}
