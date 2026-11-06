// Barra de abas flutuante (igual ao design) + faixa "Modo administrador · Voltar"
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cor, fonte } from '../theme';
import { useAuth } from '../lib/auth';
import { Icone, NomeIcone } from './Icone';

export interface Aba {
  nome: string; // nome do arquivo da tela (index, perfil, agenda...)
  rotulo: string;
  icone: NomeIcone;
}

export function BarraAbas({ state, navigation, abas }: any) {
  const ins = useSafeAreaInsets();
  const router = useRouter();
  const { perfil, modo, setModo } = useAuth();
  const adminVendo = perfil?.papel === 'admin' && modo !== 'admin';
  const atual = state.routes[state.index].name;

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: Math.max(ins.bottom, 12), backgroundColor: cor.fundo }}>
      {adminVendo ? (
        <Pressable
          onPress={() => {
            setModo('admin');
            router.replace('/admin');
          }}
          style={{
            alignSelf: 'center', backgroundColor: cor.tinta, borderRadius: 999, height: 36,
            paddingHorizontal: 16, justifyContent: 'center', marginBottom: 8,
          }}
        >
          <Text style={{ fontFamily: fonte.forte, fontSize: 13, color: cor.branco }}>Modo administrador · Voltar</Text>
        </Pressable>
      ) : null}
      <View style={{ backgroundColor: cor.branco, borderRadius: 32, padding: 8, flexDirection: 'row', gap: 4 }}>
        {abas.map((a: Aba) => {
          const ativa = a.nome === atual;
          return (
            <Pressable
              key={a.nome}
              onPress={() => navigation.navigate(a.nome)}
              style={{
                flex: 1, height: 56, borderRadius: 24, alignItems: 'center', justifyContent: 'center', gap: 2,
                backgroundColor: ativa ? cor.tinta : 'transparent',
              }}
            >
              <Icone nome={a.icone} cor={ativa ? cor.branco : cor.suave} />
              <Text style={{ fontFamily: fonte.forte, fontSize: 12, color: ativa ? cor.branco : cor.suave }}>{a.rotulo}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
