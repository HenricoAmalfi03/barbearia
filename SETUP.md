# 📦 Guia Completo de Instalação - Sistema de Agendamento para Barbearia

Este guia vai te ensinar passo a passo como instalar e configurar o projeto do GitHub até fazer o deploy no Vercel com Supabase.

---

## 🤔 Entendendo a Diferença: API REST vs PostgreSQL Direto

**Você pode estar acostumado com:**
- `VITE_SUPABASE_URL` = URL da API REST do Supabase
- `VITE_SUPABASE_ANON_KEY` = Chave pública para usar a API REST

**Mas este projeto é diferente!** 

Este projeto usa **Drizzle ORM** que acessa o **PostgreSQL diretamente** (não através da API REST). Por isso precisamos de uma **terceira variável**:

- `DATABASE_URL` = Connection String do PostgreSQL (formato: `postgresql://usuario:senha@host:porta/database`)

**Por que precisamos disso?**
- Para queries complexas e performance melhor
- Para usar ORM (Drizzle) ao invés de fazer requisições REST
- A `DATABASE_URL` é uma connection string padrão PostgreSQL, não tem nada a ver com a URL da API REST

---

## 📋 Pré-requisitos

- [ ] Conta no [GitHub](https://github.com)
- [ ] Conta no [Supabase](https://supabase.com)
- [ ] Conta no [Vercel](https://vercel.com)
- [ ] Node.js 18+ instalado
- [ ] Git instalado

---

## 🚀 Passo 1: Clonar o Projeto do GitHub

```bash
# Clone o repositório
git clone [URL_DO_SEU_REPOSITORIO]
cd [NOME_DA_PASTA]

# Instale as dependências
npm install
```

---

## 🗄️ Passo 2: Criar e Configurar o Projeto no Supabase

### 2.1 Criar Novo Projeto

1. Acesse: https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `barbershop-booking` (ou outro nome)
   - **Database Password**: Crie uma senha forte e **ANOTE EM ALGUM LUGAR SEGURO**
   - **Region**: Escolha a mais próxima do Brasil (ex: South America - São Paulo)
4. Clique em **"Create new project"**
5. Aguarde alguns minutos enquanto o projeto é criado

### 2.2 Executar o Script SQL

1. No painel do Supabase, vá em **SQL Editor** (ícone no menu lateral)
2. Clique em **"New query"**
3. Copie **TODO** o conteúdo do arquivo `setup-database.sql` deste repositório
4. Cole no editor SQL
5. Clique em **"Run"** (ou pressione `Ctrl + Enter`)
6. ✅ Pronto! As tabelas foram criadas

### 2.3 Coletar as Credenciais do Supabase

Agora vamos coletar 3 informações importantes:

#### 📍 **1. VITE_SUPABASE_URL** (URL da API REST)

1. No painel do Supabase, vá em **Settings** > **API**
2. Na seção **"Project URL"**, copie a URL
3. Exemplo: `https://drbqmjmsscqovtsqmszf.supabase.co`

#### 🔑 **2. VITE_SUPABASE_ANON_KEY** (Chave Pública)

1. Ainda em **Settings** > **API**
2. Na seção **"Project API keys"**, copie a chave **`anon public`**
3. Exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (um texto bem longo)

#### 🐘 **3. DATABASE_URL** (Connection String do PostgreSQL) ⭐ NOVO PARA VOCÊ!

**Esta é a parte diferente!** Vamos pegar a connection string do PostgreSQL:

1. No painel do Supabase, vá em **Settings** > **Database**
2. Role até a seção **"Connection string"**
3. Selecione a aba **"URI"** (não "Session mode" ou outros)
4. Você verá algo assim:
   ```
   postgresql://postgres.drbqmjmsscqovtsqmszf:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```
5. **IMPORTANTE**: Copie essa string e substitua `[YOUR-PASSWORD]` pela senha que você criou no passo 2.1
6. Exemplo final:
   ```
   postgresql://postgres.drbqmjmsscqovtsqmszf:MinhaSenh@123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```

**⚠️ ATENÇÃO**: Guarde essa string com cuidado! Ela contém sua senha do banco.

---

## 🎨 Passo 3: Configurar Storage (Para Upload de Imagens)

### 3.1 Criar o Bucket

1. No painel do Supabase, vá em **Storage** (ícone no menu lateral)
2. Clique em **"New bucket"**
3. Preencha:
   - **Name**: `barbershop`
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO** (muito importante!)
4. Clique em **"Create bucket"**

### 3.2 Configurar Permissões (Políticas RLS)

1. Clique no bucket `barbershop` que você acabou de criar
2. Vá na aba **"Policies"**
3. Clique em **"New policy"** para cada uma dessas 3 políticas:

**Política 1: Leitura Pública**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'barbershop' );
```

**Política 2: Upload de Imagens**
```sql
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'barbershop' );
```

**Política 3: Atualizar Imagens**
```sql
CREATE POLICY "Anyone can update images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'barbershop' );
```

---

## 👨‍💼 Passo 4: Criar o Primeiro Administrador

**IMPORTANTE**: Administradores são diferentes de barbeiros!

- **Administradores**: Login criado no Supabase Auth (você)
- **Barbeiros**: Criados pelo admin dentro da aplicação

### Como criar o administrador:

1. No painel do Supabase, vá em **Authentication** > **Users**
2. Clique em **"Add user"** > **"Create new user"**
3. Preencha:
   - **Email**: seu email (ex: `admin@barbearia.com`)
   - **Password**: sua senha (mínimo 6 caracteres)
   - **Auto Confirm User**: ✅ **MARQUE ESTA OPÇÃO**
4. Clique em **"Create user"**

Pronto! Agora você pode fazer login como administrador na aplicação!

---

## 💻 Passo 5: Configurar Localmente (Desenvolvimento)

### 5.1 Criar Arquivo .env

Na raiz do projeto, crie um arquivo `.env` e cole isto (substituindo pelos seus valores):

```bash
# URL da API REST do Supabase (Settings > API > Project URL)
VITE_SUPABASE_URL=https://drbqmjmsscqovtsqmszf.supabase.co

# Chave pública do Supabase (Settings > API > anon public)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyYnFtam1zc2Nxb3Z0c3Ftc3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjcyNDUsImV4cCI6MjA3ODEwMzI0NX0.RLfT9b-5y2Q_yQD1oeq0y73seNZxz1WRFqJe8zm1n_A

# Connection String do PostgreSQL (Settings > Database > Connection string > URI)
# SUBSTITUA [YOUR-PASSWORD] pela senha que você criou!
DATABASE_URL=postgresql://postgres.drbqmjmsscqovtsqmszf:SuaSenhaAqui@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

### 5.2 Testar Localmente

```bash
# Rodar o projeto
npm run dev

# Abrir no navegador
# http://localhost:5000
```

Se tudo estiver certo, a aplicação vai abrir e você pode fazer login!

---

## 🚀 Passo 6: Deploy no Vercel

### 6.1 Conectar o Repositório

1. Acesse: https://vercel.com/dashboard
2. Clique em **"Add New..."** > **"Project"**
3. Importe seu repositório do GitHub
4. Clique em **"Import"**

### 6.2 Configurar Variáveis de Ambiente

**ANTES DE FAZER DEPLOY**, configure as variáveis:

1. Na tela de configuração do projeto, vá em **"Environment Variables"**
2. Adicione as 3 variáveis (uma por vez):

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://drbqmjmsscqovtsqmszf.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (sua chave completa) |
| `DATABASE_URL` | `postgresql://postgres.drbqmjmsscqovtsqmszf:SuaSenha@aws...` (sua connection string completa) |

**⚠️ CUIDADO**: Ao colar a `DATABASE_URL`, certifique-se que a senha está correta!

### 6.3 Fazer o Deploy

1. Clique em **"Deploy"**
2. Aguarde alguns minutos
3. ✅ Pronto! Seu site está no ar!

---

## 📱 Passo 7: Usar a Aplicação

### Como Administrador

1. Acesse: `https://seu-projeto.vercel.app/admin`
2. Faça login com o email/senha que você criou no Supabase Auth
3. No painel admin, você pode:
   - Cadastrar barbeiros
   - Gerenciar serviços e preços
   - Ver agendamentos
   - Configurar horários de funcionamento
   - Personalizar a barbearia

### Como Barbeiro

1. O admin cria o login do barbeiro dentro da aplicação
2. Barbeiro acessa: `https://seu-projeto.vercel.app/barber`
3. Faz login com email/senha criado pelo admin
4. Pode ver e gerenciar seus próprios agendamentos

### Como Cliente

1. Acessa: `https://seu-projeto.vercel.app`
2. Escolhe barbeiro, serviço, data e horário
3. Preenche nome e WhatsApp
4. Faz o agendamento!

---

## 🔧 Troubleshooting (Problemas Comuns)

### ❌ "Database connection failed"

**Causa**: DATABASE_URL incorreta

**Solução**:
1. Verifique se copiou a string correta (Settings > Database > URI)
2. Certifique-se que substituiu `[YOUR-PASSWORD]` pela senha real
3. Teste a senha fazendo login no Supabase Dashboard

### ❌ "Login de admin não funciona"

**Causa**: Usuário não criado ou não confirmado

**Solução**:
1. Vá em Authentication > Users no Supabase
2. Verifique se o usuário existe
3. Certifique-se que marcou "Auto Confirm User" ao criar
4. Se não marcou, delete e crie novamente

### ❌ "Upload de imagem falhou"

**Causa**: Bucket não configurado ou políticas erradas

**Solução**:
1. Verifique se o bucket `barbershop` existe
2. Certifique-se que é público (Public bucket = ✅)
3. Confirme que as 3 políticas foram criadas

### ❌ "VITE_SUPABASE_URL is not defined"

**Causa**: Variáveis de ambiente não configuradas

**Solução**:
1. **Local**: Crie o arquivo `.env` na raiz do projeto
2. **Vercel**: Vá em Settings > Environment Variables e adicione as 3 variáveis
3. Faça um novo deploy após adicionar as variáveis

---

## 📚 Estrutura do Projeto

```
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/           # Páginas da aplicação
│   │   └── lib/             # Configuração Supabase (client)
├── server/                    # Backend (Express)
│   ├── lib/                 # Configuração Supabase (server)
│   ├── db.ts                # Configuração banco de dados
│   ├── routes.ts            # Rotas da API
│   └── index.ts             # Servidor Express
├── shared/                    # Código compartilhado
│   └── schema.ts            # Schema do banco (Drizzle)
├── setup-database.sql         # Script SQL inicial
├── package.json              # Dependências do projeto
└── .env                      # Variáveis de ambiente (NÃO COMITE!)
```

---

## 🔐 Segurança

**⚠️ NUNCA comite o arquivo `.env` para o GitHub!**

O arquivo `.gitignore` já está configurado para ignorar o `.env`, mas sempre verifique:

```bash
# Verificar se .env está no .gitignore
cat .gitignore | grep .env
```

Se não estiver, adicione:
```bash
echo ".env" >> .gitignore
```

---

## 📞 Suporte

Se tiver dúvidas:
1. Reveja este guia passo a passo
2. Verifique a seção "Troubleshooting"
3. Confira os logs do Vercel (em caso de erro no deploy)

---

## ✅ Checklist Final

Antes de considerar a instalação completa, verifique:

- [ ] Projeto clonado do GitHub
- [ ] Dependências instaladas (`npm install`)
- [ ] Projeto criado no Supabase
- [ ] Script SQL executado (tabelas criadas)
- [ ] As 3 credenciais coletadas (URL, ANON_KEY, DATABASE_URL)
- [ ] Bucket `barbershop` criado e público
- [ ] 3 políticas de storage configuradas
- [ ] Usuário administrador criado no Supabase Auth
- [ ] Arquivo `.env` criado localmente (com as 3 variáveis)
- [ ] Projeto testado localmente (`npm run dev`)
- [ ] Repositório conectado no Vercel
- [ ] 3 variáveis configuradas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] Login de admin funcionando
- [ ] Upload de imagens funcionando

---

## 🎉 Parabéns!

Se chegou até aqui, seu sistema de agendamento está funcionando perfeitamente! 

Agora você pode:
- Personalizar as cores e o logo da barbearia
- Cadastrar seus barbeiros
- Configurar os serviços e preços
- Começar a receber agendamentos!

Boa sorte com seu negócio! 💈✂️