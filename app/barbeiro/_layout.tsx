// Área do barbeiro
import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { usePermissao } from '../../src/lib/auth';
import { Carregando } from '../../src/components/ui';

export default function LayoutBarbeiro() {
  const ok = usePermissao('barbeiro');
  if (ok === 'carregando') return <Carregando />;
  if (ok === 'negado') return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
