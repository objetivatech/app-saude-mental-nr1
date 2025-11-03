# Guia Completo de Deploy no Cloudflare - Saúde Corporativa

**Versão:** 1.0  
**Data:** Novembro de 2025  
**Autor:** Manus AI  
**Nível:** Iniciante (For Dummies)

---

## 📋 Sumário

1. [Introdução](#introdução)
2. [Pré-requisitos](#pré-requisitos)
3. [Passo 1: Criar Conta no Cloudflare](#passo-1-criar-conta-no-cloudflare)
4. [Passo 2: Instalar Wrangler CLI](#passo-2-instalar-wrangler-cli)
5. [Passo 3: Configurar Banco de Dados D1](#passo-3-configurar-banco-de-dados-d1)
6. [Passo 4: Configurar Armazenamento R2](#passo-4-configurar-armazenamento-r2)
7. [Passo 5: Configurar Variáveis de Ambiente](#passo-5-configurar-variáveis-de-ambiente)
8. [Passo 6: Preparar Código para Deploy](#passo-6-preparar-código-para-deploy)
9. [Passo 7: Fazer Deploy](#passo-7-fazer-deploy)
10. [Passo 8: Configurar Domínio Personalizado](#passo-8-configurar-domínio-personalizado)
11. [Passo 9: Criar Usuário Administrador](#passo-9-criar-usuário-administrador)
12. [Resolução de Problemas](#resolução-de-problemas)

---

## Introdução

Este guia irá te ensinar, **passo a passo**, como fazer o deploy (publicação) do aplicativo Saúde Corporativa na plataforma **Cloudflare**. Não se preocupe se você nunca fez isso antes - vamos explicar tudo de forma simples e clara.

### O que é o Cloudflare?

O **Cloudflare** é uma plataforma de hospedagem na nuvem que oferece serviços rápidos, seguros e escaláveis para aplicações web. Vamos usar três serviços principais:

- **Cloudflare Pages**: Hospedagem do site
- **D1 Database**: Banco de dados SQL
- **R2 Storage**: Armazenamento de arquivos

### Por que usar o Cloudflare?

- ✅ **Gratuito** para começar (plano free generoso)
- ✅ **Rápido** (rede global de servidores)
- ✅ **Escalável** (cresce conforme sua necessidade)
- ✅ **Seguro** (proteção contra ataques)
- ✅ **Simples** de configurar

---

## Pré-requisitos

Antes de começar, você precisa ter:

### 1. Computador com Sistema Operacional

- ✅ Windows 10/11
- ✅ macOS
- ✅ Linux

### 2. Node.js Instalado

**O que é?** Node.js é um ambiente que permite executar JavaScript no seu computador.

**Como verificar se já tenho?**
```bash
node --version
```

Se aparecer algo como `v22.13.0`, você já tem! Se não:

**Como instalar:**
1. Acesse: https://nodejs.org
2. Baixe a versão **LTS** (recomendada)
3. Execute o instalador
4. Siga as instruções na tela
5. Reinicie o terminal/prompt de comando

### 3. Git Instalado

**O que é?** Git é uma ferramenta para controlar versões de código.

**Como verificar:**
```bash
git --version
```

**Como instalar:**
1. Acesse: https://git-scm.com/downloads
2. Baixe para seu sistema operacional
3. Execute o instalador
4. Use as configurações padrão

### 4. Conta no GitHub

**O que é?** GitHub é onde o código do projeto está armazenado.

**Como criar:**
1. Acesse: https://github.com
2. Clique em "Sign up"
3. Preencha seus dados
4. Confirme seu e-mail

### 5. Editor de Código (Opcional, mas recomendado)

**Sugestão:** Visual Studio Code (VS Code)
1. Acesse: https://code.visualstudio.com
2. Baixe e instale
3. É gratuito e fácil de usar

---

## Passo 1: Criar Conta no Cloudflare

### 1.1 Acessar o Site

1. Abra seu navegador
2. Acesse: **https://dash.cloudflare.com/sign-up**

### 1.2 Criar Conta

1. Preencha os dados:
   - **E-mail**: Seu e-mail válido
   - **Senha**: Crie uma senha forte (mínimo 8 caracteres)
2. Clique em **"Create Account"** (Criar Conta)
3. Verifique seu e-mail e clique no link de confirmação

### 1.3 Fazer Login

1. Acesse: **https://dash.cloudflare.com**
2. Faça login com seu e-mail e senha
3. Você verá o **Dashboard** do Cloudflare

**✅ Pronto!** Você agora tem uma conta no Cloudflare.

---

## Passo 2: Instalar Wrangler CLI

### O que é Wrangler?

**Wrangler** é a ferramenta de linha de comando do Cloudflare. É como um "controle remoto" que permite gerenciar seus projetos direto do terminal.

### 2.1 Abrir o Terminal

**Windows:**
- Pressione `Win + R`
- Digite `cmd` e pressione Enter

**macOS:**
- Pressione `Cmd + Espaço`
- Digite `terminal` e pressione Enter

**Linux:**
- Pressione `Ctrl + Alt + T`

### 2.2 Instalar Wrangler

Digite o seguinte comando e pressione Enter:

```bash
npm install -g wrangler
```

**O que acontece?**
- O npm (gerenciador de pacotes do Node.js) vai baixar e instalar o Wrangler
- Pode demorar alguns minutos
- Você verá várias linhas de texto passando

### 2.3 Verificar Instalação

Digite:

```bash
wrangler --version
```

Se aparecer algo como `wrangler 3.x.x`, está tudo certo!

### 2.4 Fazer Login no Wrangler

Digite:

```bash
wrangler login
```

**O que acontece?**
1. Seu navegador abrirá automaticamente
2. Você verá uma página do Cloudflare pedindo permissão
3. Clique em **"Allow"** (Permitir)
4. Volte ao terminal - você verá uma mensagem de sucesso

**✅ Pronto!** Wrangler instalado e conectado à sua conta.

---

## Passo 3: Configurar Banco de Dados D1

### O que é D1?

**D1** é o banco de dados SQL do Cloudflare. É onde ficarão armazenados todos os dados do aplicativo (usuários, empresas, questionários, etc.).

### 3.1 Criar o Banco de Dados

No terminal, digite:

```bash
wrangler d1 create saude-corporativa-db
```

**O que acontece?**
- O Cloudflare cria um banco de dados vazio
- Você verá uma mensagem de sucesso
- **IMPORTANTE:** Copie o `database_id` que aparece na tela

**Exemplo de saída:**
```
✅ Successfully created DB 'saude-corporativa-db'

[[d1_databases]]
binding = "DB"
database_name = "saude-corporativa-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 3.2 Anotar o Database ID

**MUITO IMPORTANTE:** Copie o `database_id` (aquele código longo com letras e números) e guarde em um lugar seguro. Você vai precisar dele mais tarde.

**Exemplo:**
```
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### 3.3 Preparar o Schema do Banco

O schema é a "planta" do banco de dados - define quais tabelas existem e quais campos cada uma tem.

**3.3.1 Navegar até a pasta do projeto**

```bash
cd /caminho/para/app-saude-mental-nr1
```

**Dica:** Se você clonou o repositório na pasta Downloads:
```bash
cd ~/Downloads/app-saude-mental-nr1
```

**3.3.2 Criar arquivo de migração**

O projeto já tem o schema definido em `drizzle/schema.ts`. Precisamos gerar um arquivo SQL a partir dele:

```bash
npx drizzle-kit generate
```

Isso criará arquivos SQL na pasta `drizzle/migrations/`.

**3.3.3 Aplicar o schema ao D1**

Agora vamos "construir" as tabelas no banco de dados:

```bash
wrangler d1 execute saude-corporativa-db --remote --file=./drizzle/migrations/0000_initial.sql
```

**Nota:** O nome do arquivo pode ser diferente. Use o comando `ls drizzle/migrations/` para ver o nome exato.

**O que acontece?**
- O Wrangler envia o schema para o Cloudflare
- As 7 tabelas são criadas no banco D1
- Você verá uma mensagem de sucesso

**✅ Pronto!** Banco de dados criado e configurado.

---

## Passo 4: Configurar Armazenamento R2

### O que é R2?

**R2** é o serviço de armazenamento de arquivos do Cloudflare. É como um "HD na nuvem" onde você pode guardar imagens, documentos, etc.

### 4.1 Criar o Bucket R2

No terminal, digite:

```bash
wrangler r2 bucket create saude-corporativa-files
```

**O que é um bucket?**
Um "bucket" é como uma pasta gigante na nuvem onde você guarda arquivos.

**O que acontece?**
- O Cloudflare cria o bucket
- Você verá uma mensagem de sucesso

**Exemplo de saída:**
```
✅ Created bucket 'saude-corporativa-files'
```

### 4.2 Verificar Buckets Criados

Para confirmar, digite:

```bash
wrangler r2 bucket list
```

Você deve ver `saude-corporativa-files` na lista.

**✅ Pronto!** Armazenamento R2 configurado.

---

## Passo 5: Configurar Variáveis de Ambiente

### O que são Variáveis de Ambiente?

São "configurações secretas" que o aplicativo precisa para funcionar, como senhas, chaves de API, etc. Nunca devem ser compartilhadas publicamente.

### 5.1 Criar Arquivo wrangler.toml

Este arquivo diz ao Cloudflare como configurar seu aplicativo.

**5.1.1 Abrir o projeto no editor**

Se estiver usando VS Code:
```bash
code .
```

**5.1.2 Criar o arquivo**

Na raiz do projeto, crie um arquivo chamado `wrangler.toml` com o seguinte conteúdo:

```toml
name = "saude-corporativa"
compatibility_date = "2025-01-01"
main = "server/index.js"

# Configuração do D1 Database
[[d1_databases]]
binding = "DB"
database_name = "saude-corporativa-db"
database_id = "SEU_DATABASE_ID_AQUI"

# Configuração do R2 Storage
[[r2_buckets]]
binding = "FILES"
bucket_name = "saude-corporativa-files"

# Variáveis de Ambiente
[vars]
NODE_ENV = "production"
```

**IMPORTANTE:** Substitua `SEU_DATABASE_ID_AQUI` pelo database_id que você anotou no Passo 3.2.

### 5.2 Configurar Secrets (Variáveis Secretas)

Algumas variáveis são muito sensíveis e não devem ficar no arquivo `wrangler.toml`. Vamos configurá-las diretamente no Cloudflare.

**5.2.1 Gerar JWT Secret**

O JWT_SECRET é usado para assinar tokens de autenticação. Precisa ser uma string aleatória e segura.

**Gerar no terminal:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado (será algo como: `a1b2c3d4e5f6...`).

**5.2.2 Adicionar secrets ao Cloudflare**

```bash
wrangler secret put JWT_SECRET
```

Quando solicitado, cole o valor gerado acima e pressione Enter.

**5.2.3 Adicionar outras variáveis**

```bash
wrangler secret put DATABASE_URL
```

Cole a URL de conexão do D1 (você pode obter no dashboard do Cloudflare).

**Repita para cada variável necessária:**
- `OAUTH_SERVER_URL`
- `VITE_APP_ID`
- `OWNER_OPEN_ID`
- `OWNER_NAME`

**Dica:** Consulte o arquivo `.env.example` no projeto para ver todas as variáveis necessárias.

**✅ Pronto!** Variáveis configuradas.

---

## Passo 6: Preparar Código para Deploy

### 6.1 Clonar o Repositório (se ainda não fez)

```bash
git clone https://github.com/objetivatech/app-saude-mental-nr1.git
cd app-saude-mental-nr1
```

### 6.2 Instalar Dependências

```bash
npm install
```

ou

```bash
pnpm install
```

**O que acontece?**
- O npm/pnpm baixa todas as bibliotecas que o projeto precisa
- Pode demorar alguns minutos
- Você verá uma barra de progresso

### 6.3 Fazer Build do Projeto

O "build" transforma o código TypeScript/React em arquivos otimizados para produção.

```bash
npm run build
```

ou

```bash
pnpm build
```

**O que acontece?**
- O Vite compila o frontend
- O TypeScript é convertido para JavaScript
- Os arquivos são otimizados e minificados
- Tudo é colocado na pasta `dist/`

**Tempo estimado:** 1-3 minutos

**Você saberá que deu certo quando ver:**
```
✓ built in 45s
```

### 6.4 Verificar Arquivos Gerados

```bash
ls dist/
```

Você deve ver arquivos como `index.html`, `assets/`, etc.

**✅ Pronto!** Código preparado para deploy.

---

## Passo 7: Fazer Deploy

### 7.1 Deploy Inicial

Agora vem a parte emocionante - vamos publicar o aplicativo!

```bash
wrangler pages deploy dist
```

**O que acontece?**
1. Wrangler compacta todos os arquivos da pasta `dist/`
2. Envia para o Cloudflare
3. O Cloudflare distribui pelos servidores globais
4. Você recebe uma URL pública

**Tempo estimado:** 2-5 minutos

**Exemplo de saída:**
```
✨ Success! Uploaded 45 files (3.2 MB)
✨ Deployment complete! Take a peek over at https://xxxxxxxx.pages.dev
```

### 7.2 Anotar a URL

**IMPORTANTE:** Copie a URL que aparece (algo como `https://saude-corporativa-abc.pages.dev`). Essa é a URL pública do seu aplicativo!

### 7.3 Testar o Aplicativo

1. Abra a URL no navegador
2. Você deve ver a página inicial do Saúde Corporativa
3. Teste fazer login

**Se der erro 500 ou página em branco:**
- Verifique se as variáveis de ambiente estão configuradas
- Veja a seção [Resolução de Problemas](#resolução-de-problemas)

### 7.4 Configurar Projeto no Dashboard

1. Acesse: https://dash.cloudflare.com
2. Vá em **"Workers & Pages"**
3. Clique no seu projeto (`saude-corporativa`)
4. Vá em **"Settings"** > **"Environment variables"**
5. Adicione as variáveis que faltam

**✅ Pronto!** Aplicativo no ar!

---

## Passo 8: Configurar Domínio Personalizado

### Por que usar domínio personalizado?

Em vez de `https://saude-corporativa-abc.pages.dev`, você pode usar `https://saudecorporativa.com.br`.

### 8.1 Ter um Domínio

**Opção 1: Já tenho um domínio**
- Pule para 8.2

**Opção 2: Preciso comprar um domínio**
1. Acesse: https://registro.br (para .com.br)
2. Ou: https://www.namecheap.com (para .com)
3. Pesquise o domínio desejado
4. Compre (geralmente R$ 40-60/ano)

### 8.2 Adicionar Domínio ao Cloudflare

1. No dashboard do Cloudflare, clique em **"Add a Site"**
2. Digite seu domínio (ex: `saudecorporativa.com.br`)
3. Escolha o plano **Free**
4. Clique em **"Add Site"**

### 8.3 Configurar Nameservers

O Cloudflare vai te dar 2 nameservers (algo como `ns1.cloudflare.com` e `ns2.cloudflare.com`).

1. Acesse o painel do seu registrador de domínio (Registro.br, Namecheap, etc.)
2. Encontre a seção **"Nameservers"** ou **"DNS"**
3. Substitua os nameservers atuais pelos do Cloudflare
4. Salve as alterações

**Tempo de propagação:** 2-24 horas

### 8.4 Conectar Domínio ao Pages

1. No dashboard do Cloudflare, vá em **"Workers & Pages"**
2. Clique no projeto `saude-corporativa`
3. Vá em **"Custom domains"**
4. Clique em **"Set up a custom domain"**
5. Digite seu domínio (ex: `saudecorporativa.com.br`)
6. Clique em **"Continue"**
7. Cloudflare configura automaticamente

**✅ Pronto!** Seu aplicativo agora está em `https://saudecorporativa.com.br`

---

## Passo 9: Criar Usuário Administrador

### Por que preciso disso?

O primeiro usuário precisa ser criado manualmente como administrador para poder gerenciar o sistema.

### 9.1 Acessar o Banco de Dados D1

1. Acesse: https://dash.cloudflare.com
2. Vá em **"Workers & Pages"** > **"D1"**
3. Clique em `saude-corporativa-db`
4. Vá na aba **"Console"**

### 9.2 Fazer Login no Aplicativo

1. Acesse seu aplicativo (a URL do Passo 7.2)
2. Clique em **"Acessar"** ou **"Login"**
3. Faça login com sua conta (Google, e-mail, etc.)
4. **Anote o e-mail que você usou**

### 9.3 Encontrar seu OpenID

Após fazer login, o sistema cria um registro na tabela `users`. Precisamos encontrar seu `openId`.

**No Console do D1, execute:**

```sql
SELECT id, openId, email, name FROM users ORDER BY createdAt DESC LIMIT 5;
```

Você verá uma lista dos últimos usuários criados. Encontre o seu pelo e-mail.

**Exemplo de resultado:**
```
| id | openId                | email              | name          |
|----|----------------------|-------------------|---------------|
| 1  | abc123def456         | seu@email.com     | Seu Nome      |
```

**Copie o `openId`** (no exemplo acima: `abc123def456`).

### 9.4 Promover a Administrador

**No Console do D1, execute:**

```sql
UPDATE users 
SET role = 'admin', userType = 'admin' 
WHERE openId = 'SEU_OPEN_ID_AQUI';
```

**IMPORTANTE:** Substitua `SEU_OPEN_ID_AQUI` pelo openId que você copiou.

**Exemplo:**
```sql
UPDATE users 
SET role = 'admin', userType = 'admin' 
WHERE openId = 'abc123def456';
```

### 9.5 Verificar

```sql
SELECT id, email, role, userType FROM users WHERE role = 'admin';
```

Você deve ver seu usuário com `role = 'admin'` e `userType = 'admin'`.

### 9.6 Testar Acesso Admin

1. Volte ao aplicativo
2. Faça logout e login novamente
3. Acesse: `https://sua-url.com/admin/dashboard`
4. Você deve ver o painel administrativo!

**✅ Pronto!** Você agora é o administrador do sistema.

---

## Resolução de Problemas

### Problema 1: "wrangler: command not found"

**Causa:** Wrangler não foi instalado corretamente.

**Solução:**
```bash
npm install -g wrangler
```

Se ainda não funcionar, reinicie o terminal.

---

### Problema 2: "Database not found"

**Causa:** O `database_id` no `wrangler.toml` está errado.

**Solução:**
1. Execute: `wrangler d1 list`
2. Copie o `database_id` correto
3. Atualize o `wrangler.toml`
4. Faça deploy novamente

---

### Problema 3: Página em branco após deploy

**Causa:** Variáveis de ambiente faltando.

**Solução:**
1. Acesse: https://dash.cloudflare.com
2. Vá em **"Workers & Pages"** > seu projeto
3. **"Settings"** > **"Environment variables"**
4. Adicione todas as variáveis necessárias
5. Faça redeploy: `wrangler pages deploy dist`

---

### Problema 4: Erro 500 ao fazer login

**Causa:** `JWT_SECRET` não configurado.

**Solução:**
```bash
wrangler secret put JWT_SECRET
```

Cole um valor aleatório gerado com:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Problema 5: "Cannot connect to database"

**Causa:** Migrações não foram aplicadas.

**Solução:**
```bash
wrangler d1 execute saude-corporativa-db --remote --file=./drizzle/migrations/0000_initial.sql
```

---

### Problema 6: Deploy falha com erro de build

**Causa:** Dependências não instaladas ou código com erro.

**Solução:**
1. Delete a pasta `node_modules/`
2. Execute: `npm install` ou `pnpm install`
3. Execute: `npm run build` ou `pnpm build`
4. Corrija erros que aparecerem
5. Tente o deploy novamente

---

### Problema 7: Não consigo acessar painel admin

**Causa:** Usuário não foi promovido a admin.

**Solução:**
Siga o [Passo 9](#passo-9-criar-usuário-administrador) novamente.

---

## Comandos Úteis - Resumo

### Verificar versões
```bash
node --version
npm --version
wrangler --version
```

### Gerenciar D1
```bash
# Listar bancos de dados
wrangler d1 list

# Executar SQL
wrangler d1 execute saude-corporativa-db --remote --command="SELECT * FROM users"

# Executar arquivo SQL
wrangler d1 execute saude-corporativa-db --remote --file=./script.sql
```

### Gerenciar R2
```bash
# Listar buckets
wrangler r2 bucket list

# Listar arquivos em um bucket
wrangler r2 object list saude-corporativa-files
```

### Gerenciar Secrets
```bash
# Adicionar secret
wrangler secret put NOME_DA_VARIAVEL

# Listar secrets
wrangler secret list

# Deletar secret
wrangler secret delete NOME_DA_VARIAVEL
```

### Deploy e Logs
```bash
# Deploy
wrangler pages deploy dist

# Ver logs em tempo real
wrangler pages deployment tail

# Listar deployments
wrangler pages deployment list
```

---

## Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] Conta no Cloudflare criada
- [ ] Wrangler instalado e autenticado
- [ ] Banco de dados D1 criado e migrado
- [ ] Bucket R2 criado
- [ ] Arquivo `wrangler.toml` configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Build do projeto executado com sucesso
- [ ] Deploy realizado com sucesso
- [ ] Aplicativo acessível pela URL pública
- [ ] Usuário administrador criado
- [ ] Painel administrativo acessível
- [ ] Domínio personalizado configurado (opcional)

---

## Próximos Passos

Após o deploy bem-sucedido, você pode:

1. **Cadastrar Planos**: Criar planos de assinatura para empresas
2. **Adicionar Conteúdos**: Criar materiais educativos sobre saúde mental
3. **Convidar Empresas**: Compartilhar a URL com empresas interessadas
4. **Monitorar Uso**: Acompanhar métricas no dashboard do Cloudflare
5. **Fazer Backups**: Exportar dados do D1 regularmente

---

## Suporte

Se você encontrar problemas não listados aqui:

1. **Documentação Oficial do Cloudflare**: https://developers.cloudflare.com
2. **Comunidade Discord do Cloudflare**: https://discord.gg/cloudflaredev
3. **Issues no GitHub**: Abra uma issue no repositório do projeto

---

## Conclusão

Parabéns! 🎉 Você concluiu o deploy do aplicativo Saúde Corporativa no Cloudflare. Agora sua plataforma está disponível globalmente, com alta performance e segurança.

Lembre-se de:
- Fazer backups regulares do banco de dados
- Monitorar o uso e performance
- Atualizar o código conforme necessário
- Manter as dependências atualizadas

**Desenvolvido com ❤️ por Manus AI**

**Última atualização:** Novembro de 2025
