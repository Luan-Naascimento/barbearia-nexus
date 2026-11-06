// Tela 19 · Dono: criar senha (nome e e-mail vêm do código)
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../src/lib/auth';
import { verificarCodigoDono } from '../../src/lib/dados';
import { erroAmigavel } from '../../src/lib/erros';
import { Botao, BotaoVoltar, Campo, Cartao, Erro, Subtitulo, Tela, Titulo } from '../../src/components/ui';

export default function DonoConta() {
  const router = useRouter();
  const { ativarDono } = useAuth();
  const { codigo } = useLocalSearchParams<{ codigo: string }>();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    verificarCodigoDono(String(codigo ?? ''))
      .then((c) => { setNome(c.nome); setEmail(c.email); })
      .catch((e) => setErro(erroAmigavel(e)));
  }, [codigo]);

  async function criar() {
    setErro('');
    if (senha.length < 6) return setErro('A senha precisa ter pelo menos 6 caracteres.');
    setOcupado(true);
    try {
      await ativarDono(String(codigo), senha);
      router.replace('/dono-pronto');
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
        <Titulo estilo={{ marginTop: 24 }}>Criar senha</Titulo>
        <Subtitulo>Seus dados já vieram preenchidos. Falta só a senha.</Subtitulo>
      </View>
      <Cartao estilo={{ marginTop: 28, padding: 24, gap: 16 }}>
        <Campo rotulo="Nome" valor={nome} travado />
        <Campo rotulo="E-mail" valor={email} travado />
        <Campo rotulo="Criar senha" valor={senha} aoMudar={setSenha} placeholder="Mínimo 6 caracteres" senha />
        <Erro texto={erro} />
        <Botao texto="Criar conta" aoPressar={criar} carregando={ocupado} desabilitado={!email} />
      </Cartao>
    </Tela>
  );
}
