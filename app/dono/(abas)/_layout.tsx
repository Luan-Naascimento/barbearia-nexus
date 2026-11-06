import React from 'react';
import { Tabs } from 'expo-router';
import { Aba, BarraAbas } from '../../../src/components/BarraAbas';

const ABAS: Aba[] = [
  { nome: 'index', rotulo: 'Painel', icone: 'painel' },
  { nome: 'barbeiros', rotulo: 'Barbeiros', icone: 'equipe' },
  { nome: 'perfil', rotulo: 'Meu perfil', icone: 'perfil' },
];

export default function AbasDono() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(p: any) => <BarraAbas {...p} abas={ABAS} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="barbeiros" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}
