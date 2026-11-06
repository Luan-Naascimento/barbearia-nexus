// Porta de entrada: manda cada pessoa para a área do seu papel
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/lib/auth';
import { Carregando } from '../src/components/ui';
import { cor, fonte } from '../src/theme';

export default function Entrada() {
  const { carregando, usuario, perfil, papel, modo, sair } = useAuth();
  if (carregando) return <Carregando />;
  if (!usuario) return <Redirect href="/login" />;
  if (!perfil || !papel) {
    // Conta existe mas o perfil ainda não chegou (ou foi apagado)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: cor.fundo }}>
        <ActivityIndicator color={cor.tinta} />
        <Pressable onPress={sair}>
          <Text style={{ fontFamily: fonte.forte, fontSize: 16, color: cor.suave }}>Sair da conta</Text>
        </Pressable>
      </View>
    );
  }
  const destino = papel === 'admin' ? (modo === 'admin' ? '/admin' : `/${modo}`) : `/${papel}`;
  return <Redirect href={destino as any} />;
}
