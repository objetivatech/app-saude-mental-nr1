# Saúde Corporativa - MVP

![Status](https://img.shields.io/badge/status-MVP-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![NR1](https://img.shields.io/badge/NR1-compliant-success)

Plataforma web para monitoramento e promoção da saúde mental no ambiente de trabalho, alinhada à **Norma Regulamentadora NR1**.

**Projeto desenvolvido em parceria com Reginaldo Fernando, Analista Corporal.**

---

## 📋 Sobre o Projeto

O **Saúde Corporativa** é um sistema completo que permite às empresas monitorar o bem-estar psicológico de seus colaboradores através de questionários periódicos, dashboards analíticos e acesso a profissionais da saúde mental qualificados.

### Principais Funcionalidades

- ✅ **Autenticação Multi-Perfil**: Empresa, Funcionário, Profissional da Saúde e Administrador
- ✅ **Questionários de Bem-Estar**: Avaliação semanal de humor, estresse, cansaço e satisfação
- ✅ **Dashboards Analíticos**: Visualização de estatísticas consolidadas e tendências
- ✅ **Gestão de Funcionários**: Cadastro e vinculação de colaboradores às empresas
- ✅ **Diretório de Profissionais**: Listagem de psicólogos e terapeutas disponíveis
- ✅ **Painel Administrativo**: Aprovação de cadastros e gerenciamento de conteúdos educativos
- ✅ **Conformidade NR1**: Documentação e rastreabilidade para auditorias

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI acessíveis
- **Wouter** - Roteamento leve

### Backend
- **Express.js 4** - Servidor HTTP
- **tRPC 11** - API type-safe
- **Drizzle ORM** - ORM TypeScript-first
- **Manus OAuth** - Autenticação integrada

### Banco de Dados
- **MySQL/TiDB** - Banco de dados relacional
- **Cloudflare D1** (preparado para deploy)

### Infraestrutura
- **Cloudflare Pages** - Hospedagem
- **Cloudflare R2** - Armazenamento de arquivos

---

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 22+
- pnpm (gerenciador de pacotes)
- Acesso ao banco de dados MySQL/TiDB

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/objetivatech/app-saude-mental-nr1.git
cd app-saude-mental-nr1

# Instalar dependências
pnpm install

# Aplicar migrações do banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

---

## 🗂️ Estrutura do Projeto

```
app-saude-mental-nr1/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   └── lib/           # Utilitários
├── server/                 # Backend Express + tRPC
│   ├── db.ts              # Operações de banco de dados
│   └── routers.ts         # Definição de rotas tRPC
├── drizzle/               # Schema e migrações
│   └── schema.ts          # Definição de tabelas
├── DOCUMENTACAO_TECNICA.md      # Documentação técnica completa
├── DOCUMENTACAO_OPERACIONAL.md  # Guia de uso por perfil
└── README.md              # Este arquivo
```

---

## 👥 Perfis de Usuário

### 🏢 Empresa
- Cadastro de empresa com CNPJ
- Visualização de dashboards com estatísticas de bem-estar
- Listagem de funcionários cadastrados
- Acesso a relatórios consolidados

### 👤 Funcionário
- Cadastro vinculado a uma empresa
- Resposta a questionários semanais de bem-estar
- Visualização de histórico pessoal de respostas
- Acesso a profissionais da saúde mental

### 🩺 Profissional da Saúde
- Cadastro com validação de registro profissional
- Listagem pública após aprovação
- Recebimento de contatos de funcionários e empresas

### 🔐 Administrador
- Aprovação de cadastros de empresas e profissionais
- Gerenciamento de conteúdos educativos
- Visão consolidada de toda a plataforma

---

## 📊 Banco de Dados

O sistema utiliza **7 tabelas principais**:

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários autenticados (todos os perfis) |
| `companies` | Empresas cadastradas |
| `employees` | Funcionários vinculados a empresas |
| `healthProfessionals` | Profissionais da saúde mental |
| `surveyResponses` | Respostas de questionários de bem-estar |
| `educationalContents` | Materiais educativos sobre saúde mental |
| `plans` | Planos de assinatura para empresas |

Veja a documentação técnica completa em [`DOCUMENTACAO_TECNICA.md`](./DOCUMENTACAO_TECNICA.md).

---

## 🔒 Segurança e Autenticação

- **Manus OAuth**: Autenticação segura com suporte a múltiplos provedores
- **JWT Sessions**: Sessões assinadas com tokens seguros
- **RBAC**: Controle de acesso baseado em perfis (Role-Based Access Control)
- **Procedures Protegidas**: Middleware de validação em todas as rotas sensíveis

---

## 📖 Documentação

- **[Documentação Técnica](./DOCUMENTACAO_TECNICA.md)**: Arquitetura, banco de dados, APIs e deploy
- **[Documentação Operacional](./DOCUMENTACAO_OPERACIONAL.md)**: Fluxos de uso por perfil de usuário

---

## 🧪 Testes

```bash
# Executar testes (quando implementados)
pnpm test

# Verificar tipos TypeScript
pnpm type-check

# Lint do código
pnpm lint
```

---

## 🚀 Deploy no Cloudflare

### Pré-requisitos
- Conta no Cloudflare
- Wrangler CLI instalado

### Passos

1. **Criar banco de dados D1**
```bash
wrangler d1 create saude-corporativa-db
```

2. **Criar bucket R2**
```bash
wrangler r2 bucket create saude-corporativa-files
```

3. **Configurar wrangler.toml**
```toml
name = "saude-corporativa"
compatibility_date = "2025-01-01"

[[d1_databases]]
binding = "DB"
database_name = "saude-corporativa-db"
database_id = "<SEU_DATABASE_ID>"

[[r2_buckets]]
binding = "FILES"
bucket_name = "saude-corporativa-files"
```

4. **Deploy**
```bash
pnpm build
wrangler pages deploy dist
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📞 Suporte

Para questões técnicas, dúvidas ou sugestões:

- **Issues**: Abra uma issue no GitHub
- **E-mail**: contato@objetivatech.com.br
- **Documentação**: Consulte os arquivos de documentação incluídos

---

## 🎯 Roadmap

### Próximas Funcionalidades

- [ ] Notificações automáticas para empresas
- [ ] Exportação de relatórios em PDF
- [ ] Agendamento de consultas com profissionais
- [ ] Sistema de gamificação para engajamento
- [ ] Integração com wearables
- [ ] Dashboard analítico avançado com gráficos
- [ ] Sistema de mensagens interno
- [ ] Recomendações personalizadas de conteúdo

---

## 👏 Agradecimentos

- **Reginaldo Fernando** - Analista Corporal e parceiro do projeto
- Equipe Manus pela infraestrutura e ferramentas
- Comunidade open-source pelas bibliotecas utilizadas
- Profissionais da saúde mental pela consultoria

---

**Desenvolvido com ❤️ por Manus AI em parceria com Reginaldo Fernando**

**Última atualização:** Novembro de 2025
