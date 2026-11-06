// Peças visuais reutilizadas em todas as telas
import React from 'react';
import {
  ActivityIndicator, Alert, Pressable, ScrollView, StyleProp, Text, TextInput, View, ViewStyle,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cor, fonte } from '../theme';
import { Agendamento } from '../lib/tipos';
import { diaCurto } from '../lib/datas';
import { Icone, NomeIcone } from './Icone';

// ---------- Tela base (fundo cinza-claro, barra de status, rolagem opcional)
export function Tela({ children, rolar, topo, barra = 'dark', estilo }: {
  children: React.ReactNode; rolar?: boolean; topo?: boolean; barra?: 'dark' | 'light'; estilo?: StyleProp<ViewStyle>;
}) {
  const ins = useSafeAreaInsets();
  const pad = topo ? ins.top + 16 : 0;
  return (
    <View style={{ flex: 1, backgroundColor: cor.fundo }}>
      <StatusBar style={barra} />
      {rolar ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[{ paddingTop: pad, paddingBottom: 32 }, estilo]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, paddingTop: pad }, estilo]}>{children}</View>
      )}
    </View>
  );
}

export function Carregando() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cor.fundo }}>
      <ActivityIndicator color={cor.tinta} />
    </View>
  );
}

// ---------- Textos
export function Titulo({ children, claro, estilo }: { children: React.ReactNode; claro?: boolean; estilo?: StyleProp<ViewStyle> }) {
  return (
    <Text style={[{ fontFamily: fonte.preta, fontSize: 38, lineHeight: 42, color: claro ? cor.branco : cor.tinta }, estilo as any]}>
      {children}
    </Text>
  );
}

export function Subtitulo({ children, claro }: { children: React.ReactNode; claro?: boolean }) {
  return (
    <Text style={{ fontFamily: fonte.normal, fontSize: 17, lineHeight: 24, color: claro ? cor.textoClaro : cor.suave, marginTop: 8 }}>
      {children}
    </Text>
  );
}

export function SecaoTitulo({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontFamily: fonte.preta, fontSize: 22, color: cor.tinta, marginHorizontal: 24, marginTop: 24, marginBottom: 12 }}>
      {children}
    </Text>
  );
}

export function Selo({ texto }: { texto: string }) {
  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: cor.cartaoEscuro, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
      <Text style={{ fontFamily: fonte.forte, fontSize: 13, color: cor.textoClaro }}>{texto}</Text>
    </View>
  );
}

// ---------- Cabeçalho preto com cantos arredondados embaixo
export function CabecalhoEscuro({ selo, titulo, subtitulo, children }: {
  selo?: string; titulo: string; subtitulo?: string; children?: React.ReactNode;
}) {
  const ins = useSafeAreaInsets();
  return (
    <View style={{
      backgroundColor: cor.tinta, borderBottomLeftRadius: 36, borderBottomRightRadius: 36,
      paddingTop: ins.top + 16, paddingHorizontal: 24, paddingBottom: 24,
    }}>
      {selo ? <Selo texto={selo} /> : null}
      <Titulo claro estilo={{ marginTop: 12 }}>{titulo}</Titulo>
      {subtitulo ? <Subtitulo claro>{subtitulo}</Subtitulo> : null}
      {children}
    </View>
  );
}

// ---------- Botões
export function Botao({ texto, aoPressar, tipo = 'escuro', carregando, desabilitado, pequeno, estilo }: {
  texto: string; aoPressar: () => void; tipo?: 'escuro' | 'claro' | 'contorno'; carregando?: boolean;
  desabilitado?: boolean; pequeno?: boolean; estilo?: StyleProp<ViewStyle>;
}) {
  const off = desabilitado || carregando;
  const fundo = tipo === 'escuro' ? (off ? cor.desativado : cor.tinta) : tipo === 'claro' ? cor.fundo : 'transparent';
  const textoCor = tipo === 'escuro' ? cor.branco : cor.tinta;
  return (
    <Pressable
      onPress={off ? undefined : aoPressar}
      accessibilityRole="button"
      style={({ pressed }) => [{
        height: pequeno ? 44 : 60, borderRadius: pequeno ? 22 : 30, backgroundColor: fundo,
        borderWidth: tipo === 'contorno' ? 2 : 0, borderColor: cor.tinta,
        alignItems: 'center', justifyContent: 'center', paddingHorizontal: pequeno ? 16 : 24,
        opacity: pressed ? 0.85 : off && tipo !== 'escuro' ? 0.5 : 1,
      }, estilo]}
    >
      {carregando ? (
        <ActivityIndicator color={textoCor} />
      ) : (
        <Text style={{ fontFamily: fonte.forte, fontSize: pequeno ? 15 : 18, color: textoCor }}>{texto}</Text>
      )}
    </Pressable>
  );
}

export function BotaoVoltar() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityLabel="Voltar"
      style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: cor.branco, alignItems: 'center', justifyContent: 'center' }}
    >
      <Icone nome="voltar" espessura={2.2} />
    </Pressable>
  );
}

// ---------- Cartões
export function Cartao({ children, estilo }: { children: React.ReactNode; estilo?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ backgroundColor: cor.branco, borderRadius: 28, padding: 20, marginHorizontal: 24 }, estilo]}>
      {children}
    </View>
  );
}

export function BolinhaIcone({ nome }: { nome: NomeIcone }) {
  return (
    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: cor.fundo, alignItems: 'center', justifyContent: 'center' }}>
      <Icone nome={nome} />
    </View>
  );
}

// Cartão que leva a outra tela (ícone + título + subtítulo + seta)
export function LinhaCartao({ icone, titulo, subtitulo, aoPressar, estilo }: {
  icone: NomeIcone; titulo: string; subtitulo?: string; aoPressar: () => void; estilo?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={aoPressar}
      style={[{
        backgroundColor: cor.branco, borderRadius: 28, paddingHorizontal: 20, paddingVertical: 16,
        marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 16,
      }, estilo]}
    >
      <BolinhaIcone nome={icone} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonte.forte, fontSize: 17, color: cor.tinta }}>{titulo}</Text>
        {subtitulo ? (
          <Text style={{ fontFamily: fonte.media, fontSize: 14, color: cor.suave, marginTop: 2 }}>{subtitulo}</Text>
        ) : null}
      </View>
      <Icone nome="seta" espessura={2.2} />
    </Pressable>
  );
}

export function Avatar({ nome, tamanho = 72 }: { nome: string; tamanho?: number }) {
  return (
    <View style={{
      width: tamanho, height: tamanho, borderRadius: tamanho / 2, backgroundColor: cor.tinta,
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontFamily: fonte.preta, fontSize: tamanho * 0.42, color: cor.branco }}>
        {(nome || '?').trim().charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

export function Vazio({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <View style={{ marginHorizontal: 24, marginTop: 24, backgroundColor: cor.branco, borderRadius: 28, padding: 24 }}>
      <Text style={{ fontFamily: fonte.forte, fontSize: 18, color: cor.tinta }}>{titulo}</Text>
      {texto ? (
        <Text style={{ fontFamily: fonte.normal, fontSize: 16, lineHeight: 22, color: cor.suave, marginTop: 6 }}>{texto}</Text>
      ) : null}
    </View>
  );
}

// ---------- Formulário
export function Campo({ rotulo, valor, aoMudar, placeholder, senha, teclado, travado, maiusculas }: {
  rotulo: string; valor: string; aoMudar?: (t: string) => void; placeholder?: string; senha?: boolean;
  teclado?: 'default' | 'email-address'; travado?: boolean; maiusculas?: boolean;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontFamily: fonte.forte, fontSize: 14, color: cor.suave }}>{rotulo}</Text>
      <TextInput
        value={valor}
        onChangeText={aoMudar}
        editable={!travado}
        placeholder={placeholder}
        placeholderTextColor={cor.desativado}
        secureTextEntry={senha}
        keyboardType={teclado ?? 'default'}
        autoCapitalize={maiusculas ? 'characters' : teclado === 'email-address' || senha ? 'none' : 'words'}
        autoCorrect={false}
        style={{
          height: 56, borderRadius: 18, backgroundColor: cor.fundo, paddingHorizontal: 18,
          fontFamily: fonte.media, fontSize: 17, color: travado ? cor.suave : cor.tinta,
        }}
      />
    </View>
  );
}

export function Erro({ texto }: { texto: string }) {
  if (!texto) return null;
  return <Text style={{ fontFamily: fonte.media, fontSize: 15, color: cor.erro, marginTop: 4 }}>{texto}</Text>;
}

// Chave liga/desliga
export function Chave({ ligado, aoMudar, rotulo }: { ligado: boolean; aoMudar: (v: boolean) => void; rotulo: string }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={rotulo}
      accessibilityState={{ checked: ligado }}
      onPress={() => aoMudar(!ligado)}
      style={{
        width: 56, height: 32, borderRadius: 16, padding: 4, backgroundColor: ligado ? cor.tinta : cor.chaveOff,
        justifyContent: 'center', alignItems: ligado ? 'flex-end' : 'flex-start',
      }}
    >
      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: cor.branco }} />
    </Pressable>
  );
}

// Cartão branco com título, texto e uma chave
export function LinhaChave({ titulo, subtitulo, ligado, aoMudar, estilo }: {
  titulo: string; subtitulo?: string; ligado: boolean; aoMudar: (v: boolean) => void; estilo?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{
      backgroundColor: cor.branco, borderRadius: 28, paddingHorizontal: 20, minHeight: 80, marginHorizontal: 24,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    }, estilo]}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonte.forte, fontSize: 17, color: cor.tinta }}>{titulo}</Text>
        {subtitulo ? (
          <Text style={{ fontFamily: fonte.media, fontSize: 14, color: cor.suave, marginTop: 2 }}>{subtitulo}</Text>
        ) : null}
      </View>
      <Chave ligado={ligado} aoMudar={aoMudar} rotulo={titulo} />
    </View>
  );
}

// Duas opções lado a lado em fundo escuro (ex.: Dia | Semana)
export function Segmentado({ opcoes, valor, aoMudar, escuro = true }: {
  opcoes: { id: string; rotulo: string }[]; valor: string; aoMudar: (id: string) => void; escuro?: boolean;
}) {
  return (
    <View style={{ backgroundColor: escuro ? cor.cartaoEscuro : cor.fundo, borderRadius: 999, padding: 6, flexDirection: 'row', gap: 6 }}>
      {opcoes.map((o) => {
        const ativo = o.id === valor;
        return (
          <Pressable
            key={o.id}
            onPress={() => aoMudar(o.id)}
            style={{
              flex: 1, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
              backgroundColor: ativo ? (escuro ? cor.branco : cor.tinta) : 'transparent',
            }}
          >
            <Text style={{
              fontFamily: fonte.forte, fontSize: 16,
              color: ativo ? (escuro ? cor.tinta : cor.branco) : escuro ? cor.textoClaro : cor.suave,
            }}>
              {o.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Dias para escolher (faixa que rola para o lado)
export function ChipsDias({ dias, escolhido, aoEscolher, bloqueados }: {
  dias: { chave: string; data: Date }[]; escolhido: string; aoEscolher: (chave: string) => void; bloqueados?: Set<string>;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}>
      {dias.map(({ chave, data }) => {
        const ativo = chave === escolhido;
        const bloq = bloqueados?.has(chave);
        return (
          <Pressable
            key={chave}
            onPress={bloq ? undefined : () => aoEscolher(chave)}
            style={{
              width: 64, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', gap: 4,
              backgroundColor: ativo ? cor.tinta : cor.branco, opacity: bloq ? 0.4 : 1,
            }}
          >
            <Text style={{ fontFamily: fonte.forte, fontSize: 13, color: ativo ? cor.textoClaro : cor.suave }}>{diaCurto(data)}</Text>
            <Text style={{ fontFamily: fonte.preta, fontSize: 22, color: ativo ? cor.branco : cor.tinta }}>{data.getDate()}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ---------- Cartão de agendamento (barbeiro e dono)
export function CartaoAgendamento({ ag, aoConfirmar, aoCancelar }: {
  ag: Agendamento; aoConfirmar?: () => void; aoCancelar?: () => void;
}) {
  const pendente = ag.status === 'pendente';
  return (
    <View style={{ backgroundColor: cor.branco, borderRadius: 28, paddingHorizontal: 20, paddingVertical: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Text style={{ width: 58, fontFamily: fonte.preta, fontSize: 20, color: cor.tinta }}>{ag.hora}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonte.forte, fontSize: 17, color: cor.tinta }}>{ag.clienteNome}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            {!pendente ? <Icone nome="check" tamanho={14} espessura={3} cor={cor.suave} /> : null}
            <Text style={{ fontFamily: fonte.media, fontSize: 14, color: cor.suave }}>
              {pendente ? 'Aguardando confirmação' : 'Confirmado'}
            </Text>
          </View>
        </View>
        {!pendente && aoCancelar ? <Botao pequeno tipo="claro" texto="Cancelar" aoPressar={aoCancelar} /> : null}
      </View>
      {pendente && (aoConfirmar || aoCancelar) ? (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {aoConfirmar ? <Botao pequeno texto="Confirmar" aoPressar={aoConfirmar} estilo={{ flex: 1 }} /> : null}
          {aoCancelar ? <Botao pequeno tipo="claro" texto="Cancelar" aoPressar={aoCancelar} estilo={{ flex: 1 }} /> : null}
        </View>
      ) : null}
    </View>
  );
}

// Pergunta "tem certeza?" antes de uma ação que não dá para desfazer
export function perguntar(titulo: string, texto: string, textoSim: string, aoSim: () => void) {
  Alert.alert(titulo, texto, [
    { text: 'Voltar', style: 'cancel' },
    { text: textoSim, style: 'destructive', onPress: aoSim },
  ]);
}
