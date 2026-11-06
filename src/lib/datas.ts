// Funções de data e hora (sempre no horário do celular)
import { Horarios } from './tipos';

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
const DIAS_LONGOS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const pad = (n: number) => String(n).padStart(2, '0');

// Data -> "2026-10-14"
export function chaveDia(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// "2026-10-14" -> Data
export function dataDeChave(c: string): Date {
  const [a, m, d] = c.split('-').map(Number);
  return new Date(a, m - 1, d);
}

// Lista de n dias começando em "de" (hoje por padrão)
export function proximosDias(n: number, de: Date = new Date()): Date[] {
  return Array.from({ length: n }, (_, i) => new Date(de.getFullYear(), de.getMonth(), de.getDate() + i));
}

export const diaCurto = (d: Date) => DIAS_CURTOS[d.getDay()];
export const nomeDiaSemana = (d: Date) => DIAS_LONGOS[d.getDay()];

// "Quarta, 14 de outubro"
export function dataLonga(d: Date): string {
  return `${DIAS_LONGOS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

// Dia + hora -> milissegundos
export function inicioEmMs(dia: string, hora: string): number {
  const [a, m, d] = dia.split('-').map(Number);
  const [h, mi] = hora.split(':').map(Number);
  return new Date(a, m - 1, d, h, mi).getTime();
}

export function minutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

export function horaDeMinutos(min: number): string {
  return `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
}

// Todos os horários possíveis de um dia, segundo o que o dono configurou
export function gerarHorarios(h: Horarios | null | undefined, d: Date): string[] {
  if (!h) return [];
  const cfg = h.dias[String(d.getDay())];
  if (!cfg || !cfg.aberto) return [];
  const ini = minutos(cfg.abre);
  const fim = minutos(cfg.fecha);
  const lista: string[] = [];
  for (let t = ini; t + h.duracao <= fim; t += h.duracao) lista.push(horaDeMinutos(t));
  return lista;
}

// Horários padrão mostrados ao dono na primeira vez que abrir "Dias e horários"
export function horariosPadrao(): Horarios {
  const dias: Horarios['dias'] = {};
  for (let i = 0; i < 7; i++) {
    dias[String(i)] = { aberto: i >= 1 && i <= 6, abre: '09:00', fecha: '18:00' };
  }
  return { duracao: 60, dias };
}
