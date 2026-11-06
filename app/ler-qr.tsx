// Tela 13 · Barbeiro: ler o QR code do dono para entrar na equipe
import React, { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuth } from '../src/lib/auth';
import { entrarNaEquipe } from '../src/lib/dados';
import { erroAmigavel } from '../src/lib/erros';
import { Botao, BotaoVoltar, Campo, Erro, Subtitulo, Tela, Titulo } from '../src/components/ui';
import { cor, fonte } from '../src/theme';

export default function LerQr() {
  const router = useRouter();
  const { perfil, segurarPapel } = useAuth();
  const [permissao, pedirPermissao] = useCameraPermissions();
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const lendo = useRef(false);

  if (!perfil) return <Redirect href="/" />;

  async function entrar(texto: string) {
    if (lendo.current) return;
    lendo.current = true;
    setErro('');
    setOcupado(true);
    // O QR vem como "nexus:equipe:K7M2-Q9XR"; também aceita só o código digitado
    const codigoLido = texto.replace(/^nexus:equipe:/i, '');
    // Segura o papel de cliente até o usuário ver a tela "Você entrou na equipe"
    segurarPapel('cliente');
    try {
      await entrarNaEquipe(perfil!.uid, perfil!.nome, codigoLido);
      router.replace('/equipe-ok');
    } catch (e) {
      segurarPapel(null);
      setErro(erroAmigavel(e));
      lendo.current = false;
    } finally {
      setOcupado(false);
    }
  }

  return (
    <Tela rolar topo>
      <View style={{ paddingHorizontal: 24 }}>
        <BotaoVoltar />
        <Titulo estilo={{ marginTop: 24 }}>Ler QR code</Titulo>
        <Subtitulo>Aponte a câmera para o QR code que o dono mostrar no celular dele.</Subtitulo>
      </View>

      <View style={{ marginHorizontal: 24, marginTop: 24, height: 320, borderRadius: 32, overflow: 'hidden', backgroundColor: cor.tinta }}>
        {permissao?.granted ? (
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={ocupado ? undefined : ({ data }: { data: string }) => entrar(data)}
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
            <Text style={{ fontFamily: fonte.media, fontSize: 16, color: cor.textoClaro, textAlign: 'center' }}>
              Precisamos da câmera para ler o QR code.
            </Text>
            <Botao tipo="claro" pequeno texto="Permitir câmera" aoPressar={() => pedirPermissao()} />
          </View>
        )}
      </View>

      <View style={{ marginHorizontal: 24, marginTop: 16, backgroundColor: cor.branco, borderRadius: 28, padding: 20, gap: 12 }}>
        <Campo rotulo="Ou digite o código" valor={codigo} aoMudar={setCodigo} placeholder="XXXX-XXXX" maiusculas />
        <Erro texto={erro} />
        <Botao tipo="claro" texto="Entrar na equipe" aoPressar={() => entrar(codigo)} carregando={ocupado} desabilitado={codigo.trim().length < 8} />
      </View>
    </Tela>
  );
}
