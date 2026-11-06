// Tela 15 · Início do barbeiro
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../../../src/lib/auth';
import { ouvirDoBarbeiro } from '../../../src/lib/dados';
import { chaveDia, dataLonga } from '../../../src/lib/datas';
import { sincronizarLembretes } from '../../../src/lib/notificacoes';
import { Agendamento } from '../../../src/lib/tipos';
import { CabecalhoEscuro, Cartao, SecaoTitulo, Tela, Vazio } from '../../../src/components/ui';
import { cor, fonte } from '../../../src/theme';

export default function InicioBarbeiro() {
  const { perfil } = useAuth();
  const [ags, setAgs] = useState<Agendamento[] | null>(null);

  useEffect(() => {
    if (!perfil) return;
    return ouvirDoBarbeiro(perfil.uid, null, setAgs);
  }, [perfil?.uid]);

  useEffect(() => {
    if (ags && perfil) {
      sincronizarLembretes(ags, perfil.lembrete, (a) => `${a.hora} com ${a.clienteNome}.`);
    }
  }, [ags, perfil?.lembrete]);

  const hoje = chaveDia(new Date());
  const deHoje = (ags ?? []).filter((a) => a.dia === hoje);
  const proximo = (ags ?? []).find((a) => a.inicioMs >= Date.now());
  const aConfirmar = (ags ?? []).filter((a) => a.status === 'pendente' && a.inicioMs >= Date.now()).length;
  const primeiroNome = (perfil?.nome ?? '').split(' ')[0];

  return (
    <Tela rolar barra="light">
      <CabecalhoEscuro selo="Barbeiro" titulo={`Olá, ${primeiroNome}`} subtitulo={dataLonga(new Date())} />

      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginTop: 24 }}>
        <Cartao estilo={{ flex: 1, marginHorizontal: 0 }}>
          <Text style={{ fontFamily: fonte.preta, fontSize: 36, color: cor.tinta }}>{deHoje.length}</Text>
          <Text style={{ fontFamily: fonte.media, fontSize: 14, color: cor.suave }}>clientes hoje</Text>
        </Cartao>
        <Cartao estilo={{ flex: 1, marginHorizontal: 0 }}>
          <Text style={{ fontFamily: fonte.preta, fontSize: 36, color: cor.tinta }}>{aConfirmar}</Text>
          <Text style={{ fontFamily: fonte.media, fontSize: 14, color: cor.suave }}>a confirmar</Text>
        </Cartao>
      </View>

      <SecaoTitulo>Próximo cliente</SecaoTitulo>
      {proximo ? (
        <Cartao>
          <Text style={{ fontFamily: fonte.forte, fontSize: 15, color: cor.suave }}>{dataLonga(new Date(proximo.inicioMs))}</Text>
          <Text style={{ fontFamily: fonte.preta, fontSize: 40, color: cor.tinta }}>{proximo.hora}</Text>
          <Text style={{ fontFamily: fonte.forte, fontSize: 18, color: cor.tinta }}>{proximo.clienteNome}</Text>
          <Text style={{ fontFamily: fonte.media, fontSize: 14, color: cor.suave, marginTop: 2 }}>
            {proximo.status === 'confirmado' ? 'Confirmado' : 'Aguardando sua confirmação'}
          </Text>
        </Cartao>
      ) : (
        <Vazio titulo={ags === null ? 'Carregando...' : 'Nenhum cliente agendado'} />
      )}
    </Tela>
  );
}
