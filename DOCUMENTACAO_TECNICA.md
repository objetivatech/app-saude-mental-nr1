# Documentação Técnica - Saúde Corporativa MVP

**Versão:** 1.0  
**Data:** Novembro de 2025  
**Autor:** Manus AI

---

## Sumário Executivo

O sistema **Saúde Corporativa** é uma plataforma web desenvolvida para monitoramento e promoção da saúde mental no ambiente de trabalho, em conformidade com a **Norma Regulamentadora NR1** que trata de disposições gerais e gerenciamento de riscos ocupacionais. A aplicação permite que empresas monitorem o bem-estar de seus colaboradores através de questionários periódicos, enquanto oferece acesso a profissionais da saúde mental qualificados.

Este MVP (Minimum Viable Product) foi desenvolvido utilizando tecnologias modernas e escaláveis, preparado para deploy na infraestrutura **Cloudflare** com banco de dados **D1 SQL** e armazenamento **R2**.

---

## Arquitetura do Sistema

### Stack Tecnológico

A aplicação foi construída utilizando uma arquitetura **full-stack moderna** com as seguintes tecnologias:

| Camada | Tecnologia | Versão | Descrição |
|--------|-----------|--------|-----------|
| **Frontend** | React | 19 | Framework JavaScript para construção de interfaces |
| **Estilização** | Tailwind CSS | 4 | Framework CSS utility-first |
| **Componentes UI** | shadcn/ui | Latest | Biblioteca de componentes acessíveis |
| **Backend** | Express.js | 4 | Framework Node.js para servidor HTTP |
| **API Layer** | tRPC | 11 | Framework type-safe para APIs |
| **ORM** | Drizzle ORM | Latest | ORM TypeScript-first para SQL |
| **Banco de Dados** | MySQL/TiDB | - | Banco de dados relacional |
| **Autenticação** | Manus OAuth | - | Sistema de autenticação integrado |
| **Linguagem** | TypeScript | Latest | Superset tipado de JavaScript |

### Estrutura de Diretórios

O projeto segue uma estrutura organizada que separa claramente as responsabilidades:

```
app-saude-mental-nr1/
├── client/                      # Código frontend
│   ├── public/                  # Arquivos estáticos
│   └── src/
│       ├── components/          # Componentes reutilizáveis
│       │   ├── ui/             # Componentes shadcn/ui
│       │   └── DashboardLayout.tsx
│       ├── pages/              # Páginas da aplicação
│       │   ├── admin/          # Páginas administrativas
│       │   ├── company/        # Páginas de empresa
│       │   ├── employee/       # Páginas de funcionário
│       │   └── professional/   # Páginas de profissional
│       ├── lib/                # Utilitários e configurações
│       ├── App.tsx             # Configuração de rotas
│       └── index.css           # Estilos globais
├── server/                      # Código backend
│   ├── _core/                  # Infraestrutura do servidor
│   ├── db.ts                   # Operações de banco de dados
│   └── routers.ts              # Definição de rotas tRPC
├── drizzle/                     # Schema e migrações do banco
│   └── schema.ts               # Definição de tabelas
└── shared/                      # Código compartilhado
```

---

## Modelagem de Dados

### Diagrama Entidade-Relacionamento

O banco de dados foi modelado para suportar múltiplos tipos de usuários e suas interações:

```
users (1) ──────── (1) companies
  │                      │
  │                      │
  │                 (1) ─┴─ (N) employees
  │                              │
  │                              │
  │                         (1) ─┴─ (N) surveyResponses
  │
  └────── (1) healthProfessionals

plans (1) ──── (N) companies

educationalContents (standalone)
```

### Tabelas do Banco de Dados

#### 1. **users** - Tabela de Usuários

Armazena informações básicas de autenticação de todos os usuários do sistema.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | INT | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| `openId` | VARCHAR(64) | ID do OAuth Manus | NOT NULL, UNIQUE |
| `name` | TEXT | Nome do usuário | - |
| `email` | VARCHAR(320) | E-mail do usuário | - |
| `loginMethod` | VARCHAR(64) | Método de login utilizado | - |
| `role` | ENUM | Papel do usuário (user, admin) | NOT NULL, DEFAULT 'user' |
| `userType` | ENUM | Tipo de perfil (company, employee, health_professional, admin) | - |
| `createdAt` | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |
| `updatedAt` | TIMESTAMP | Data de atualização | NOT NULL, ON UPDATE NOW() |
| `lastSignedIn` | TIMESTAMP | Último login | NOT NULL, DEFAULT NOW() |

#### 2. **companies** - Tabela de Empresas

Armazena informações das empresas cadastradas na plataforma.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | INT | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| `userId` | INT | Referência ao usuário | NOT NULL, FOREIGN KEY → users(id) |
| `companyName` | VARCHAR(255) | Nome da empresa | NOT NULL |
| `cnpj` | VARCHAR(18) | CNPJ da empresa | NOT NULL, UNIQUE |
| `contactEmail` | VARCHAR(320) | E-mail de contato | NOT NULL |
| `contactPhone` | VARCHAR(20) | Telefone de contato | - |
| `planId` | INT | Referência ao plano | FOREIGN KEY → plans(id) |
| `approved` | BOOLEAN | Status de aprovação | NOT NULL, DEFAULT FALSE |
| `createdAt` | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |
| `updatedAt` | TIMESTAMP | Data de atualização | NOT NULL, ON UPDATE NOW() |

#### 3. **employees** - Tabela de Funcionários

Armazena informações dos funcionários vinculados às empresas.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | INT | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| `userId` | INT | Referência ao usuário | NOT NULL, FOREIGN KEY → users(id) |
| `companyId` | INT | Referência à empresa | NOT NULL, FOREIGN KEY → companies(id) |
| `employeeName` | VARCHAR(255) | Nome do funcionário | NOT NULL |
| `employeeEmail` | VARCHAR(320) | E-mail do funcionário | NOT NULL |
| `department` | VARCHAR(100) | Departamento | - |
| `position` | VARCHAR(100) | Cargo | - |
| `createdAt` | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |
| `updatedAt` | TIMESTAMP | Data de atualização | NOT NULL, ON UPDATE NOW() |

#### 4. **healthProfessionals** - Tabela de Profissionais da Saúde

Armazena informações dos profissionais de saúde mental cadastrados.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | INT | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| `userId` | INT | Referência ao usuário | NOT NULL, FOREIGN KEY → users(id) |
| `professionalName` | VARCHAR(255) | Nome do profissional | NOT NULL |
| `specialty` | VARCHAR(100) | Especialidade | NOT NULL |
| `registrationNumber` | VARCHAR(50) | Número de registro profissional | NOT NULL, UNIQUE |
| `contactEmail` | VARCHAR(320) | E-mail de contato | NOT NULL |
| `contactPhone` | VARCHAR(20) | Telefone de contato | - |
| `bio` | TEXT | Biografia/apresentação | - |
| `approved` | BOOLEAN | Status de aprovação | NOT NULL, DEFAULT FALSE |
| `createdAt` | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |
| `updatedAt` | TIMESTAMP | Data de atualização | NOT NULL, ON UPDATE NOW() |

#### 5. **surveyResponses** - Tabela de Respostas de Questionários

Armazena as respostas dos questionários de bem-estar dos funcionários.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | INT | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| `employeeId` | INT | Referência ao funcionário | NOT NULL, FOREIGN KEY → employees(id) |
| `responseDate` | DATE | Data da resposta | NOT NULL |
| `moodLevel` | INT | Nível de humor (1-5) | NOT NULL |
| `stressLevel` | INT | Nível de estresse (1-5) | NOT NULL |
| `fatigueLevel` | INT | Nível de cansaço (1-5) | NOT NULL |
| `workSatisfaction` | INT | Satisfação com trabalho (1-5) | NOT NULL |
| `observations` | TEXT | Observações adicionais | - |
| `createdAt` | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |

#### 6. **educationalContents** - Tabela de Conteúdos Educativos

Armazena materiais educativos sobre saúde mental gerenciados pelos administradores.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | INT | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| `title` | VARCHAR(255) | Título do conteúdo | NOT NULL |
| `contentType` | ENUM | Tipo (article, video, podcast, infographic, guide) | NOT NULL |
| `description` | TEXT | Descrição do conteúdo | NOT NULL |
| `contentUrl` | VARCHAR(500) | URL do conteúdo | - |
| `thumbnailUrl` | VARCHAR(500) | URL da thumbnail | - |
| `published` | BOOLEAN | Status de publicação | NOT NULL, DEFAULT FALSE |
| `createdAt` | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |
| `updatedAt` | TIMESTAMP | Data de atualização | NOT NULL, ON UPDATE NOW() |

#### 7. **plans** - Tabela de Planos

Armazena os planos de assinatura disponíveis para empresas.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | INT | Identificador único | PRIMARY KEY, AUTO_INCREMENT |
| `planName` | VARCHAR(100) | Nome do plano | NOT NULL |
| `planType` | ENUM | Tipo (basic, professional, enterprise) | NOT NULL |
| `price` | INT | Preço em centavos | NOT NULL |
| `billingPeriod` | ENUM | Período (monthly, quarterly, yearly) | NOT NULL |
| `maxEmployees` | INT | Número máximo de funcionários | - |
| `features` | TEXT | Recursos do plano (JSON) | - |
| `active` | BOOLEAN | Status do plano | NOT NULL, DEFAULT TRUE |
| `createdAt` | TIMESTAMP | Data de criação | NOT NULL, DEFAULT NOW() |
| `updatedAt` | TIMESTAMP | Data de atualização | NOT NULL, ON UPDATE NOW() |

---

## API e Endpoints

### Arquitetura tRPC

O sistema utiliza **tRPC** para comunicação type-safe entre frontend e backend. Todos os endpoints são definidos como **procedures** que podem ser **públicas** (acessíveis sem autenticação) ou **protegidas** (requerem autenticação).

### Categorias de Endpoints

#### **1. Autenticação (auth)**

| Procedure | Tipo | Descrição | Retorno |
|-----------|------|-----------|---------|
| `me` | Query | Retorna dados do usuário autenticado | User \| null |
| `logout` | Mutation | Realiza logout do usuário | { success: boolean } |
| `updateUserType` | Mutation | Atualiza tipo de perfil do usuário | { success: boolean } |

**Exemplo de uso:**
```typescript
const { data: user } = trpc.auth.me.useQuery();
const logoutMutation = trpc.auth.logout.useMutation();
```

#### **2. Empresas (company)**

| Procedure | Tipo | Acesso | Descrição |
|-----------|------|--------|-----------|
| `register` | Mutation | Protected | Cadastra nova empresa |
| `getMyCompany` | Query | Company Only | Retorna dados da empresa do usuário |
| `getEmployees` | Query | Company Only | Lista funcionários da empresa |
| `getWellnessStats` | Query | Company Only | Retorna estatísticas de bem-estar |
| `getSurveyResponses` | Query | Company Only | Lista respostas de questionários |

**Exemplo de uso:**
```typescript
const registerMutation = trpc.company.register.useMutation({
  onSuccess: () => console.log("Empresa cadastrada!")
});

registerMutation.mutate({
  companyName: "Empresa XYZ",
  cnpj: "12.345.678/0001-90",
  contactEmail: "contato@empresa.com"
});
```

#### **3. Funcionários (employee)**

| Procedure | Tipo | Acesso | Descrição |
|-----------|------|--------|-----------|
| `register` | Mutation | Protected | Cadastra funcionário vinculado a empresa |
| `getMyProfile` | Query | Employee Only | Retorna perfil do funcionário |
| `submitSurvey` | Mutation | Employee Only | Submete questionário de bem-estar |
| `getMySurveyHistory` | Query | Employee Only | Retorna histórico de respostas |

**Exemplo de uso:**
```typescript
const submitMutation = trpc.employee.submitSurvey.useMutation();

submitMutation.mutate({
  moodLevel: 4,
  stressLevel: 2,
  fatigueLevel: 3,
  workSatisfaction: 5,
  observations: "Semana produtiva"
});
```

#### **4. Profissionais da Saúde (healthProfessional)**

| Procedure | Tipo | Acesso | Descrição |
|-----------|------|--------|-----------|
| `register` | Mutation | Protected | Cadastra profissional da saúde |
| `getAll` | Query | Public | Lista profissionais aprovados |

#### **5. Conteúdos Educativos (content)**

| Procedure | Tipo | Acesso | Descrição |
|-----------|------|--------|-----------|
| `getPublished` | Query | Public | Lista conteúdos publicados |
| `getAll` | Query | Admin Only | Lista todos os conteúdos |
| `create` | Mutation | Admin Only | Cria novo conteúdo |
| `update` | Mutation | Admin Only | Atualiza conteúdo existente |
| `delete` | Mutation | Admin Only | Remove conteúdo |

#### **6. Administração (admin)**

| Procedure | Tipo | Acesso | Descrição |
|-----------|------|--------|-----------|
| `getPendingCompanies` | Query | Admin Only | Lista empresas aguardando aprovação |
| `approveCompany` | Mutation | Admin Only | Aprova cadastro de empresa |
| `getPendingProfessionals` | Query | Admin Only | Lista profissionais aguardando aprovação |
| `approveProfessional` | Mutation | Admin Only | Aprova cadastro de profissional |
| `getAllCompanies` | Query | Admin Only | Lista todas as empresas |

#### **7. Planos (plan)**

| Procedure | Tipo | Acesso | Descrição |
|-----------|------|--------|-----------|
| `getAll` | Query | Public | Lista planos ativos |
| `create` | Mutation | Admin Only | Cria novo plano |

---

## Segurança e Autenticação

### Sistema de Autenticação

O sistema utiliza **Manus OAuth** para autenticação de usuários, garantindo segurança e facilidade de uso. O fluxo de autenticação funciona da seguinte forma:

1. **Login**: Usuário é redirecionado para o portal OAuth do Manus
2. **Callback**: Após autenticação bem-sucedida, o sistema recebe o `openId` do usuário
3. **Sessão**: Um cookie de sessão é criado e assinado com `JWT_SECRET`
4. **Contexto**: Cada requisição à API verifica o cookie e injeta `ctx.user` nas procedures protegidas

### Controle de Acesso por Perfil

O sistema implementa **Role-Based Access Control (RBAC)** com quatro tipos de perfil:

| Perfil | Código | Permissões |
|--------|--------|------------|
| **Empresa** | `company` | Gerenciar funcionários, visualizar relatórios, estatísticas de bem-estar |
| **Funcionário** | `employee` | Responder questionários, visualizar histórico pessoal |
| **Profissional** | `health_professional` | Ser listado no diretório de profissionais |
| **Administrador** | `admin` | Aprovar cadastros, gerenciar conteúdos, acesso total ao sistema |

### Procedures Protegidas

O sistema define **middleware** específico para cada tipo de perfil:

```typescript
// Exemplo de middleware de empresa
const companyProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.userType !== 'company') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Company access required' });
  }
  return next({ ctx });
});
```

---

## Deploy e Configuração

### Variáveis de Ambiente

O sistema utiliza as seguintes variáveis de ambiente pré-configuradas:

| Variável | Descrição | Uso |
|----------|-----------|-----|
| `DATABASE_URL` | String de conexão MySQL/TiDB | Conexão com banco de dados |
| `JWT_SECRET` | Segredo para assinatura de tokens | Segurança de sessões |
| `VITE_APP_ID` | ID da aplicação OAuth | Autenticação frontend |
| `OAUTH_SERVER_URL` | URL do servidor OAuth | Autenticação backend |
| `VITE_OAUTH_PORTAL_URL` | URL do portal de login | Redirecionamento de login |
| `OWNER_OPEN_ID` | OpenID do proprietário | Permissões de administrador |
| `VITE_APP_TITLE` | Título da aplicação | Branding |
| `VITE_APP_LOGO` | URL do logo | Branding |

### Preparação para Cloudflare

Para deploy no **Cloudflare Pages** com **D1 Database** e **R2 Storage**, os seguintes ajustes são necessários:

#### 1. **Configuração do D1 (Banco de Dados)**

```bash
# Criar banco de dados D1
wrangler d1 create saude-corporativa-db

# Aplicar schema
wrangler d1 execute saude-corporativa-db --file=./drizzle/migrations/schema.sql
```

#### 2. **Configuração do R2 (Armazenamento)**

```bash
# Criar bucket R2 para arquivos
wrangler r2 bucket create saude-corporativa-files
```

#### 3. **Arquivo wrangler.toml**

```toml
name = "saude-corporativa"
compatibility_date = "2025-01-01"

[[d1_databases]]
binding = "DB"
database_name = "saude-corporativa-db"
database_id = "<D1_DATABASE_ID>"

[[r2_buckets]]
binding = "FILES"
bucket_name = "saude-corporativa-files"
```

### Comandos de Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Aplicar migrações do banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar testes
pnpm test
```

---

## Conformidade com NR1

A **Norma Regulamentadora NR1** estabelece disposições gerais sobre segurança e saúde no trabalho, incluindo o gerenciamento de riscos ocupacionais. O sistema **Saúde Corporativa** atende aos seguintes requisitos:

### Gerenciamento de Riscos Psicossociais

A plataforma permite o **monitoramento contínuo** de indicadores de saúde mental através de questionários periódicos que avaliam:

- **Humor**: Indicador do estado emocional geral
- **Estresse**: Nível de tensão e pressão percebida
- **Fadiga**: Cansaço físico e mental
- **Satisfação**: Contentamento com o ambiente de trabalho

### Documentação e Rastreabilidade

Todas as respostas são **armazenadas com timestamp** e vinculadas ao funcionário e empresa, permitindo:

- Análise histórica de tendências
- Identificação precoce de riscos
- Geração de relatórios para auditorias
- Comprovação de ações preventivas

### Acesso a Profissionais Qualificados

A plataforma facilita o **contato com profissionais da saúde mental** certificados, garantindo que colaboradores tenham acesso a suporte especializado quando necessário.

---

## Manutenção e Evolução

### Próximas Funcionalidades Sugeridas

1. **Notificações Automáticas**: Alertas para empresas quando indicadores críticos são detectados
2. **Relatórios Exportáveis**: Geração de PDFs e planilhas para auditorias
3. **Agendamento de Consultas**: Integração direta com profissionais da saúde
4. **Gamificação**: Sistema de recompensas para engajamento em atividades de bem-estar
5. **Integração com Wearables**: Coleta de dados de dispositivos de monitoramento de saúde
6. **Dashboard Analítico Avançado**: Visualizações interativas com gráficos e tendências
7. **Sistema de Mensagens**: Chat interno entre funcionários e profissionais
8. **Conteúdos Personalizados**: Recomendações baseadas em perfil e histórico

### Boas Práticas de Manutenção

- **Backups Regulares**: Realizar backups diários do banco de dados
- **Monitoramento de Performance**: Acompanhar métricas de uso e tempo de resposta
- **Atualizações de Segurança**: Manter dependências atualizadas
- **Logs de Auditoria**: Registrar ações administrativas e acessos sensíveis
- **Testes Automatizados**: Implementar testes unitários e de integração

---

## Suporte Técnico

Para questões técnicas, dúvidas ou sugestões de melhorias, entre em contato através dos canais oficiais da plataforma Manus.

---

**Documentação gerada por:** Manus AI  
**Última atualização:** Novembro de 2025
