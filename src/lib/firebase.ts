// Liga o app ao Firebase (login + banco de dados)
import { getApp, getApps, initializeApp } from 'firebase/app';
// @ts-ignore: getReactNativePersistence existe no pacote para React Native
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './firebaseConfig';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// O login fica salvo no celular (AsyncStorage) para o usuário não digitar sempre
function criarAuth() {
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // Em recarga rápida (Fast Refresh) o auth já existe
    return getAuth(app);
  }
}

export const auth = criarAuth();
export const db = getFirestore(app);
