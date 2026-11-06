// Tela 26 · Admin: código do dono (enviar por WhatsApp ou copiar)
import React, { useState } from 'react';
import { Alert, Linking, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Botao, Cartao, Subtitulo, Tela, Titulo } from '../../src/components/ui';
import { NOME_BARBEARIA } from '../../src/config';
import { cor, fonte } from '../../src/theme';

export default function CodigoDono() {
  const router = useRouter();
  const { codigo, nome } = useLocalSearchParams<{ codigo: string; nome: string }>();
  const [copiado, setCopiado] = useState(false);

  const mensagem =
    `Olá, ${nome}! Seu código de acesso de dono do app ${NOME_BARBEARIA} é: ${codigo}\n` +
    `Abra o app, toque em "Sou o dono da barbearia" e digite o código. Ele vale uma única vez.`;

  async function whatsapp() {
    const texto = encodeURIComponent(mensagem);
    try {
      await Linking.openURL(`whatsapp://send?text=${texto}`);
    } catch {
      try {
        await Linking.openURL(`https://wa.me/?text=${texto}`);
      } catch {
        Alert.alert('Não foi possível abrir o WhatsApp', 'Use o botão "Copiar código".');
      }
    }
  }

  async function copiar() {
    await Clipboard.setStringAsync(String(codigo));
    setCopiado(true);
  }

  return (
    <Tela rolar topo>
      <View style={{ paddingHorizontal: 24 }}>
        <Titulo>Código do dono</Titulo>
        <Subtitulo>Envie este código para {nome}. Vale uma única vez.</Subtitulo>
      </View>

      <Cartao estilo={{ marginTop: 28, padding: 28, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonte.preta, fontSize: 42, letterSpacing: 3, color: cor.tinta }}>{codigo}</Text>
      </Cartao>

      <View style={{ paddingHorizontal: 24, marginTop: 24, gap: 12 }}>
        <Botao texto="Enviar pelo WhatsApp" aoPressar={whatsapp} />
        <Botao tipo="claro" texto={copiado ? 'Código copiado!' : 'Copiar código'} aoPressar={copiar} />
        <Botao tipo="contorno" texto="Concluir" aoPressar={() => router.dismissAll()} />
      </View>
    </Tela>
  );
}
