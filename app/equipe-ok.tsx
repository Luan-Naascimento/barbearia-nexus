// Tela 14 · Barbeiro: entrou na equipe
import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/lib/auth';
import { Botao, Subtitulo, Tela, Titulo } from '../src/components/ui';
import { Icone } from '../src/components/Icone';
import { cor } from '../src/theme';

export default function EquipeOk() {
  const router = useRouter();
  const { segurarPapel } = useAuth();
  return (
    <Tela topo>
      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: cor.tinta, alignItems: 'center', justifyContent: 'center' }}>
          <Icone nome="check" cor={cor.branco} tamanho={44} espessura={2.6} />
        </View>
        <Titulo estilo={{ marginTop: 28 }}>Você entrou na equipe!</Titulo>
        <Subtitulo>Agora você vê a agenda dos seus clientes e confirma ou cancela cada reserva.</Subtitulo>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <Botao
          texto="Ver minha agenda"
          aoPressar={() => {
            segurarPapel(null);
            router.replace('/');
          }}
        />
      </View>
    </Tela>
  );
}
