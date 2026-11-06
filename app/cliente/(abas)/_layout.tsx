import React from 'react';
import { Tabs } from 'expo-router';
import { Aba, BarraAbas } from '../../../src/components/BarraAbas';

const ABAS: Aba[] = [
  { nome: 'index', rotulo: 'Início', icone: 'inicio' },
  { nome: 'perfil', rotulo: 'Perfil', icone: 'perfil' },
];

export default function AbasCliente() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(p: any) => <BarraAbas {...p} abas={ABAS} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}
