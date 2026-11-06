// Tela 9 · Dono: lista de barbeiros, descadastrar e gerar QR code
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { descadastrarBarbeiro, ouvirBarbeiros } from '../../../src/lib/dados';
import { erroAmigavel } from '../../../src/lib/erros';
import { Barbeiro } from '../../../src/lib/tipos';
import { Avatar, Botao, Subtitulo, Tela, Titulo, Vazio, perguntar } from '../../../src/components/ui';
import { cor, fonte } from '../../../src/theme';

export default function BarbeirosDono() {
  const router = useRouter();
  const [lista, setLista] = useState<Barbeiro[] | null>(null);

  useEffect(() => ouvirBarbeiros((l) => setLista(l.filter((b) => b.funcao === 'barbeiro'))), []);

  function descadastrar(b: Barbeiro) {
    perguntar('Descadastrar barbeiro?', `${b.nome} deixa de aparecer para os clientes e perde o acesso à agenda.`, 'Descadastrar', async () => {
      try {
        await descadastrarBarbeiro(b.id);
      } catch (e) {
        Alert.alert('Não foi possível descadastrar', erroAmigavel(e));
      }
    });
  }

  return (
    <Tela rolar topo>
      <View style={{ paddingHorizontal: 24 }}>
        <Titulo>Barbeiros</Titulo>
        <Subtitulo>Quem trabalha com você.</Subtitulo>
      </View>

      {lista !== null && lista.length === 0 ? (
        <Vazio titulo="Nenhum barbeiro ainda" texto="Gere um QR code e peça para o barbeiro lê-lo no perfil dele." />
      ) : (
        <View style={{ paddingHorizontal: 24, marginTop: 24, gap: 12 }}>
          {(lista ?? []).map((b) => (
            <View key={b.id} style={{ backgroundColor: cor.branco, borderRadius: 28, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <Avatar nome={b.nome} tamanho={52} />
              <Text style={{ flex: 1, fontFamily: fonte.forte, fontSize: 18, color: cor.tinta }}>{b.nome}</Text>
              <Botao pequeno tipo="claro" texto="Descadastrar" aoPressar={() => descadastrar(b)} />
            </View>
          ))}
        </View>
      )}

      <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
        <Botao texto="Gerar QR code" aoPressar={() => router.push('/dono/qr-equipe')} />
      </View>
    </Tela>
  );
}
