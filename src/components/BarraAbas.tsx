
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cor, fonte } from '../theme';
import { useAuth } from '../lib/auth';
import { Icone, NomeIcone } from './Icone';

export interface Aba {
  rota: string;
  rotulo: string;
  icone: NomeIcone;
}

export function BarraAbas({ abas }: { abas: Aba[] }) {
  const ins = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const { perfil, modo, setModo } = useAuth();

  const adminVendo = perfil?.papel === 'admin' && modo !== 'admin';

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: Math.max(ins.bottom, 12),
        backgroundColor: cor.fundo,
      }}
    >
      {adminVendo && (
        <Pressable
          onPress={() => {
            setModo('admin');
            router.replace('/admin');
          }}
          style={{
            alignSelf: 'center',
            backgroundColor: cor.tinta,
            borderRadius: 999,
            height: 36,
            paddingHorizontal: 16,
            justifyContent: 'center',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontFamily: fonte.forte,
              fontSize: 13,
              color: cor.branco,
            }}
          >
            Modo administrador · Voltar
          </Text>
        </Pressable>
      )}

      <View
        style={{
          backgroundColor: cor.branco,
          borderRadius: 32,
          padding: 8,
          flexDirection: 'row',
          gap: 4,
        }}
      >
        {abas.map((a) => {
          const ativa = pathname === a.rota;

          return (
            <Pressable
              key={a.rota}
              onPress={() => router.navigate(a.rota as any)}
              style={{
                flex: 1,
                height: 56,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                backgroundColor: ativa ? cor.tinta : 'transparent',
              }}
            >
              <Icone
                nome={a.icone}
                cor={ativa ? cor.branco : cor.suave}
              />

              <Text
                style={{
                  fontFamily: fonte.forte,
                  fontSize: 12,
                  color: ativa ? cor.branco : cor.suave,
                }}
              >
                {a.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
