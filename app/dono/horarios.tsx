// Tela 12 · Dono: dias e horários de funcionamento
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ouvirHorarios, salvarHorarios } from '../../src/lib/dados';
import { erroAmigavel } from '../../src/lib/erros';
import { horaDeMinutos, horariosPadrao, minutos } from '../../src/lib/datas';
import { DiaHorario, Horarios } from '../../src/lib/tipos';
import { Botao, BotaoVoltar, Cartao, Chave, Segmentado, Subtitulo, Tela, Titulo } from '../../src/components/ui';
import { Icone } from '../../src/components/Icone';
import { cor, fonte } from '../../src/theme';

// Ordem na tela: segunda a domingo (a chave é o número do dia: 0 = domingo)
const ORDEM = [
  { chave: '1', nome: 'Segunda' }, { chave: '2', nome: 'Terça' }, { chave: '3', nome: 'Quarta' },
  { chave: '4', nome: 'Quinta' }, { chave: '5', nome: 'Sexta' }, { chave: '6', nome: 'Sábado' },
  { chave: '0', nome: 'Domingo' },
];

function Ajuste({ rotulo, valor, aoMudar }: { rotulo: string; valor: string; aoMudar: (v: string) => void }) {
  const mexer = (delta: number) => {
    const novo = Math.min(23 * 60 + 30, Math.max(0, minutos(valor) + delta));
    aoMudar(horaDeMinutos(novo));
  };
  const Botaozinho = ({ icone, delta }: { icone: 'mais' | 'menos'; delta: number }) => (
    <Pressable
      onPress={() => mexer(delta)}
      style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: cor.fundo, alignItems: 'center', justifyContent: 'center' }}
    >
      <Icone nome={icone} tamanho={18} />
    </Pressable>
  );
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Text style={{ fontFamily: fonte.forte, fontSize: 13, color: cor.suave }}>{rotulo}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Botaozinho icone="menos" delta={-30} />
        <Text style={{ fontFamily: fonte.preta, fontSize: 18, color: cor.tinta, minWidth: 54, textAlign: 'center' }}>{valor}</Text>
        <Botaozinho icone="mais" delta={30} />
      </View>
    </View>
  );
}

export default function HorariosDono() {
  const router = useRouter();
  const [h, setH] = useState<Horarios | null>(null);
  const [ocupado, setOcupado] = useState(false);

  // Carrega o que já foi salvo (ou o padrão) uma única vez
  useEffect(() => {
    let primeira = true;
    return ouvirHorarios((salvo) => {
      if (primeira) {
        primeira = false;
        setH(salvo ?? horariosPadrao());
      }
    });
  }, []);

  if (!h) return <Tela topo><View /></Tela>;

  function mudarDia(chave: string, parte: Partial<DiaHorario>) {
    setH({ ...h!, dias: { ...h!.dias, [chave]: { ...h!.dias[chave], ...parte } } });
  }

  async function salvar() {
    for (const d of ORDEM) {
      const cfg = h!.dias[d.chave];
      if (cfg.aberto && minutos(cfg.fecha) - minutos(cfg.abre) < h!.duracao) {
        return Alert.alert('Confira os horários', `${d.nome}: o horário de fechar precisa ser depois do de abrir.`);
      }
    }
    setOcupado(true);
    try {
      await salvarHorarios(h!);
      Alert.alert('Horários salvos', 'Os clientes já veem a nova agenda.');
      router.back();
    } catch (e) {
      Alert.alert('Não foi possível salvar', erroAmigavel(e));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <Tela rolar topo>
      <View style={{ paddingHorizontal: 24 }}>
        <BotaoVoltar />
        <Titulo estilo={{ marginTop: 24 }}>Dias e horários</Titulo>
        <Subtitulo>Defina quando a barbearia atende.</Subtitulo>
      </View>

      <Text style={{ fontFamily: fonte.forte, fontSize: 15, color: cor.suave, marginHorizontal: 28, marginTop: 24, marginBottom: 8 }}>
        Duração de cada atendimento
      </Text>
      <View style={{ marginHorizontal: 24 }}>
        <Segmentado
          escuro={false}
          opcoes={[{ id: '30', rotulo: '30 minutos' }, { id: '60', rotulo: '1 hora' }]}
          valor={String(h.duracao)}
          aoMudar={(v) => setH({ ...h, duracao: Number(v) })}
        />
      </View>

      <View style={{ marginTop: 20, gap: 10 }}>
        {ORDEM.map((d) => {
          const cfg = h.dias[d.chave];
          return (
            <Cartao key={d.chave} estilo={{ gap: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: fonte.forte, fontSize: 18, color: cor.tinta }}>{d.nome}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontFamily: fonte.media, fontSize: 14, color: cor.suave }}>{cfg.aberto ? 'Aberto' : 'Fechado'}</Text>
                  <Chave ligado={cfg.aberto} aoMudar={(v) => mudarDia(d.chave, { aberto: v })} rotulo={d.nome} />
                </View>
              </View>
              {cfg.aberto ? (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Ajuste rotulo="Abre" valor={cfg.abre} aoMudar={(v) => mudarDia(d.chave, { abre: v })} />
                  <Ajuste rotulo="Fecha" valor={cfg.fecha} aoMudar={(v) => mudarDia(d.chave, { fecha: v })} />
                </View>
              ) : null}
            </Cartao>
          );
        })}
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
        <Botao texto="Salvar horários" aoPressar={salvar} carregando={ocupado} />
      </View>
    </Tela>
  );
}
