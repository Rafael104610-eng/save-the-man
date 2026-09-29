import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { colors } from '../../theme';

function TabEmoji({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.text },
        tabBarActiveTintColor: colors.primary,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Hoje', tabBarIcon: () => <TabEmoji emoji="❤️" /> }} />
      <Tabs.Screen name="lembretes" options={{ title: 'Lembretes', tabBarIcon: () => <TabEmoji emoji="⏰" /> }} />
      <Tabs.Screen name="pessoas" options={{ title: 'Pessoas', tabBarIcon: () => <TabEmoji emoji="👨‍👩‍👧" /> }} />
      <Tabs.Screen name="mensagens" options={{ title: 'Mensagens', tabBarIcon: () => <TabEmoji emoji="💌" /> }} />
    </Tabs>
  );
}
