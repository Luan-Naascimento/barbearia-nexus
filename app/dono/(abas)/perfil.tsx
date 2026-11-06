// Tela 11 · Meu perfil do dono: atender clientes, horários e meus agendamentos
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/lib/auth';
import { cancelarAgendamento, confirmarAgendamento, definirAtende, ouvirDoBarbeiro } from '../../../src/lib/dados';
import { chaveDia } from '../../../src/lib/datas';
import { erroAmigavel } from '../../../src/lib/erros';
import { Agendamento } from '../../../src/lib/tipos';
import {
  Avatar, Botao, CartaoAgendamento, LinhaCartao, LinhaChave, SecaoTitulo, Tela, Titulo, Vazio, perguntar,
} from '../../../src/components/ui';
import { cor, fonte } from '../../../src/theme';

export default function PerfilDono() {
  const router = useRouter();
  const { perfil, sair } = useAuth();
  const [ags, setAgs] = useState<Agendamento[] | null>(null);

  useEffect(() => {
    if (!perfil) return;
    return ouvirDoBarbeiro(perfil.uid, chaveDia(new Date()), setAgs);
  }, [perfil?.uid]);

  if (!perfil) return null;
  const atende = perfil.atende !== false;

  async function tentar(acao: () => Promise<void>) {
    try {
      await acao();
    } catch (e) {
      Alert.alert('Não foi possível', erroAmigavel(e));
    }
  }

  return (
    <Tela rolar topo>
      <Titulo estilo={{ paddingHorizontal: 24 }}>Meu perfil</Titulo>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 24, marginTop: 20 }}>
        <Avatar nome={perfil.nome} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonte.preta, fontSize: 22, color: cor.tinta }}>{perfil.nome}</Text>
          <Text style={{ fontFamily: fonte.media, fontSize: 15, color: cor.suave, marginTop: 2 }}>Dono da barbearia</Text>
        </View>
      </View>

      <LinhaChave
        estilo={{ marginTop: 16 }}
        titulo="Atender clientes"
        subtitulo="Aparecer na lista de barbeiros"
        ligado={atende}
        aoMudar={(v) => tentar(() => definirAtende(perfil, v))}
      />
      <Text style={{ fontFamily: fonte.media, fontSize: 14, lineHeight: 20, color: cor.suave, marginHorizontal: 28, marginTop: 10 }}>
        {atende ? 'Ligado: você aparece para o cliente escolher.' : 'Desligado: só os funcionários aparecem.'}
      </Text>

      <LinhaCartao
        estilo={{ marginTop: 12 }}
        icone="relogio"
        titulo="Dias e horários"
        subtitulo="Quando a barbearia atende"
        aoPressar={() => router.push('/dono/horarios')}
      />

      <SecaoTitulo>Meus agendamentos de hoje</SecaoTitulo>
      <View style={{ paddingHorizontal: 24, gap: 10 }}>
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
      {ags !== null && ags.length === 0 ? <Vazio titulo="Nenhum agendamento seu hoje" /> : null}

      <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
        <Botao tipo="contorno" texto="Sair" aoPressar={sair} />
      </View>
    </Tela>
  );
}
