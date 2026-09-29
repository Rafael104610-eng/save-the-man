import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { configureNotifications } from '../services/notifications';
import { AppProvider } from '../store/AppContext';
import { colors } from '../theme';

configureNotifications();

function useOpenReminderOnTap() {
  const response = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (response?.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
    const id = response.notification.request.content.data?.reminderId;
    if (typeof id === 'string') router.push({ pathname: '/lembrete/[id]', params: { id } });
  }, [response]);
}

export default function RootLayout() {
  useOpenReminderOnTap();
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lembrete/[id]" options={{ title: 'Lembrete' }} />
        <Stack.Screen name="lembrete-form" options={{ title: 'Lembrete', presentation: 'modal' }} />
        <Stack.Screen name="pessoa-form" options={{ title: 'Pessoa', presentation: 'modal' }} />
      </Stack>
    </AppProvider>
  );
}
