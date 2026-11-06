// Tela 10 · Dono: QR code (uso único) para um barbeiro entrar na equipe
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { criarConviteBarbeiro } from '../../src/lib/dados';
import { erroAmigavel } from '../../src/lib/erros';
import { Botao, BotaoVoltar, Carregando, Erro, Subtitulo, Tela, Titulo } from '../../src/components/ui';
import { cor, fonte } from '../../src/theme';

export default function QrEquipe() {
  const router = useRouter();
  const [codigo, setCodigo] = useState<string | null>(null);
  const [erro, setErro] = useState('');

  async function gerar() {
    setCodigo(null);
    setErro('');
    try {
      setCodigo(await criarConviteBarbeiro());
    } catch (e) {
      setErro(erroAmigavel(e));
    }
  }

  useEffect(() => { gerar(); }, []);

  return (
    <Tela rolar topo>
      <View style={{ paddingHorizontal: 24 }}>
        <BotaoVoltar />
        <Titulo estilo={{ marginTop: 24 }}>QR code da equipe</Titulo>
        <Subtitulo>O barbeiro cria uma conta de cliente e lê este QR code no Perfil &gt; Sou da equipe. Vale para uma pessoa só.</Subtitulo>
      </View>

      <View style={{ marginHorizontal: 24, marginTop: 24, backgroundColor: cor.branco, borderRadius: 32, padding: 28, alignItems: 'center', gap: 16, minHeight: 320, justifyContent: 'center' }}>
        {codigo ? (
          <>
            <QRCode value={`nexus:equipe:${codigo}`} size={220} />
            <Text style={{ fontFamily: fonte.preta, fontSize: 24, letterSpacing: 2, color: cor.tinta }}>{codigo}</Text>
            <Text style={{ fontFamily: fonte.media, fontSize: 14, color: cor.suave, textAlign: 'center' }}>
              Se a câmera não funcionar, o barbeiro pode digitar este código.
            </Text>
          </>
        ) : erro ? (
          <Erro texto={erro} />
        ) : (
          <Carregando />
        )}
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: 24, gap: 12 }}>
        <Botao tipo="claro" texto="Gerar outro QR code" aoPressar={gerar} />
        <Botao texto="Concluir" aoPressar={() => router.back()} />
      </View>
    </Tela>
  );
}
