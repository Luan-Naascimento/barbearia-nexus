// Tela 25 · Admin: perfil do dono (gera o código de ativação)
import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { criarConviteDono } from '../../src/lib/dados';
import { erroAmigavel } from '../../src/lib/erros';
import { Botao, BotaoVoltar, Campo, Cartao, Erro, Subtitulo, Tela, Titulo } from '../../src/components/ui';

export default function DonoPerfilAdmin() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function gerar() {
    setErro('');
    if (nome.trim().length < 2) return setErro('Digite o nome do dono.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErro('Digite um e-mail válido.');
    setOcupado(true);
    try {
      const codigo = await criarConviteDono(nome, email);
      router.push({ pathname: '/admin/codigo', params: { codigo, nome: nome.trim() } });
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
        <Titulo estilo={{ marginTop: 24 }}>Perfil do dono</Titulo>
        <Subtitulo>O dono cria a própria senha no primeiro acesso, usando o código.</Subtitulo>
      </View>
      <Cartao estilo={{ marginTop: 28, padding: 24, gap: 16 }}>
        <Campo rotulo="Nome do dono" valor={nome} aoMudar={setNome} placeholder="Nome completo" />
        <Campo rotulo="E-mail do dono" valor={email} aoMudar={setEmail} placeholder="dono@email.com" teclado="email-address" />
        <Erro texto={erro} />
        <Botao texto="Salvar e gerar código" aoPressar={gerar} carregando={ocupado} />
      </Cartao>
    </Tela>
  );
}
