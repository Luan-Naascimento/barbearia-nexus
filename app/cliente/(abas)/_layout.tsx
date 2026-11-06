
import React from 'react';
import { Tabs } from 'expo-router';
import { Aba, BarraAbas } from '../../../src/components/BarraAbas';

const ABAS: Aba[] = [
  { rota: '/cliente', rotulo: 'Início', icone: 'inicio' },
  { rota: '/cliente/perfil', rotulo: 'Perfil', icone: 'perfil' },
];

export default function AbasCliente() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={() => <BarraAbas abas={ABAS} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}
