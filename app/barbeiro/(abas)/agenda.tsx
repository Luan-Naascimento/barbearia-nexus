// Tela 16 · Agenda do barbeiro: confirmar ou cancelar cada reserva
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { useAuth } from '../../../src/lib/auth';
import { cancelarAgendamento, confirmarAgendamento, ouvirDoBarbeiro } from '../../../src/lib/dados';
import { chaveDia, dataDeChave, dataLonga, proximosDias } from '../../../src/lib/datas';
import { erroAmigavel } from '../../../src/lib/erros';
import { Agendamento } from '../../../src/lib/tipos';
import { CartaoAgendamento, ChipsDias, Tela, Titulo, Vazio, perguntar } from '../../../src/components/ui';
import { Subtitulo } from '../../../src/components/ui';

export default function AgendaBarbeiro() {
  const { perfil } = useAuth();
  const dias = useMemo(() => proximosDias(7).map((data) => ({ chave: chaveDia(data), data })), []);
  const [dia, setDia] = useState(dias[0].chave);
  const [ags, setAgs] = useState<Agendamento[] | null>(null);

  useEffect(() => {
    if (!perfil) return;
    setAgs(null);
    return ouvirDoBarbeiro(perfil.uid, dia, setAgs);
  }, [perfil?.uid, dia]);

  async function tentar(acao: () => Promise<void>) {
    try {
      await acao();
    } catch (e) {
      Alert.alert('Não foi possível', erroAmigavel(e));
    }
  }

  return (
    <Tela rolar topo>
      <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
        <Titulo>Agenda</Titulo>
        <Subtitulo>{dataLonga(dataDeChave(dia))}</Subtitulo>
      </View>
      <ChipsDias dias={dias} escolhido={dia} aoEscolher={setDia} />

      <View style={{ paddingHorizontal: 24, marginTop: 20, gap: 10 }}>
        {(ags ?? []).map((a) => (
          <CartaoAgendamento
            key={a.id}
            ag={a}
            aoConfirmar={() => tentar(() => confirmarAgendamento(a.id))}
            aoCancelar={() =>
              perguntar('Cancelar reserva?', `${a.hora} · ${a.clienteNome}`, 'Cancelar reserva', () =>
                tentar(() => cancelarAgendamento(a)),
              )
            }
          />
        ))}
      </View>
      {ags !== null && ags.length === 0 ? <Vazio titulo="Nenhuma reserva neste dia" /> : null}
    </Tela>
  );
}
