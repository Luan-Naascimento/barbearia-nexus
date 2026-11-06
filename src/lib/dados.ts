// Todas as conversas com o banco de dados (Firestore) ficam aqui
import {
  collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, writeBatch,
} from 'firebase/firestore';
import * as Crypto from 'expo-crypto';
import { db } from './firebase';
import { inicioEmMs } from './datas';
import { Agendamento, Barbeiro, Horarios, Perfil } from './tipos';

const col = (nome: string) => collection(db, nome);
const aviso = (e: unknown) => console.warn('Firestore:', e);

// ---------------------------------------------------------------- códigos
// Código de 8 letras/números sem caracteres confusos (0/O, 1/I): "K7M2-Q9XR"
export function gerarCodigo(): string {
  const letras = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = Crypto.getRandomBytes(8);
  let s = '';
  bytes.forEach((b) => {
    s += letras[b % letras.length];
  });
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

// Aceita "k7m2q9xr", "K7M2-Q9XR", com espaços etc.
export function normalizarCodigo(texto: string): string {
  const limpo = texto.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return limpo.length > 4 ? `${limpo.slice(0, 4)}-${limpo.slice(4, 8)}` : limpo;
}

// ---------------------------------------------------------------- agendamentos
export const idAgendamento = (barbeiroId: string, dia: string, hora: string) =>
  `${barbeiroId}_${dia}_${hora.replace(':', '')}`;

function mapear(snap: any): Agendamento[] {
  return snap.docs
    .map((d: any) => ({ id: d.id, ...d.data() }) as Agendamento)
    .sort((a: Agendamento, b: Agendamento) => a.inicioMs - b.inicioMs);
}

export function ouvirDoCliente(uid: string, cb: (l: Agendamento[]) => void) {
  return onSnapshot(query(col('agendamentos'), where('clienteId', '==', uid)), (s) => cb(mapear(s)), aviso);
}

// dia = null traz todos os dias do barbeiro
export function ouvirDoBarbeiro(uid: string, dia: string | null, cb: (l: Agendamento[]) => void) {
  const q = dia
    ? query(col('agendamentos'), where('barbeiroId', '==', uid), where('dia', '==', dia))
    : query(col('agendamentos'), where('barbeiroId', '==', uid));
  return onSnapshot(q, (s) => cb(mapear(s)), aviso);
}

// Agenda de todos os barbeiros nos dias pedidos (painel do dono)
export function ouvirDosDias(dias: string[], cb: (l: Agendamento[]) => void) {
  return onSnapshot(query(col('agendamentos'), where('dia', 'in', dias)), (s) => cb(mapear(s)), aviso);
}

// Horas já ocupadas de um barbeiro em um dia
export function ouvirOcupados(barbeiroId: string, dia: string, cb: (horas: string[]) => void) {
  const q = query(col('ocupados'), where('barbeiroId', '==', barbeiroId), where('dia', '==', dia));
  return onSnapshot(q, (s) => cb(s.docs.map((d: any) => d.data().hora as string)), aviso);
}

export async function reservar(p: {
  cliente: { uid: string; nome: string };
  barbeiro: { id: string; nome: string };
  dia: string;
  hora: string;
}): Promise<Agendamento> {
  const id = idAgendamento(p.barbeiro.id, p.dia, p.hora);
  const dados = {
    clienteId: p.cliente.uid,
    clienteNome: p.cliente.nome,
    barbeiroId: p.barbeiro.id,
    barbeiroNome: p.barbeiro.nome,
    dia: p.dia,
    hora: p.hora,
    inicioMs: inicioEmMs(p.dia, p.hora),
    status: 'pendente' as const,
  };
  const lote = writeBatch(db);
  lote.set(doc(db, 'agendamentos', id), { ...dados, criadoEm: serverTimestamp() });
  lote.set(doc(db, 'ocupados', id), { barbeiroId: p.barbeiro.id, dia: p.dia, hora: p.hora });
  await lote.commit();
  return { id, ...dados };
}

export async function cancelarAgendamento(ag: Agendamento) {
  const lote = writeBatch(db);
  lote.delete(doc(db, 'agendamentos', ag.id));
  lote.delete(doc(db, 'ocupados', ag.id));
  await lote.commit();
}

export async function confirmarAgendamento(id: string) {
  await updateDoc(doc(db, 'agendamentos', id), { status: 'confirmado' });
}

// ---------------------------------------------------------------- barbeiros
export function ouvirBarbeiros(cb: (l: Barbeiro[]) => void) {
  return onSnapshot(
    col('barbeiros'),
    (s) => cb(s.docs.map((d: any) => ({ id: d.id, ...d.data() }) as Barbeiro)),
    aviso,
  );
}

// Barbeiro lê o QR code do dono e entra na equipe
export async function entrarNaEquipe(uid: string, nome: string, codigoLido: string) {
  const codigo = normalizarCodigo(codigoLido);
  const ref = doc(db, 'convites', codigo);
  const snap = await getDoc(ref);
  const c: any = snap.data();
  if (!snap.exists() || c.tipo !== 'barbeiro' || c.usado) {
    throw new Error('QR code inválido ou já usado.');
  }
  const lote = writeBatch(db);
  lote.update(ref, { usado: true, usadoPor: uid });
  lote.update(doc(db, 'usuarios', uid), { papel: 'barbeiro', convite: codigo });
  lote.set(doc(db, 'barbeiros', uid), { nome, funcao: 'barbeiro' });
  await lote.commit();
}

// Dono descadastra: o barbeiro volta a ser cliente comum
export async function descadastrarBarbeiro(uid: string) {
  const lote = writeBatch(db);
  lote.delete(doc(db, 'barbeiros', uid));
  lote.update(doc(db, 'usuarios', uid), { papel: 'cliente' });
  await lote.commit();
}

// Dono gera um QR code (código de uso único) para um barbeiro
export async function criarConviteBarbeiro(): Promise<string> {
  const codigo = gerarCodigo();
  await setDoc(doc(db, 'convites', codigo), { tipo: 'barbeiro', usado: false, criadoEm: serverTimestamp() });
  return codigo;
}

// Admin cria o código de ativação do dono
export async function criarConviteDono(nome: string, email: string): Promise<string> {
  const codigo = gerarCodigo();
  await setDoc(doc(db, 'convites', codigo), {
    tipo: 'dono',
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    usado: false,
    criadoEm: serverTimestamp(),
  });
  return codigo;
}

// Tela de ativação do dono: confere se o código existe e ainda não foi usado
export async function verificarCodigoDono(texto: string) {
  const codigo = normalizarCodigo(texto);
  const snap = await getDoc(doc(db, 'convites', codigo));
  const c: any = snap.data();
  if (!snap.exists() || c.tipo !== 'dono' || c.usado) {
    throw new Error('Código inválido ou já usado.');
  }
  return { codigo, nome: c.nome as string, email: c.email as string };
}

// ---------------------------------------------------------------- perfil e horários
export async function definirLembrete(uid: string, ligado: boolean) {
  await updateDoc(doc(db, 'usuarios', uid), { lembrete: ligado });
}

// Dono liga/desliga "Atender clientes" (aparecer na lista de barbeiros)
export async function definirAtende(perfil: Perfil, ligado: boolean) {
  const lote = writeBatch(db);
  lote.update(doc(db, 'usuarios', perfil.uid), { atende: ligado });
  if (ligado) lote.set(doc(db, 'barbeiros', perfil.uid), { nome: perfil.nome, funcao: 'dono' });
  else lote.delete(doc(db, 'barbeiros', perfil.uid));
  await lote.commit();
}

export function ouvirHorarios(cb: (h: Horarios | null) => void) {
  return onSnapshot(
    doc(db, 'config', 'barbearia'),
    (s) => cb(s.exists() ? (s.data() as Horarios) : null),
    aviso,
  );
}

export async function salvarHorarios(h: Horarios) {
  await setDoc(doc(db, 'config', 'barbearia'), h);
}
