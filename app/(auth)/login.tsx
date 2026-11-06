// Tela 1 · Login e cadastro do cliente
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/lib/auth';
import { erroAmigavel } from '../../src/lib/erros';
import { NOME_BARBEARIA } from '../../src/config';
import { Botao, Campo, Cartao, Erro, Subtitulo, Tela, Titulo } from '../../src/components/ui';
import { Icone } from '../../src/components/Icone';
import { cor, fonte } from '../../src/theme';

export default function Login() {
  const router = useRouter();
  const { entrar, criarConta } = useAuth();
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function enviar() {
    setErro('');
    if (criando && nome.trim().length < 2) return setErro('Digite seu nome.');
    if (!email.trim() || !senha) return setErro('Preencha e-mail e senha.');
    setOcupado(true);
    try {
      if (criando) await criarConta(nome, email, senha);
      else await entrar(email, senha);
      router.replace('/');
    } catch (e) {
      setErro(erroAmigavel(e) + ' [' + ((e as any)?.code ?? (e as any)?.message ?? '') + ']');
    } finally {
      setOcupado(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Tela rolar topo estilo={{ flexGrow: 1 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: cor.tinta, alignItems: 'center', justifyContent: 'center' }}>
            <Icone nome="tesoura" cor={cor.branco} tamanho={28} />
          </View>
          <Titulo estilo={{ marginTop: 24 }}>{NOME_BARBEARIA}</Titulo>
          <Subtitulo>{criando ? 'Crie sua conta para reservar horário.' : 'Entre para reservar seu horário.'}</Subtitulo>
        </View>

        <Cartao estilo={{ marginTop: 28, padding: 24, gap: 16 }}>
          {criando ? <Campo rotulo="Nome" valor={nome} aoMudar={setNome} placeholder="Seu nome" /> : null}
          <Campo rotulo="E-mail" valor={email} aoMudar={setEmail} placeholder="voce@email.com" teclado="email-address" />
          <Campo rotulo="Senha" valor={senha} aoMudar={setSenha} placeholder="Mínimo 6 caracteres" senha />
          <Erro texto={erro} />
          <Botao texto={criando ? 'Criar conta' : 'Entrar'} aoPressar={enviar} carregando={ocupado} />
        </Cartao>

        <View style={{ alignItems: 'center', marginTop: 24, gap: 14 }}>
          <Pressable onPress={() => { setCriando(!criando); setErro(''); }}>
            <Text style={{ fontFamily: fonte.forte, fontSize: 16, color: cor.tinta }}>
              {criando ? 'Já tenho conta · Entrar' : 'Ainda não tenho conta · Criar conta'}
            </Text>
          </Pressable>
          <Pressable onPress={() => router.push('/ativacao')}>
            <Text style={{ fontFamily: fonte.forte, fontSize: 15, color: cor.suave }}>Sou o dono da barbearia</Text>
          </Pressable>
        </View>
      </Tela>
    </KeyboardAvoidingView>
  );
}
