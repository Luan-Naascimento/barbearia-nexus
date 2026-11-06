// Tela 6 · Confirmação da reserva
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../src/lib/auth';
import { reservar } from '../../src/lib/dados';
import { dataDeChave, dataLonga } from '../../src/lib/datas';
import { Botao, BotaoVoltar, Cartao, Erro, Tela, Titulo } from '../../src/components/ui';
import { cor, fonte } from '../../src/theme';

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={{ paddingVertical: 12, borderTopWidth: 1, borderTopColor: cor.linha }}>
      <Text style={{ fontFamily: fonte.forte, fontSize: 14, color: cor.suave }}>{rotulo}</Text>
      <Text style={{ fontFamily: fonte.forte, fontSize: 19, color: cor.tinta, marginTop: 2 }}>{valor}</Text>
    </View>
  );
}

export default function Confirmacao() {
  const router = useRouter();
  const { perfil } = useAuth();
  const p = useLocalSearchParams<{ barbeiroId: string; barbeiroNome: string; dia: string; hora: string }>();
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function confirmar() {
    if (!perfil) return;
    setErro('');
    setOcupado(true);
    try {
      await reservar({
        cliente: { uid: perfil.uid, nome: perfil.nome },
        barbeiro: { id: String(p.barbeiroId), nome: String(p.barbeiroNome) },
        dia: String(p.dia),
        hora: String(p.hora),
      });
      Alert.alert('Horário reservado!', 'O barbeiro vai confirmar em breve.');
      router.dismissAll();
    } catch (e: any) {
      if (e?.code === 'permission-denied') {
        // Outra pessoa pegou o mesmo horário no mesmo instante
        setErro('Esse horário acabou de ser reservado. Volte e escolha outro.');
      } else {
        setErro('Não foi possível reservar. Tente de novo.');
      }
    } finally {
      setOcupado(false);
    }
  }

  return (
    <Tela rolar topo>
      <View style={{ paddingHorizontal: 24 }}>
        <BotaoVoltar />
        <Titulo estilo={{ marginTop: 24 }}>Confirmar reserva</Titulo>
      </View>
      <Cartao estilo={{ marginTop: 24, paddingTop: 8, paddingBottom: 8 }}>
        <Linha rotulo="Data" valor={dataLonga(dataDeChave(String(p.dia)))} />
        <Linha rotulo="Horário" valor={String(p.hora)} />
        <Linha rotulo="Barbeiro" valor={String(p.barbeiroNome)} />
        <Linha rotulo="Lembrete" valor={perfil?.lembrete ? '1 hora antes' : 'Desligado'} />
      </Cartao>
      <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
        <Erro texto={erro} />
        <Botao texto="Confirmar reserva" aoPressar={confirmar} carregando={ocupado} estilo={{ marginTop: 8 }} />
      </View>
    </Tela>
  );
}
