// Tela 7 · Perfil do cliente
import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/lib/auth';
import { definirLembrete } from '../../../src/lib/dados';
import { pedirPermissao } from '../../../src/lib/notificacoes';
import { Avatar, Botao, LinhaChave, LinhaCartao, Tela, Titulo } from '../../../src/components/ui';
import { cor, fonte } from '../../../src/theme';

export default function PerfilCliente() {
  const router = useRouter();
  const { perfil, sair } = useAuth();
  if (!perfil) return null;

  async function mudarLembrete(v: boolean) {
    if (v) await pedirPermissao();
    await definirLembrete(perfil!.uid, v);
  }

  return (
    <Tela rolar topo>
      <Titulo estilo={{ paddingHorizontal: 24 }}>Perfil</Titulo>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 24, marginTop: 20 }}>
        <Avatar nome={perfil.nome} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonte.preta, fontSize: 22, color: cor.tinta }}>{perfil.nome}</Text>
          <Text style={{ fontFamily: fonte.media, fontSize: 15, color: cor.suave, marginTop: 2 }}>{perfil.email}</Text>
        </View>
      </View>

      <LinhaChave
        estilo={{ marginTop: 24 }}
        titulo="Lembrete"
        subtitulo="Aviso 1 hora antes do horário"
        ligado={perfil.lembrete}
        aoMudar={mudarLembrete}
      />
      <LinhaCartao
        estilo={{ marginTop: 12 }}
        icone="qr"
        titulo="Sou da equipe"
        subtitulo="Ler o QR code do dono"
        aoPressar={() => router.push('/ler-qr')}
      />
      <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
        <Botao tipo="contorno" texto="Sair" aoPressar={sair} />
      </View>
    </Tela>
  );
}
