// Login, conta e "quem é você" para o app inteiro
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut,
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from './firebase';
import { normalizarCodigo } from './dados';
import { Modo, Papel, Perfil } from './tipos';

interface Contexto {
  carregando: boolean;
  usuario: User | null;
  perfil: Perfil | null;
  papel: Papel | null; // papel "efetivo" (veja segurarPapel)
  modo: Modo; // só o administrador usa: "ver o app como..."
  setModo: (m: Modo) => void;
  segurarPapel: (p: Papel | null) => void;
  entrar: (email: string, senha: string) => Promise<void>;
  criarConta: (nome: string, email: string, senha: string) => Promise<void>;
  ativarDono: (codigo: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

const Ctx = createContext<Contexto>(null as unknown as Contexto);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [modo, setModo] = useState<Modo>('admin');
  // Usado na tela de QR code: segura o papel antigo até o usuário ver "Você entrou na equipe"
  const [seguro, setSeguro] = useState<Papel | null>(null);

  // 1) Quem está logado?
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUsuario(u);
      if (!u) {
        setPerfil(null);
        setModo('admin');
        setSeguro(null);
        setCarregando(false);
      }
    });
  }, []);

  // 2) Dados do perfil (nome, papel...) acompanhados em tempo real
  useEffect(() => {
    if (!usuario) return;
    return onSnapshot(
      doc(db, 'usuarios', usuario.uid),
      (snap) => {
        setPerfil(snap.exists() ? ({ uid: snap.id, ...(snap.data() as any) } as Perfil) : null);
        setCarregando(false);
      },
      () => setCarregando(false),
    );
  }, [usuario?.uid]);

  const entrar = useCallback(async (email: string, senha: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), senha);
  }, []);

  // Cadastro de cliente (barbeiros também começam assim)
  const criarConta = useCallback(async (nome: string, email: string, senha: string) => {
    const mail = email.trim().toLowerCase();
    const cred = await createUserWithEmailAndPassword(auth, mail, senha);
    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      nome: nome.trim(),
      email: mail,
      papel: 'cliente',
      lembrete: true,
      criadoEm: serverTimestamp(),
    });
  }, []);

  // Primeiro acesso do dono, com o código de uso único gerado pelo administrador
  const ativarDono = useCallback(async (codigoDigitado: string, senha: string) => {
    const codigo = normalizarCodigo(codigoDigitado);
    const refConvite = doc(db, 'convites', codigo);
    const snap = await getDoc(refConvite);
    const c: any = snap.data();
    if (!snap.exists() || c.tipo !== 'dono' || c.usado) {
      throw new Error('Código inválido ou já usado.');
    }
    let uid: string;
    try {
      uid = (await createUserWithEmailAndPassword(auth, c.email, senha)).user.uid;
    } catch (e: any) {
      // Se a conta foi criada numa tentativa anterior que falhou no meio, continua de onde parou
      if (e?.code !== 'auth/email-already-in-use') throw e;
      uid = (await signInWithEmailAndPassword(auth, c.email, senha)).user.uid;
    }
    const lote = writeBatch(db);
    lote.update(refConvite, { usado: true, usadoPor: uid });
    lote.set(doc(db, 'usuarios', uid), {
      nome: c.nome,
      email: c.email,
      papel: 'dono',
      codigo,
      lembrete: true,
      atende: true,
      criadoEm: serverTimestamp(),
    });
    lote.set(doc(db, 'barbeiros', uid), { nome: c.nome, funcao: 'dono' });
    await lote.commit();
  }, []);

  const sair = useCallback(async () => {
    await signOut(auth);
  }, []);

  const papel: Papel | null = seguro ?? perfil?.papel ?? null;

  return (
    <Ctx.Provider
      value={{ carregando, usuario, perfil, papel, modo, setModo, segurarPapel: setSeguro, entrar, criarConta, ativarDono, sair }}
    >
      {children}
    </Ctx.Provider>
  );
}

// Decide se a pessoa pode ver as telas de um papel (o admin pode ver todas)
export function usePermissao(necessario: 'cliente' | 'barbeiro' | 'dono'): 'carregando' | 'ok' | 'negado' {
  const { carregando, usuario, perfil, papel, modo } = useAuth();
  if (carregando) return 'carregando';
  if (!usuario) return 'negado';
  if (!perfil) return 'carregando';
  if (papel === necessario) return 'ok';
  if (papel === 'admin' && modo === necessario) return 'ok';
  return 'negado';
}
