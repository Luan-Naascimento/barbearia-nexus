// Raiz do app: fontes, login e navegação
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Nunito_500Medium, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts,
} from '@expo-google-fonts/nunito';
import { AuthProvider } from '../src/lib/auth';
import { cor } from '../src/theme';
import '../src/lib/notificacoes'; // liga o tratamento das notificações

export default function Raiz() {
  const [fontesOk] = useFonts({ Nunito_500Medium, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black });
  if (!fontesOk) return null;
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cor.fundo } }} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
