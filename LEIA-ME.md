# Barbearia Nexus — como rodar no seu celular

Este pacote tem **todas as telas** do design: cliente, barbeiro, dono e administrador.
Use o **VS Code** (não o Visual Studio): ele é leve e é o editor padrão do mundo React Native/Expo.
Você não precisa instalar Android Studio nem Xcode para testar: basta o app **Expo Go** no celular.

---

## PARTE 1 — Instalar o que precisa (uma vez só)

1. **Node.js (versão LTS)**: https://nodejs.org → instale e reinicie o computador.
   Teste no terminal: `node -v` (deve mostrar um número, ex.: v22.x).
2. **VS Code**: https://code.visualstudio.com
3. **Expo Go** no celular (Play Store ou App Store).
4. Computador e celular na **mesma rede Wi-Fi**.

## PARTE 2 — Criar o Firebase (o "banco de dados")

1. Entre em https://console.firebase.google.com com sua conta Google e clique em **Adicionar projeto**.
   Nome sugerido: `nexus-barbearia-teste`. Pode desativar o Google Analytics.
2. Menu **Criação > Authentication > Vamos começar > E-mail/senha > Ativar > Salvar**.
3. Menu **Criação > Firestore Database > Criar banco de dados**.
   Local: `southamerica-east1` (São Paulo). Modo: **produção**.
4. No Firestore, aba **Regras**: apague tudo, cole o conteúdo do arquivo `firestore.rules` deste pacote e clique em **Publicar**.
5. Engrenagem ao lado de "Visão geral do projeto" > **Configurações do projeto** > role até **Seus aplicativos** > ícone **`</>` (Web)**.
   Dê um apelido (ex.: `nexus`), **não** marque Hosting, clique em **Registrar app**.
   Vai aparecer um bloco `firebaseConfig = { apiKey: ..., ... }`. Deixe essa aba aberta.
6. **Criar a SUA conta de administrador** (é feito aqui, nunca dentro do app):
   - **Authentication > Usuários > Adicionar usuário**: seu e-mail e uma senha forte. Copie o **UID** que aparece na lista.
   - **Firestore Database > Iniciar coleção**: ID da coleção `usuarios`; ID do documento = o **UID** que você copiou.
     Campos (todos do tipo indicado):
     - `nome` (string): `Luan`
     - `email` (string): o mesmo e-mail, em minúsculas
     - `papel` (string): `admin`
     - `lembrete` (boolean): `true`

## PARTE 3 — Criar o projeto no computador

Abra o terminal (no VS Code: menu **Terminal > Novo Terminal**) numa pasta de sua escolha, por exemplo `Documentos`.

```bash
npx create-expo-app@latest barbearia-nexus --template blank-typescript
cd barbearia-nexus
```

Agora **copie para dentro da pasta `barbearia-nexus`** os itens deste pacote:

- as pastas `app` e `src`
- os arquivos `app.json` (substitua o existente), `tsconfig.json` (substitua) e `firestore.rules`

Depois **apague** os arquivos `App.tsx` e `index.ts` que o Expo criou na raiz (o app agora começa pela pasta `app`).

Instale as bibliotecas (o `expo install` escolhe as versões certas para o seu Expo):

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar expo-font @expo-google-fonts/nunito @react-native-async-storage/async-storage expo-notifications expo-camera react-native-svg expo-clipboard expo-crypto
npm install firebase react-native-qrcode-svg
npm pkg set main=expo-router/entry
```

Abra a pasta no VS Code: `code .` (ou **Arquivo > Abrir Pasta**).

Abra o arquivo `src/lib/firebaseConfig.ts` e troque cada `COLE_AQUI` pelos valores do `firebaseConfig` da Parte 2, passo 5.

## PARTE 4 — Rodar no celular

```bash
npx expo start
```

- **Android**: abra o **Expo Go** e toque em **Scan QR code**; escaneie o QR que apareceu no terminal.
- **iPhone**: abra a **Câmera** do iPhone, aponte para o QR e toque no aviso para abrir no Expo Go.
- Se o celular não conectar (rede da empresa/faculdade bloqueia): `npx expo start --tunnel` (ele vai pedir para instalar `@expo/ngrok`; aceite).
- Ao salvar um arquivo no VS Code, o app atualiza sozinho no celular.

## PARTE 5 — Roteiro de teste (nesta ordem)

1. **Administrador**: no login, entre com o e-mail/senha da Parte 2, passo 6.
   Você cai em "Administrador geral". Toque **Perfil do dono**, preencha nome e e-mail de um dono de teste (use um e-mail seu diferente), **Salvar e gerar código**. Aparece algo como `K7M2-Q9XR`. Toque **Copiar código**.
   Dica: os botões **Cliente / Barbeiro / Dono** em "Ver o app como" mostram as telas de cada perfil; a faixa preta "Modo administrador · Voltar" leva você de volta.
2. **Sair** (aba Perfil/botão Sair). Na tela de login, toque **Sou o dono da barbearia**, digite o código, crie a senha.
3. **Dono**: em **Meu perfil > Dias e horários**, marque os dias, ajuste abre/fecha com + e −, escolha 30 min ou 1 hora e **Salvar horários**.
   O interruptor **Atender clientes** deixa você aparecer na lista de barbeiros.
4. **Cliente**: saia, toque **Ainda não tenho conta · Criar conta**, cadastre um cliente.
   **Reservar novo horário** > escolha o barbeiro > dia > horário > **Confirmar reserva**.
5. **Barbeiro**: precisa de **outra conta de cliente** (pode ser em outro celular, ou saia e crie outra).
   Antes, no celular do dono: aba **Barbeiros > Gerar QR code**.
   No celular do barbeiro: **Perfil > Sou da equipe > Ler QR code** (se só tiver um celular, digite o código que aparece abaixo do QR).
   Ele vira barbeiro e vê **Início / Agenda / Perfil**; na Agenda confirma ou cancela reservas.
6. **Dono descadastra**: aba Barbeiros > **Descadastrar**. O barbeiro volta a ser cliente.

## Limitações desta versão (importante ler)

- **Login do administrador com Google Authenticator NÃO está incluído.** O admin entra com e-mail e senha (a conta é criada por você no Firebase, a senha nunca fica no código). O Authenticator exige o Firebase "Identity Platform" e testes no seu projeto; dá para acrescentar depois como etapa própria.
- **Lembretes**: ficam no próprio celular (1 hora antes). Funcionam enquanto o app foi aberto ao menos uma vez depois da reserva. No **Expo Go do Android** as notificações podem ser limitadas; se não tocarem, é o Expo Go, e não o código — elas funcionam no app instalado de verdade (etapa de publicação).
- **O barbeiro não recebe aviso quando um cliente reserva** (isso exigiria notificação push com servidor). Ele vê a reserva na Agenda e recebe o lembrete de 1 hora antes de cada cliente.
- O QR code é de **uso único**. Cada barbeiro novo precisa de um QR novo.
- O código de ativação do dono é de uso único.
- Cancelar apaga a reserva e libera o horário (não guarda histórico).
- Os horários só são validados no app; o servidor impede apenas reservas em dobro no mesmo horário.

## Se der erro

- **"Component auth has not been registered yet"** ou erro de `firebase/auth` ao abrir: crie na raiz o arquivo `metro.config.js` com
  ```js
  const { getDefaultConfig } = require('expo/metro-config');
  const config = getDefaultConfig(__dirname);
  config.resolver.sourceExts.push('cjs');
  config.resolver.unstable_enablePackageExports = false;
  module.exports = config;
  ```
  e rode `npx expo start -c`.
- **"Missing or insufficient permissions"**: as regras da Parte 2, passo 4 não foram publicadas, ou a conta de admin (Parte 2, passo 6) está com `papel` diferente de `admin`.
- **"The query requires an index"**: o erro traz um link; clique nele e depois em Criar índice.
- **Tela em branco depois de criar conta**: confirme que o Firestore está criado e que as regras foram publicadas.
- Depois de qualquer mudança em `app.json` ou instalar pacotes: `npx expo start -c`.
