# EcoWaste

Aplicativo de coleta e reciclagem de resíduos, com perfis de **ecomorador** e **ecotaxista**, desenvolvido com React Native, Expo e TypeScript. Usa Expo Router para navegação e MQTT sobre WebSocket para comunicação com os serviços do sistema.

Este guia explica como executar o aplicativo em um celular usando o **Expo Go**.

## 1. Pré-requisitos

- Computador com Windows, macOS ou Linux.
- [Node.js](https://nodejs.org/) **22.13.0 ou superior**. Prefira a versão 22 atualizada, conforme o arquivo `.nvmrc`.
- npm, instalado junto com o Node.js.
- Código deste repositório disponível no computador.
- Celular Android ou iPhone com uma versão do Expo Go compatível com o **Expo SDK 57**.
- Computador e celular na mesma rede local para a execução por Wi-Fi.
- Broker MQTT e backend do EcoWaste acessíveis pelo celular para usar cadastro, login e demais operações.

As versões declaradas no projeto são Expo `~57.0.31`, React Native `0.86.3` e React `19.2.3`. O requisito de Node também está definido em `package.json` e na [referência oficial do SDK 57](https://docs.expo.dev/versions/v57.0.0/).

Para executar pelo Expo Go no Android, não é necessário instalar Android Studio, Java, emulador ou gerar um APK do EcoWaste. A instalação do Expo Go no iPhone tem condições específicas, descritas a seguir.

## 2. Instalar o Expo Go compatível

### Android

1. No celular, acesse a [página oficial de download do Expo Go](https://expo.dev/go).
2. Selecione **SDK 57** e **Android / dispositivo físico**.
3. Baixe e instale a versão indicada. Se o download for um APK, autorize a instalação pelo navegador quando o Android solicitar.
4. Abra o Expo Go.

A versão da Play Store pode corresponder a outro SDK. Caso apareça uma mensagem de incompatibilidade, use o instalador específico do SDK 57. Veja a [orientação oficial sobre versões incompatíveis](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/).

### iPhone / iPad físico

**Na documentação consultada em 22/10/2026, o Expo Go para SDK 55 ou superior não está disponível na App Store.** Para este projeto, que usa SDK 57, a Expo orienta distribuir o Expo Go pelo TestFlight usando `eas go`. Esse caminho exige participação no Apple Developer Program e acesso à equipe interna do TestFlight. Confira o [guia oficial de distribuição do Expo Go pelo TestFlight](https://expo.fyi/deploy-expo-go-testflight).

Se a sua equipe já disponibilizou o Expo Go para SDK 57, instale-o pelo convite do TestFlight. Caso precise preparar essa distribuição:

```sh
npm install -g eas-cli
eas login
eas go --sdk-version 57
```

Siga as solicitações de autenticação da Apple, assinatura e envio ao App Store Connect. Após a disponibilização para a equipe interna, instale pelo TestFlight no celular. A compilação acontece na nuvem e não exige um Mac.

Para abrir o projeto em um iPhone físico, entre com a **mesma conta Expo** no Expo Go e na CLI do computador:

```sh
npx expo login
npx expo whoami
```

Crie uma conta em [expo.dev/signup](https://expo.dev/signup), se necessário. Essa conta é diferente do cadastro de usuário do EcoWaste. Consulte a [documentação sobre autenticação no Expo Go para iOS](https://docs.expo.dev/troubleshooting/expo-go-sign-in-required/).

## 3. Abrir a pasta e instalar as dependências

Abra um terminal na raiz do projeto, onde estão `package.json` e `app.json`. No Windows, para a localização deste checkout:

```powershell
cd C:\PROJETOS\EcoWaste\ecoWaste
```

Se o código estiver em outro diretório, ajuste o caminho. Confira as versões e instale as dependências registradas em `package-lock.json`:

```sh
node --version
npm --version
npm ci
```

O Node deve ser pelo menos `v22.13.0`. Depois de instalar ou atualizar o Node, reabra o terminal antes de executar os comandos.

O projeto usa a CLI local do Expo por meio de `npx`; não é necessário instalar o pacote antigo `expo-cli` globalmente.

## 4. Iniciar o Expo para abrir no Expo Go

Na raiz do projeto, execute:

```sh
npm start -- --go
```

Comando equivalente:

```sh
npx expo start --go
```

**Use `--go`**, pois o projeto inclui `expo-dev-client` e a CLI pode selecionar uma development build por padrão. Essa opção força o destino Expo Go, conforme a [documentação da Expo CLI](https://docs.expo.dev/more/expo-cli/#launch-target).

Mantenha o terminal aberto. Aguarde o servidor Metro iniciar e exibir o QR code.

### Abrir no Android

1. Conecte o celular à mesma rede do computador.
2. Abra o Expo Go e use a opção de escanear QR code, quando disponível.
3. Escaneie o QR code exibido no terminal e confirme a abertura.
4. Aguarde o download do bundle e a exibição do EcoWaste.

### Abrir no iPhone

1. Confirme que instalou o Expo Go compatível e que está conectado à mesma conta Expo usada na CLI.
2. Conecte o celular à mesma rede do computador.
3. Abra a Câmera do iPhone e escaneie o QR code do terminal.
4. Toque no link para abrir no Expo Go e aguarde o carregamento.
5. Autorize o acesso à rede local, se solicitado pelo iOS.

O [guia oficial de início do desenvolvimento](https://docs.expo.dev/get-started/start-developing/) explica a abertura pelo QR code e a conexão na mesma rede.

## 5. Usar e verificar o aplicativo

1. Confirme que a tela inicial exibe a marca EcoWaste e os botões **LogIn** e **Cadastro**.
2. Para uma conta nova, entre em **Cadastro**, selecione o perfil de ecomorador ou ecotaxista e preencha os dados solicitados.
3. Confirme o código OTP solicitado pela tela. O fornecimento desse código depende do backend; verifique com a equipe o canal configurado para recebê-lo.
4. Entre em **LogIn** com uma conta válida e confirme o OTP de acesso quando solicitado.
5. Nas funcionalidades de leitura de QR code e localização, permita o acesso à câmera e à localização do celular.

Se a tela inicial carregar, mas login ou cadastro falharem, confira o broker e o backend descritos na seção 4. Não há uma conta de demonstração documentada neste repositório.

Para conferir a conexão MQTT, procure no terminal a mensagem `Conectado ao broker MQTT`. Essa mensagem confirma a conexão com o broker; a resposta às operações também depende do backend.

## 6. Rotina de desenvolvimento

- Salve alterações nos arquivos para que o Fast Refresh atualize o aplicativo.
- Pressione `r` no terminal para recarregar.
- Após alterar a configuração do broker ou suas credenciais, recarregue o aplicativo para refazer as conexões.
- Pressione `Ctrl+C` para encerrar o servidor.
- Para executar novamente em outro momento, abra a raiz do projeto e rode `npm start -- --go`.

## 7. Solução de problemas

### O QR code não abre ou o aplicativo não conecta ao Metro

1. Verifique se computador e celular estão na mesma rede e se a rede permite comunicação entre os dispositivos. Redes de convidados podem bloquear essa comunicação.
2. Confira se o terminal continua aberto e se o QR code foi gerado com `--go`.
3. Verifique se uma VPN está alterando a rota de rede e permita ao Node.js acesso à rede privada no firewall do computador.
4. O Metro usa a porta `8081` por padrão. Se outra porta for escolhida, use o QR code atualizado.

Como alternativa para acessar o Metro pela internet, instale o suporte a túnel e inicie com:

```sh
npm install -g @expo/ngrok
npx expo start --go --tunnel
```

O túnel exige internet nos dois dispositivos e pode ser mais lento. Veja a [documentação de túneis da Expo CLI](https://docs.expo.dev/more/expo-cli/#tunneling).

**O túnel do Expo disponibiliza o Metro, mas não o broker MQTT.** Para usar as operações do EcoWaste, o celular ainda precisa alcançar o endereço configurado em `api_url.json`. Em outra rede ou nos dados móveis, um IP privado como `192.168.66.10` não estará acessível diretamente.

### Aparece “Project is incompatible with this version of Expo Go”

Confirme que o Expo Go suporta o SDK **57** e siga a instalação correspondente na seção 2. Atualizar pela loja não garante essa correspondência. Consulte o [guia oficial de incompatibilidade](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/).

### O QR code tenta abrir uma development build

Encerre o servidor com `Ctrl+C` e reinicie com `npm start -- --go`.

Os scripts `npm run android` e `npm run ios` executam `expo run:android` e `expo run:ios`, que compilam um aplicativo nativo. Para seguir este guia pelo Expo Go, use o comando com `--go`.

### No iPhone aparece uma solicitação para entrar na conta Expo

Execute `npx expo login` no computador e entre na mesma conta dentro do Expo Go. Confira a conta da CLI com `npx expo whoami`. Se trocar de conta, reinicie o servidor. Veja a [orientação oficial para esse erro](https://docs.expo.dev/troubleshooting/expo-go-sign-in-required/).

### Login ou cadastro exibe “Falha MQTT” ou tempo esgotado

Confira o endereço em `api_url.json`, as credenciais em `mqttOptions.ts`, o listener WebSocket, o firewall e os serviços do backend. A autenticação do aplicativo usa esperas de aproximadamente 10 segundos para conexão e resposta; falta de resposta não significa necessariamente senha incorreta.

### Alterações não aparecem ou o bundle apresenta erro após instalar dependências

Encerre o Metro e limpe seu cache ao reiniciar:

```sh
npx expo start --go --clear
```

Para diagnosticar incompatibilidades de dependências:

```sh
npx expo-doctor@latest
npx expo install --check
```

Se o diagnóstico indicar versões desalinhadas, avalie a correção abaixo e revise as alterações em `package.json` e `package-lock.json`:

```sh
npx expo install --fix
```

### Câmera ou localização não funciona

Confira as permissões do **Expo Go** nas configurações do celular, ative a localização do aparelho e recarregue o aplicativo. Os recursos de mapa também podem precisar de internet para carregar os dados externos.

### No PowerShell aparece que `npm.ps1` não pode ser executado

Use os executáveis `.cmd`, por exemplo:

```powershell
npm.cmd ci
npm.cmd start -- --go
```

Para comandos com `npx`, use `npx.cmd` da mesma maneira.

## 8. Comandos disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm ci` | Instalar as dependências a partir do lockfile. |
| `npm start -- --go` | Iniciar para abrir no Expo Go pela rede local. |
| `npx expo start --go --clear` | Iniciar limpando o cache do Metro. |
| `npx expo start --go --tunnel` | Iniciar com túnel para o Metro. |
| `npm run android` | Compilar e executar uma versão nativa Android. |
| `npm run ios` | Compilar e executar uma versão nativa iOS, com ambiente macOS/Xcode. |
| `npm run web` | Iniciar a versão web; este guia cobre o aplicativo no celular. |
| `npm test` | Executar os testes Jest em modo de observação. |
| `npm test -- --watchAll=false` | Executar os testes Jest uma única vez. |

## 9. Estrutura principal

```text
app/                  Telas e rotas do Expo Router
  (auth)/             Cadastro e login
  (private)/          Telas de ecomorador e ecotaxista
  components/         Componentes usados nas telas
  utils/              Endereço do broker e opções MQTT
assets/               Imagens e fontes
components/           Componentes compartilhados
contexts/             Contextos de autenticação e idioma
i18n/                 Traduções
__tests__/            Testes automatizados
app.json              Configuração do aplicativo Expo
eas.json              Perfis de build EAS
package.json          Dependências e scripts
```
