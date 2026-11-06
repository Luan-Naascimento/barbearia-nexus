// Área do cliente: só entra quem é cliente (o administrador também, em "ver como")
import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { usePermissao } from '../../src/lib/auth';
import { Carregando } from '../../src/components/ui';

export default function LayoutCliente() {
  const ok = usePermissao('cliente');
  if (ok === 'carregando') return <Carregando />;
  if (ok === 'negado') return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
