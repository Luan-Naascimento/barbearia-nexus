// Lembretes: notificações agendadas no próprio celular (não precisam de servidor)
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import { LEMBRETE_MINUTOS } from '../config';
import { Agendamento } from './tipos';

const CHAVE = 'nexus_lembretes'; // guarda { idAgendamento: idNotificacao }

// O Expo Go do Android não suporta notificações desde o SDK 53: nele os lembretes ficam desligados
const SEM_SUPORTE =
  Platform.OS === 'android' && Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let modulo: any = null;
function notificacoes(): any {
  if (SEM_SUPORTE) return null;
  if (!modulo) {
    // Só carrega o módulo quando for usar (carregar no início causa o erro no Expo Go)
    modulo = require('expo-notifications');
    modulo.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }
  return modulo;
}

export async function pedirPermissao(): Promise<boolean> {
  const N = notificacoes();
  if (!N) return false;
  try {
    if (Platform.OS === 'android') {
      await N.setNotificationChannelAsync('default', {
        name: 'Lembretes',
        importance: N.AndroidImportance.HIGH,
      });
    }
    const atual = await N.getPermissionsAsync();
    if (atual.granted) return true;
    const nova = await N.requestPermissionsAsync();
    return nova.granted;
  } catch {
    return false;
  }
}

async function lerMapa(): Promise<Record<string, string>> {
  try {
    return JSON.parse((await AsyncStorage.getItem(CHAVE)) ?? '{}');
  } catch {
    return {};
  }
}

// Fila para duas chamadas seguidas não agendarem o mesmo lembrete duas vezes
let fila: Promise<void> = Promise.resolve();

// Deixa os lembretes iguais à lista de agendamentos: agenda os novos e cancela os que sumiram
export function sincronizarLembretes(
  agendamentos: Agendamento[],
  ligado: boolean,
  texto: (a: Agendamento) => string,
): Promise<void> {
  const N = notificacoes();
  if (!N) return Promise.resolve();
  fila = fila.then(async () => {
    try {
      const mapa = await lerMapa();
      const agora = Date.now();
      const desejados = ligado
        ? agendamentos.filter((a) => a.inicioMs - LEMBRETE_MINUTOS * 60000 > agora)
        : [];
      const ids = new Set(desejados.map((a) => a.id));

      for (const id of Object.keys(mapa)) {
        if (!ids.has(id)) {
          await N.cancelScheduledNotificationAsync(mapa[id]).catch(() => {});
          delete mapa[id];
        }
      }

      if (desejados.length > 0 && !(await pedirPermissao())) {
        await AsyncStorage.setItem(CHAVE, JSON.stringify(mapa));
        return;
      }
      for (const a of desejados) {
        if (mapa[a.id]) continue;
        const quando = new Date(a.inicioMs - LEMBRETE_MINUTOS * 60000);
        mapa[a.id] = await N.scheduleNotificationAsync({
          content: { title: 'Lembrete de horário', body: texto(a) },
          trigger: { type: 'date', date: quando, channelId: 'default' },
        });
      }
      await AsyncStorage.setItem(CHAVE, JSON.stringify(mapa));
    } catch (e) {
      console.warn('Lembretes:', e);
    }
  });
  return fila;
}