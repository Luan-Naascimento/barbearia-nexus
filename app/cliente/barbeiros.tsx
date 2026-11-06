// Telas 3 e 4 · Escolher barbeiro (ou aviso quando não há ninguém)
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ouvirBarbeiros } from '../../src/lib/dados';
import { Barbeiro } from '../../src/lib/tipos';
import { Avatar, BotaoVoltar, Tela, Titulo, Vazio } from '../../src/components/ui';
import { Icone } from '../../src/components/Icone';
import { cor, fonte } from '../../src/theme';

export default function EscolherBarbeiro() {
  const router = useRouter();
  const [lista, setLista] = useState<Barbeiro[] | null>(null);

  useEffect(() => ouvirBarbeiros(setLista), []);

  return (
    <Tela rolar topo>
      <View style={{ paddingHorizontal: 24 }}>
        <BotaoVoltar />
        <Titulo estilo={{ marginTop: 24 }}>Escolha o barbeiro</Titulo>
      </View>

      {lista !== null && lista.length === 0 ? (
        <Vazio
          titulo="Ainda não há barbeiros disponíveis"
          texto="Assim que a barbearia liberar a agenda, você poderá reservar seu horário por aqui."
        />
      ) : (
        <View style={{ paddingHorizontal: 24, marginTop: 24, gap: 12 }}>
          {(lista ?? []).map((b) => (
            <Pressable
              key={b.id}
              onPress={() =>
                router.push({ pathname: '/cliente/agenda', params: { barbeiroId: b.id, barbeiroNome: b.nome } })
              }
              style={{ backgroundColor: cor.branco, borderRadius: 28, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}
            >
              <Avatar nome={b.nome} tamanho={56} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonte.forte, fontSize: 18, color: cor.tinta }}>{b.nome}</Text>
                <Text style={{ fontFamily: fonte.media, fontSize: 14, color: cor.suave }}>
                  {b.funcao === 'dono' ? 'Dono' : 'Barbeiro'}
                </Text>
              </View>
              <Icone nome="seta" espessura={2.2} />
            </Pressable>
          ))}
        </View>
      )}
    </Tela>
  );
}
