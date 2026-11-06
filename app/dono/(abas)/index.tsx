// Tela 8 · Painel do dono: agenda do dia / da semana
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { cancelarAgendamento, ouvirDosDias } from '../../../src/lib/dados';
import { chaveDia, dataDeChave, dataLonga, proximosDias } from '../../../src/lib/datas';
import { erroAmigavel } from '../../../src/lib/erros';
import { Agendamento } from '../../../src/lib/tipos';
import {
  Botao, CabecalhoEscuro, Cartao, LinhaCartao, SecaoTitulo, Segmentado, Tela, Vazio, perguntar,
} from '../../../src/components/ui';
import { cor, fonte } from '../../../src/theme';

function Linha({ ag, aoCancelar, topo }: { ag: Agendamento; aoCancelar: () => void; topo: boolean }) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', minHeight: 60, gap: 8,
      borderTopWidth: topo ? 1 : 0, borderTopColor: cor.linha,
    }}>
      <Text style={{ width: 62, fontFamily: fonte.preta, fontSize: 17, color: cor.tinta }}>{ag.hora}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonte.forte, fontSize: 16, color: cor.tinta }}>{ag.clienteNome}</Text>
        <Text style={{ fontFamily: fonte.media, fontSize: 13, color: cor.suave }}>
          com {ag.barbeiroNome} · {ag.status === 'confirmado' ? 'confirmado' : 'aguardando'}
        </Text>
      </View>
      <Botao pequeno tipo="claro" texto="Cancelar" aoPressar={aoCancelar} />
    </View>
  );
}

export default function PainelDono() {
  const router = useRouter();
  const [visao, setVisao] = useState<'dia' | 'semana'>('dia');
  const [ags, setAgs] = useState<Agendamento[] | null>(null);

  const dias = useMemo(() => proximosDias(visao === 'dia' ? 1 : 7).map(chaveDia), [visao]);

  useEffect(() => {
    setAgs(null);
    return ouvirDosDias(dias, setAgs);
  }, [dias]);

  function cancelar(a: Agendamento) {
    perguntar('Cancelar reserva?', `${a.hora} · ${a.clienteNome} com ${a.barbeiroNome}`, 'Cancelar reserva', async () => {
      try {
        await cancelarAgendamento(a);
      } catch (e) {
        Alert.alert('Não foi possível cancelar', erroAmigavel(e));
      }
    });
  }

  return (
    <Tela rolar barra="light">
      <CabecalhoEscuro selo="Dono" titulo="Painel do dono" subtitulo={dataLonga(new Date())}>
        <View style={{ marginTop: 20 }}>
          <Segmentado
            opcoes={[{ id: 'dia', rotulo: 'Dia' }, { id: 'semana', rotulo: 'Semana' }]}
            valor={visao}
            aoMudar={(v) => setVisao(v as 'dia' | 'semana')}
          />
        </View>
      </CabecalhoEscuro>

      <SecaoTitulo>{visao === 'dia' ? 'Agenda do dia' : 'Agenda da semana'}</SecaoTitulo>
      {ags !== null && ags.length === 0 ? (
        <Vazio titulo="Nenhuma reserva" texto={visao === 'dia' ? 'Hoje ainda não há clientes agendados.' : 'Nada agendado nos próximos 7 dias.'} />
      ) : null}
      {dias.map((d) => {
        const doDia = (ags ?? []).filter((a) => a.dia === d);
        if (doDia.length === 0) return null;
        return (
          <View key={d} style={{ marginBottom: 12 }}>
            {visao === 'semana' ? (
              <Text style={{ fontFamily: fonte.forte, fontSize: 15, color: cor.suave, marginHorizontal: 28, marginBottom: 6 }}>
                {dataLonga(dataDeChave(d))}
              </Text>
            ) : null}
            <Cartao estilo={{ paddingVertical: 6, paddingHorizontal: 16 }}>
              {doDia.map((a, i) => (
                <Linha key={a.id} ag={a} topo={i > 0} aoCancelar={() => cancelar(a)} />
              ))}
            </Cartao>
          </View>
        );
      })}

      <LinhaCartao
        estilo={{ marginTop: 14 }}
        icone="relogio"
        titulo="Dias e horários"
        subtitulo="Defina quando a barbearia atende"
        aoPressar={() => router.push('/dono/horarios')}
      />
    </Tela>
  );
}
