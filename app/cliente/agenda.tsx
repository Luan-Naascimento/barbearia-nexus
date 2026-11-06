// Tela 5 · Agenda: escolher o dia e o horário do barbeiro
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ouvirHorarios, ouvirOcupados } from '../../src/lib/dados';
import { chaveDia, dataDeChave, dataLonga, gerarHorarios, inicioEmMs, proximosDias } from '../../src/lib/datas';
import { Horarios } from '../../src/lib/tipos';
import { DIAS_PARA_RESERVAR } from '../../src/config';
import { Botao, BotaoVoltar, ChipsDias, Subtitulo, Tela, Titulo, Vazio } from '../../src/components/ui';
import { cor, fonte } from '../../src/theme';

export default function AgendaCliente() {
  const router = useRouter();
  const { barbeiroId, barbeiroNome } = useLocalSearchParams<{ barbeiroId: string; barbeiroNome: string }>();
  const [horarios, setHorarios] = useState<Horarios | null | undefined>(undefined);
  const [dia, setDia] = useState('');
  const [hora, setHora] = useState<string | null>(null);
  const [ocupados, setOcupados] = useState<string[]>([]);

  const dias = useMemo(
    () => proximosDias(DIAS_PARA_RESERVAR).map((data) => ({ chave: chaveDia(data), data })),
    [],
  );

  useEffect(() => ouvirHorarios(setHorarios), []);

  // Dias sem atendimento ficam apagados
  const fechados = useMemo(
    () => new Set(dias.filter((d) => gerarHorarios(horarios, d.data).length === 0).map((d) => d.chave)),
    [dias, horarios],
  );

  // Escolhe automaticamente o primeiro dia aberto
  useEffect(() => {
    if (horarios && !dia) {
      const primeiro = dias.find((d) => !fechados.has(d.chave));
      if (primeiro) setDia(primeiro.chave);
    }
  }, [horarios, fechados]);

  useEffect(() => {
    if (!dia || !barbeiroId) return;
    setHora(null);
    return ouvirOcupados(String(barbeiroId), dia, setOcupados);
  }, [dia, barbeiroId]);

  const livres = useMemo(() => {
    if (!dia) return [];
    return gerarHorarios(horarios, dataDeChave(dia)).filter(
      (h) => !ocupados.includes(h) && inicioEmMs(dia, h) > Date.now(),
    );
  }, [dia, horarios, ocupados]);

  return (
    <Tela rolar topo>
      <View style={{ paddingHorizontal: 24 }}>
        <BotaoVoltar />
        <Titulo estilo={{ marginTop: 24 }}>Escolha o horário</Titulo>
        <Subtitulo>com {barbeiroNome}</Subtitulo>
      </View>

      {horarios === null ? (
        <Vazio titulo="Horários ainda não definidos" texto="A barbearia ainda não informou os dias e horários de atendimento." />
      ) : (
        <>
          <View style={{ marginTop: 24 }}>
            <ChipsDias dias={dias} escolhido={dia} aoEscolher={setDia} bloqueados={fechados} />
          </View>
          {dia ? (
            <Text style={{ fontFamily: fonte.forte, fontSize: 16, color: cor.suave, marginHorizontal: 24, marginTop: 24 }}>
              {dataLonga(dataDeChave(dia))}
            </Text>
          ) : null}
          {dia && livres.length === 0 ? (
            <Vazio titulo="Sem horários livres neste dia" texto="Escolha outro dia." />
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 24, marginTop: 12 }}>
              {livres.map((h) => {
                const ativo = h === hora;
                return (
                  <Pressable
                    key={h}
                    onPress={() => setHora(h)}
                    style={{
                      width: '31%', height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
                      backgroundColor: ativo ? cor.tinta : cor.branco,
                    }}
                  >
                    <Text style={{ fontFamily: fonte.forte, fontSize: 17, color: ativo ? cor.branco : cor.tinta }}>{h}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </>
      )}

      <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
        <Botao
          texto="Continuar"
          desabilitado={!hora}
          aoPressar={() =>
            router.push({ pathname: '/cliente/confirmacao', params: { barbeiroId, barbeiroNome, dia, hora: hora ?? '' } })
          }
        />
      </View>
    </Tela>
  );
}
