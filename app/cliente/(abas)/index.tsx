// Tela 2 · Início do cliente: próximo horário, cancelar, reservar
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/lib/auth';
import { cancelarAgendamento, ouvirDoCliente } from '../../../src/lib/dados';
import { dataDeChave, dataLonga } from '../../../src/lib/datas';
import { sincronizarLembretes } from '../../../src/lib/notificacoes';
import { erroAmigavel } from '../../../src/lib/erros';
import { Agendamento } from '../../../src/lib/tipos';
import { NOME_BARBEARIA } from '../../../src/config';
import { Botao, CabecalhoEscuro, Cartao, Tela, perguntar } from '../../../src/components/ui';
import { Alert } from 'react-native';
import { cor, fonte } from '../../../src/theme';

export default function InicioCliente() {
  const router = useRouter();
  const { perfil } = useAuth();
  const [ags, setAgs] = useState<Agendamento[] | null>(null);

  useEffect(() => {
    if (!perfil) return;
    return ouvirDoCliente(perfil.uid, setAgs);
  }, [perfil?.uid]);

  // Mantém os lembretes do celular iguais aos horários marcados
  useEffect(() => {
    if (ags && perfil) {
      sincronizarLembretes(ags, perfil.lembrete, (a) => `Hoje às ${a.hora} com ${a.barbeiroNome}.`);
    }
  }, [ags, perfil?.lembrete]);

  const proximo = ags?.find((a) => a.inicioMs >= Date.now());
  const primeiroNome = (perfil?.nome ?? '').split(' ')[0];

  function cancelar(a: Agendamento) {
    perguntar('Cancelar horário?', `${a.hora} com ${a.barbeiroNome}.`, 'Cancelar horário', async () => {
      try {
        await cancelarAgendamento(a);
      } catch (e) {
        Alert.alert('Não foi possível cancelar', erroAmigavel(e));
      }
    });
  }

  return (
    <Tela rolar barra="light">
      <CabecalhoEscuro selo={NOME_BARBEARIA} titulo={`Olá, ${primeiroNome}`} subtitulo="Seu próximo horário" />

      <Cartao estilo={{ marginTop: 24, gap: 12 }}>
        {proximo ? (
          <>
            <Text style={{ fontFamily: fonte.forte, fontSize: 15, color: cor.suave }}>
              {dataLonga(dataDeChave(proximo.dia))}
            </Text>
            <Text style={{ fontFamily: fonte.preta, fontSize: 44, color: cor.tinta }}>{proximo.hora}</Text>
            <View>
              <Text style={{ fontFamily: fonte.forte, fontSize: 18, color: cor.tinta }}>com {proximo.barbeiroNome}</Text>
              <Text style={{ fontFamily: fonte.media, fontSize: 14, color: cor.suave, marginTop: 2 }}>
                {proximo.status === 'confirmado' ? 'Confirmado pelo barbeiro' : 'Aguardando confirmação'}
              </Text>
            </View>
            <Botao tipo="claro" texto="Cancelar horário" aoPressar={() => cancelar(proximo)} />
          </>
        ) : (
          <>
            <Text style={{ fontFamily: fonte.preta, fontSize: 22, color: cor.tinta }}>
              {ags === null ? 'Carregando...' : 'Nenhum horário marcado'}
            </Text>
            {ags !== null ? (
              <Text style={{ fontFamily: fonte.normal, fontSize: 16, color: cor.suave }}>
                Reserve um horário com seu barbeiro.
              </Text>
            ) : null}
          </>
        )}
      </Cartao>

      <View style={{ paddingHorizontal: 24, marginTop: 16 }}>
        <Botao texto="Reservar novo horário" aoPressar={() => router.push('/cliente/barbeiros')} />
      </View>
    </Tela>
  );
}
