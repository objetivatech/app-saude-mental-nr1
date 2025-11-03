# Guia de Autenticação de Administrador

Este guia explica como criar e gerenciar contas de administrador que não dependem do OAuth do Manus.

---

## 🔐 Sistema de Autenticação Dual

O sistema Saúde Corporativa agora suporta **dois métodos de autenticação**:

1. **OAuth do Manus** - Para usuários regulares (empresas, funcionários, profissionais)
2. **Email/Senha** - Para administradores do sistema

---

## 👤 Criar Primeiro Administrador

### Passo 1: Configurar Chave Secreta

Antes de criar o primeiro administrador, você precisa configurar uma chave secreta no ambiente:

**Variável de ambiente:**
```
ADMIN_REGISTRATION_SECRET=sua-chave-secreta-aqui
```

**Como gerar uma chave segura:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Onde configurar:**
- **Desenvolvimento local**: Arquivo `.env` na raiz do projeto
- **Produção (Manus)**: Painel de configurações > Environment variables

### Passo 2: Acessar Página de Registro

Acesse a URL:
```
https://seu-dominio.com/admin/register
```

### Passo 3: Preencher Formulário

- **Nome Completo**: Nome do administrador
- **Email**: Email que será usado para login
- **Senha**: Mínimo 8 caracteres
- **Confirmar Senha**: Repita a senha
- **Chave Secreta**: A chave configurada no Passo 1

### Passo 4: Fazer Login

Após criar a conta, você será redirecionado para:
```
https://seu-dominio.com/admin/login
```

Entre com o email e senha cadastrados.

---

## 🔑 Login de Administrador

### URL de Login
```
https://seu-dominio.com/admin/login
```

### Credenciais
- **Email**: O email cadastrado
- **Senha**: A senha definida no registro

### Após Login
Você será redirecionado automaticamente para o dashboard administrativo em:
```
/admin/dashboard
```

---

## 🛡️ Segurança

### Hash de Senhas
As senhas são protegidas usando **scrypt** (algoritmo nativo do Node.js):
- Salt aleatório de 16 bytes
- Hash de 64 bytes
- Comparação timing-safe para prevenir ataques de timing

### Sessões
- Tokens JWT assinados
- Mesma infraestrutura de sessão do OAuth
- Cookies HTTP-only e Secure

### Proteção contra Registro Não Autorizado
- Chave secreta obrigatória (`ADMIN_REGISTRATION_SECRET`)
- Apenas quem tem acesso às variáveis de ambiente pode criar admins
- Recomendado: Após criar o primeiro admin, remova a chave ou mude-a

---

## 📋 Gerenciar Administradores

### Criar Novos Administradores

**Opção 1: Via Interface (Recomendado)**
1. Faça login como admin
2. Acesse `/admin/users`
3. Use a função de criar usuário
4. Defina `role = admin` e `userType = admin`

**Opção 2: Via Banco de Dados**
Execute no console do banco:
```sql
INSERT INTO users (email, passwordHash, name, role, userType, loginMethod, openId, createdAt, updatedAt, lastSignedIn)
VALUES (
  'novo-admin@exemplo.com',
  'HASH_GERADO_PELO_SISTEMA',
  'Nome do Admin',
  'admin',
  'admin',
  'email',
  'admin-' || strftime('%s', 'now') || '-' || hex(randomblob(4)),
  strftime('%s', 'now') * 1000,
  strftime('%s', 'now') * 1000,
  strftime('%s', 'now') * 1000
);
```

**Nota:** Para gerar o hash da senha, use a função `hashPassword()` do sistema.

### Remover Administradores

**Via Interface:**
1. Acesse `/admin/users`
2. Encontre o usuário
3. Clique em "Excluir"

**Via Banco de Dados:**
```sql
DELETE FROM users WHERE email = 'admin@exemplo.com';
```

### Resetar Senha

Atualmente não há interface para reset de senha. Para resetar:

1. Gere um novo hash de senha:
```javascript
const { hashPassword } = require('./server/auth');
const newHash = hashPassword('nova-senha-aqui');
console.log(newHash);
```

2. Atualize no banco:
```sql
UPDATE users 
SET passwordHash = 'NOVO_HASH_AQUI'
WHERE email = 'admin@exemplo.com';
```

---

## 🔧 Troubleshooting

### "Invalid secret key"
- Verifique se `ADMIN_REGISTRATION_SECRET` está configurado
- Certifique-se de estar usando a chave correta
- Reinicie o servidor após alterar variáveis de ambiente

### "Email already registered"
- O email já existe no sistema
- Use outro email ou faça login com as credenciais existentes

### "Invalid credentials" no login
- Verifique se email e senha estão corretos
- Senhas são case-sensitive
- Certifique-se de que a conta foi criada com sucesso

### Não consigo acessar /admin/dashboard
- Verifique se fez login corretamente
- Confirme que o usuário tem `role = 'admin'`
- Limpe cookies e faça login novamente

---

## 🚀 Boas Práticas

1. **Use senhas fortes**: Mínimo 12 caracteres, com letras, números e símbolos
2. **Guarde a chave secreta**: Armazene `ADMIN_REGISTRATION_SECRET` em local seguro
3. **Limite administradores**: Crie apenas os admins necessários
4. **Rotação de chaves**: Mude a chave secreta periodicamente
5. **Auditoria**: Monitore acessos ao painel administrativo
6. **Backup**: Mantenha backup das credenciais de pelo menos um admin

---

## 📝 Notas Técnicas

### Arquivos Modificados
- `drizzle/schema.ts` - Adicionado campo `passwordHash` à tabela `users`
- `server/auth.ts` - Funções de hash e verificação de senha
- `server/db.ts` - Funções `createAdminUser()` e `getUserByEmail()`
- `server/routers.ts` - Rotas `registerAdmin` e `loginAdmin`
- `client/src/pages/admin/AdminLogin.tsx` - Interface de login
- `client/src/pages/admin/AdminRegister.tsx` - Interface de registro

### Compatibilidade
- ✅ Funciona em paralelo com OAuth do Manus
- ✅ Não afeta usuários existentes
- ✅ Admins podem ser criados por ambos os métodos
- ✅ Sessões compartilham a mesma infraestrutura JWT

---

## ❓ FAQ

**P: Posso ter admins via OAuth e via email/senha ao mesmo tempo?**
R: Sim! Os dois sistemas coexistem perfeitamente.

**P: Preciso do Manus para criar admins?**
R: Não. Com email/senha, você tem total independência.

**P: Como migrar um admin OAuth para email/senha?**
R: Adicione um `passwordHash` ao usuário existente no banco de dados.

**P: É seguro?**
R: Sim. Usamos scrypt (padrão da indústria) e as mesmas práticas de segurança do OAuth.

**P: Posso desabilitar o registro de novos admins?**
R: Sim. Remova ou altere `ADMIN_REGISTRATION_SECRET` após criar os admins necessários.

---

**Última atualização:** Novembro 2025
