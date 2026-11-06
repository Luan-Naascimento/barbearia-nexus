# Barbearia Nexus

Aplicativo móvel para organizar os agendamentos de uma barbearia. Clientes reservam horários, barbeiros acompanham e confirmam atendimentos e o dono administra a equipe e o funcionamento da barbearia. Há também um perfil de administrador geral para configurar o acesso do dono e visualizar o app como os outros perfis.

## Funcionalidades

- Cadastro e autenticação por e-mail e senha.
- Agenda atualizada em tempo real com Firebase Firestore.
- Reserva de horários de acordo com os dias, expediente e duração definidos pelo dono.
- Proteção contra duas reservas no mesmo horário.
- Confirmação e cancelamento de reservas.
- Cadastro de barbeiros na equipe por QR code ou código de uso único.
- Ativação da conta do dono com código individual.
- Lembretes locais de agendamentos, configuráveis no perfil.
- Interface em português, otimizada para dispositivos móveis.

## Perfis e telas

O aplicativo encaminha cada usuário para a área correspondente ao papel registrado no perfil. As rotas abaixo ficam na pasta `app/`; as telas com abas possuem navegação inferior.

### Acesso e ativação

| Tela | O que faz |
|---|---|
| **Login** (`app/(auth)/login.tsx`) | Permite entrar com e-mail e senha ou alternar para o cadastro de cliente. Também direciona o dono para a ativação da conta. |
| **Código de ativação** (`app/(auth)/ativacao.tsx`) | Valida o código de uso único fornecido ao dono da barbearia. |
| **Criar senha** (`app/(auth)/dono-conta.tsx`) | Exibe o nome e o e-mail associados ao convite e cria a conta do dono com uma senha. |
| **Tudo pronto** (`app/(auth)/dono-pronto.tsx`) | Confirma a criação da conta e leva ao painel do dono. |
| **Ler QR code** (`app/ler-qr.tsx`) | Permite que um usuário com conta de cliente entre na equipe lendo o QR code do dono ou digitando o código. |
| **Você entrou na equipe** (`app/equipe-ok.tsx`) | Confirma a entrada do barbeiro e abre a área de agenda. |

### Cliente

Abas: **Início** e **Perfil**.

| Tela | O que faz |
|---|---|
| **Início** (`app/cliente/(abas)/index.tsx`) | Mostra o próximo horário, o barbeiro, o estado da confirmação e a opção de cancelar. O botão de reserva inicia um novo agendamento. |
| **Escolha do barbeiro** (`app/cliente/barbeiros.tsx`) | Lista quem está disponível para atender — barbeiros e, se habilitado, o próprio dono. |
| **Escolha do horário** (`app/cliente/agenda.tsx`) | Permite selecionar um dos próximos 14 dias abertos e um horário futuro ainda livre. |
| **Confirmar reserva** (`app/cliente/confirmacao.tsx`) | Revisa data, hora, barbeiro e lembrete antes de gravar a reserva. |
| **Perfil** (`app/cliente/(abas)/perfil.tsx`) | Exibe nome e e-mail, permite ativar ou desativar lembretes, entrar na equipe pelo QR code e sair da conta. |

### Barbeiro

Abas: **Início**, **Agenda** e **Perfil**.

| Tela | O que faz |
|---|---|
| **Início** (`app/barbeiro/(abas)/index.tsx`) | Resume a quantidade de clientes do dia, as reservas pendentes de confirmação e o próximo atendimento. |
| **Agenda** (`app/barbeiro/(abas)/agenda.tsx`) | Mostra os agendamentos por dia nos próximos sete dias; permite confirmar ou cancelar cada reserva. |
| **Perfil** (`app/barbeiro/(abas)/perfil.tsx`) | Exibe os dados do barbeiro, configura lembretes locais e permite sair. |

### Dono da barbearia

Abas: **Painel**, **Barbeiros** e **Meu perfil**.

| Tela | O que faz |
|---|---|
| **Painel do dono** (`app/dono/(abas)/index.tsx`) | Mostra a agenda de hoje ou dos próximos sete dias. O dono pode cancelar reservas e abrir as configurações de expediente. |
| **Barbeiros** (`app/dono/(abas)/barbeiros.tsx`) | Lista os barbeiros cadastrados, permite descadastrá-los ou gerar um QR code para uma nova pessoa. |
| **Meu perfil** (`app/dono/(abas)/perfil.tsx`) | Permite definir se o dono também atende clientes, acessar os horários, ver seus próprios atendimentos de hoje e sair. |
| **Dias e horários** (`app/dono/horarios.tsx`) | Define a duração dos atendimentos (30 ou 60 minutos), dias abertos e horários de abertura e fechamento. |
| **QR code da equipe** (`app/dono/qr-equipe.tsx`) | Gera um QR code de uso único para um barbeiro entrar na equipe; também mostra o código para digitação manual. |

### Administrador geral

O administrador é provisionado diretamente no Firebase; não há fluxo público de cadastro de administrador.

| Tela | O que faz |
|---|---|
| **Painel do administrador** (`app/admin/index.tsx`) | Permite alternar para visualizar as áreas de cliente, barbeiro ou dono e iniciar a configuração do perfil do dono. |
| **Perfil do dono** (`app/admin/dono-perfil.tsx`) | Recebe o nome e o e-mail do dono e gera um código de ativação. |
| **Código do dono** (`app/admin/codigo.tsx`) | Mostra o código gerado e permite copiá-lo ou compartilhar a mensagem pelo WhatsApp. |

## Fluxo principal

1. O administrador configura os dados do dono e compartilha o código de ativação.
2. O dono cria sua conta, define o expediente e, se desejar, libera a própria agenda para clientes.
3. O dono gera um QR code individual para cada barbeiro; o barbeiro cria uma conta de cliente e usa o QR code para entrar na equipe.
4. O cliente cria uma conta, escolhe um profissional, seleciona um dia e horário disponíveis e confirma a reserva.
5. A reserva aparece nas agendas do cliente, do barbeiro correspondente e do dono. O barbeiro pode confirmá-la; cliente, barbeiro ou dono podem cancelá-la.

## Tecnologias e organização

- **Expo SDK 58**, **React Native 0.88** e **TypeScript 6**.
- **Expo Router** para rotas e navegação por abas.
- **Firebase Authentication** para contas por e-mail e senha.
- **Cloud Firestore** para perfis, convites, horários, equipe e agendamentos; os listeners mantêm as telas atualizadas em tempo real.
- **Expo Camera** e **react-native-qrcode-svg** para leitura e geração de QR codes.
- **Expo Notifications** e **AsyncStorage** para lembretes locais.
- **Expo Clipboard** para copiar códigos.
- Tipos, acesso ao Firestore, autenticação, datas, notificações e componentes compartilhados ficam em `src/`.

### Dados no Firestore

O app usa estas coleções e documentos:

| Coleção | Conteúdo |
|---|---|
| `usuarios` | Perfil, e-mail, papel e preferências de lembrete de cada conta. |
| `convites` | Códigos de ativação de dono ou de entrada na equipe, com estado de uso. |
| `barbeiros` | Profissionais disponíveis para escolha dos clientes. |
| `config/barbearia` | Duração dos atendimentos e expediente semanal. |
| `agendamentos` | Reservas, estado e dados necessários para exibi-las nas agendas. |
| `ocupados` | Bloqueios de horários reservados para evitar duplicidade. |

## Como executar o projeto

### Requisitos
- Node.js
- npm
- Projeto configurado no Firebase

### Instalação

git clone URL_DO_REPOSITORIO

cd barbearia-nexus

npm install

npx expo start

## Regras e limitações atuais

- O acesso do administrador é por e-mail e senha; autenticação multifator/Google Authenticator não está implementada.
- Os lembretes são notificações locais no dispositivo, programadas para **1 hora antes** do horário. No Android, o Expo Go não oferece suporte a essas notificações; use um development build ou a versão instalada para testá-las.
- Não há notificação push para avisar o barbeiro quando uma nova reserva é criada. Ele pode acompanhar as reservas na Agenda.
- Os códigos de ativação do dono e os QR codes da equipe são de uso único.
- Cancelar uma reserva a remove do Firestore e libera o horário; não há histórico de cancelamentos.
- O cliente pode reservar nos próximos **14 dias**. A disponibilidade exibida é calculada a partir do expediente salvo; a validação do servidor impede a duplicidade do horário, mas não revalida integralmente o expediente.
- As credenciais de conexão do Firebase ficam em `src/lib/firebaseConfig.ts`. A autorização dos dados deve ser feita pelas regras do Firestore, e não pela ocultação desses valores no aplicativo.

## Arquitetura

- React Native: construção das telas.
- Expo: ambiente de desenvolvimento.
- TypeScript: tipagem e organização do código.
- Expo Router: navegação entre telas.
- Firebase Authentication: autenticação dos usuários.
- Cloud Firestore: armazenamento dos dados.
- Expo Camera: leitura de QR codes.
