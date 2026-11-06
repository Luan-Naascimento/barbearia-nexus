// Tela 24 · Admin: meu perfil ("ver o app como" + perfil do dono)
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/lib/auth';
import { Modo } from '../../src/lib/tipos';
import { Botao, CabecalhoEscuro, LinhaCartao, SecaoTitulo, Tela } from '../../src/components/ui';
import { Icone, NomeIcone } from '../../src/components/Icone';
import { cor, fonte } from '../../src/theme';

const TILES: { modo: Modo; rotulo: string; icone: NomeIcone }[] = [
  { modo: 'cliente', rotulo: 'Cliente', icone: 'perfil' },
  { modo: 'barbeiro', rotulo: 'Barbeiro', icone: 'tesoura' },
  { modo: 'dono', rotulo: 'Dono', icone: 'painel' },
];

export default function PerfilAdmin() {
  const router = useRouter();
  const { perfil, setModo, sair } = useAuth();

  return (
    <Tela rolar barra="light">
      <CabecalhoEscuro
        selo="Administrador geral"
        titulo={(perfil?.nome ?? '').split(' ')[0] || 'Admin'}
        subtitulo="Você vê o app como todos os perfis."
      />

      <SecaoTitulo>Ver o app como</SecaoTitulo>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 24 }}>
        {TILES.map((t) => (
          <Pressable
            key={t.modo}
            onPress={() => {
              setModo(t.modo);
              router.replace(`/${t.modo}` as any);
            }}
            style={{ flex: 1, height: 92, borderRadius: 24, backgroundColor: cor.branco, alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Icone nome={t.icone} tamanho={24} />
            <Text style={{ fontFamily: fonte.forte, fontSize: 14, color: cor.tinta }}>{t.rotulo}</Text>
          </Pressable>
        ))}
      </View>

      <SecaoTitulo>Dono da barbearia</SecaoTitulo>
      <LinhaCartao
        icone="maisUsuario"
        titulo="Perfil do dono"
        subtitulo="Nome, e-mail e código de acesso"
        aoPressar={() => router.push('/admin/dono-perfil')}
      />

      <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
        <Botao tipo="contorno" texto="Sair" aoPressar={sair} />
      </View>
    </Tela>
  );
}
