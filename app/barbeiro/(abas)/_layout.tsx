
import React from 'react';
import { Tabs } from 'expo-router';
import { Aba, BarraAbas } from '../../../src/components/BarraAbas';

const ABAS: Aba[] = [
  { rota: '/barbeiro', rotulo: 'Início', icone: 'inicio' },
  { rota: '/barbeiro/agenda', rotulo: 'Agenda', icone: 'agenda' },
  { rota: '/barbeiro/perfil', rotulo: 'Perfil', icone: 'perfil' },
];

export default function AbasBarbeiro() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(p: any) => <BarraAbas {...p} abas={ABAS} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="agenda" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}
