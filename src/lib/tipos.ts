// Tipos usados em todo o app
export type Papel = 'cliente' | 'barbeiro' | 'dono' | 'admin';
export type Modo = 'admin' | 'cliente' | 'barbeiro' | 'dono';

export interface Perfil {
  uid: string;
  nome: string;
  email: string;
  papel: Papel;
  lembrete: boolean;
  atende?: boolean; // só para o dono: aparece na lista de barbeiros?
}

export interface Agendamento {
  id: string;
  clienteId: string;
  clienteNome: string;
  barbeiroId: string;
  barbeiroNome: string;
  dia: string; // AAAA-MM-DD
  hora: string; // HH:MM
  inicioMs: number;
  status: 'pendente' | 'confirmado';
}

export interface Barbeiro {
  id: string;
  nome: string;
  funcao: 'barbeiro' | 'dono';
}

export interface DiaHorario {
  aberto: boolean;
  abre: string; // HH:MM
  fecha: string; // HH:MM
}

export interface Horarios {
  duracao: number; // 30 ou 60 (minutos)
  dias: Record<string, DiaHorario>; // chave '0' (domingo) até '6' (sábado)
}
