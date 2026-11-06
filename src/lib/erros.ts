// Transforma erros do Firebase em frases simples
export function erroAmigavel(e: any): string {
  const codigo: string = e?.code ?? '';
  switch (codigo) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-login-credentials':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Esse e-mail já tem uma conta.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/network-request-failed':
      return 'Sem internet. Tente de novo.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Espere um pouco e tente de novo.';
    case 'permission-denied':
    case 'firestore/permission-denied':
      return 'Sem permissão para essa ação.';
    default:
      // Erros que nós mesmos criamos (new Error('texto')) já vêm em português
      if (e instanceof Error && !codigo && e.message) return e.message;
      return 'Algo deu errado. Tente de novo.';
  }
}
