// Tela 20 · Dono: tudo pronto
import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Botao, Subtitulo, Tela, Titulo } from '../../src/components/ui';
import { Icone } from '../../src/components/Icone';
import { cor } from '../../src/theme';

export default function DonoPronto() {
  const router = useRouter();
  return (
    <Tela topo>
      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: cor.tinta, alignItems: 'center', justifyContent: 'center' }}>
          <Icone nome="check" cor={cor.branco} tamanho={44} espessura={2.6} />
        </View>
        <Titulo estilo={{ marginTop: 28 }}>Tudo pronto!</Titulo>
        <Subtitulo>
          Sua conta de dono foi criada. Agora defina os dias e horários da barbearia no seu perfil.
        </Subtitulo>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <Botao texto="Abrir meu painel" aoPressar={() => router.replace('/')} />
      </View>
    </Tela>
  );
}
