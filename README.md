# Binance Launchpad Notify

Este é um script Node.js que extrai dados do [Binance Launchpad](https://launchpad.binance.com/pt-BR/viewall/lp) usando Puppeteer, salva os dados em um arquivo JSON e envia um email sempre que um novo projeto for adicionado.

## Requisitos

- Node.js
- Puppeteer
- Nodemailer
- dotenv
- Googleapis

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/ghostnetrn/binanceLauchpadNotify.git
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto e defina as seguintes variáveis:

   ```plaintext
   CLIENT_ID=seu_client_id
   CLIENT_SECRET=seu_client_secret
   REFRESH_TOKEN=seu_refresh_token
   EMAIL_USER=seu_email_de_envio@gmail.com
   DEST_EMAIL=email_de_destinatario@gmail.com
   ```

   Certifique-se de substituir `seu_client_id`, `seu_client_secret`, `seu_refresh_token`, `seu_email_de_envio@gmail.com` e `email_de_destinatario@gmail.com` pelos seus próprios valores.

   Tutorial para gerar o client_id e client_secret https://rupali.hashnode.dev/send-emails-in-nodejs-using-nodemailer-gmail-oauth2

5. Execute o script:

Para executar o script, você tem duas opções:

1. **Usando npm start:**

   Este comando inicia a execução do script Node.js. Ele é útil quando você está desenvolvendo e deseja executar o script localmente.

   ```bash
   npm start
   ```

2. **Usando Docker Compose:**

   Este comando inicia o script Node.js em um contêiner Docker usando Docker Compose. É útil quando você deseja executar o script em um ambiente isolado e garantir que todas as dependências estejam corretamente configuradas.

   ```bash
   docker compose up -d
   ```

   - `docker compose up`: Inicia o contêiner conforme definido no arquivo `docker-compose.yml`.
   - `-d` ou `--detach`: Executa o contêiner em segundo plano, liberando o terminal atual para outras tarefas.

Ambos os comandos iniciarão a execução do script para extrair dados do Binance Launchpad, salvá-los em um arquivo JSON e enviar um email sempre que um novo projeto for adicionado. Certifique-se de ter configurado corretamente as variáveis de ambiente no arquivo `.env` antes de executar o script.

## Funcionalidades

- O script extrai dados dos projetos listados no Binance Launchpad e os salva em um arquivo JSON.
- Se um novo projeto for adicionado, ele enviará um email com o nome do projeto e seu status.
- O script verifica automaticamente a cada 24 horas se há novos projetos e os adiciona ao arquivo JSON.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções de bugs. Basta abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
