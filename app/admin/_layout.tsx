// Área do administrador geral (você)
import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/lib/auth';
import { Carregando } from '../../src/components/ui';

export default function LayoutAdmin() {
  const { carregando, usuario, perfil } = useAuth();
  if (carregando || (usuario && !perfil)) return <Carregando />;
  if (!perfil || perfil.papel !== 'admin') return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
