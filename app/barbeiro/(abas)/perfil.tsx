// Tela 17 · Perfil do barbeiro
import React from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../../../src/lib/auth';
import { definirLembrete } from '../../../src/lib/dados';
import { pedirPermissao } from '../../../src/lib/notificacoes';
import { Avatar, Botao, LinhaChave, Tela, Titulo } from '../../../src/components/ui';
import { cor, fonte } from '../../../src/theme';

export default function PerfilBarbeiro() {
  const { perfil, sair } = useAuth();
  if (!perfil) return null;

  async function mudar(v: boolean) {
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
          <Text style={{ fontFamily: fonte.media, fontSize: 15, color: cor.suave, marginTop: 2 }}>Barbeiro da equipe</Text>
        </View>
      </View>
      <LinhaChave
        estilo={{ marginTop: 24 }}
        titulo="Notificações"
        subtitulo="Aviso 1 hora antes de cada cliente"
        ligado={perfil.lembrete}
        aoMudar={mudar}
      />
      <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
        <Botao tipo="contorno" texto="Sair" aoPressar={sair} />
      </View>
    </Tela>
  );
}
