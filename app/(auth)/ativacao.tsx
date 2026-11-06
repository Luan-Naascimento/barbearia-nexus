// Tela 18 · Dono: código de ativação
import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { verificarCodigoDono } from '../../src/lib/dados';
import { erroAmigavel } from '../../src/lib/erros';
import { Botao, BotaoVoltar, Campo, Cartao, Erro, Subtitulo, Tela, Titulo } from '../../src/components/ui';

export default function Ativacao() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function continuar() {
    setErro('');
    setOcupado(true);
    try {
      const c = await verificarCodigoDono(codigo);
      router.push({ pathname: '/dono-conta', params: { codigo: c.codigo } });
    } catch (e) {
      setErro(erroAmigavel(e));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <Tela rolar topo>
      <View style={{ paddingHorizontal: 24 }}>
        <BotaoVoltar />
        <Titulo estilo={{ marginTop: 24 }}>Código de ativação</Titulo>
        <Subtitulo>Digite o código que você recebeu para criar a conta de dono.</Subtitulo>
      </View>
      <Cartao estilo={{ marginTop: 28, padding: 24, gap: 16 }}>
        <Campo rotulo="Código" valor={codigo} aoMudar={setCodigo} placeholder="XXXX-XXXX" maiusculas />
        <Erro texto={erro} />
        <Botao texto="Continuar" aoPressar={continuar} carregando={ocupado} desabilitado={codigo.trim().length < 8} />
      </Cartao>
    </Tela>
  );
}
