# 🔧 Corrigir Configuração do Supabase

## 🚨 PROBLEMA ENCONTRADO

Você está usando **2 projetos diferentes do Supabase**:

- **Projeto A**: `drbqmjmsscqovtsqmszf` (nas variáveis VITE_SUPABASE_URL e ANON_KEY)
- **Projeto B**: `zdteeaiznhxmbmftiunw` (na DATABASE_URL)

**TODOS** precisam estar no **MESMO** projeto!

---

## ✅ SOLUÇÃO: Escolher UM projeto e usar em TODAS as 3 variáveis

### Qual projeto você quer usar?

Você precisa escolher UM dos dois projetos. Recomendo usar o **Projeto B** (`zdteeaiznhxmbmftiunw`) porque é onde você já configurou a DATABASE_URL.

---

## 📝 Passo a Passo para Corrigir

### 1️⃣ Acessar o Projeto B no Supabase

Acesse: https://supabase.com/dashboard/project/zdteeaiznhxmbmftiunw

### 2️⃣ Coletar as 3 Credenciais do MESMO Projeto

#### A. VITE_SUPABASE_URL

1. No painel, vá em **Settings** > **API**
2. Copie o **Project URL**
3. Deve ser algo como: `https://zdteeaiznhxmbmftiunw.supabase.co`

#### B. VITE_SUPABASE_ANON_KEY

1. Ainda em **Settings** > **API**
2. Na seção **Project API keys**, copie a chave **`anon public`**
3. É um texto bem longo começando com `eyJ...`

#### C. DATABASE_URL

1. Vá em **Settings** > **Database**
2. Role até **Connection string**
3. Selecione a aba **URI**
4. Copie a string e **substitua `[YOUR-PASSWORD]` pela sua senha real**
5. Deve ficar assim: `postgresql://postgres:SuaSenha@db.zdteeaiznhxmbmftiunw.supabase.co:5432/postgres`

---

## 🔐 3️⃣ Atualizar as Variáveis

### No Replit (Desenvolvimento)

1. Clique na aba **"Secrets"** (ícone de chave 🔑 no menu lateral esquerdo)
2. Atualize/Adicione as 3 variáveis com os valores do **Projeto B**:

```
VITE_SUPABASE_URL=https://zdteeaiznhxmbmftiunw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (sua chave anon do projeto B)
DATABASE_URL=postgresql://postgres:Soldadobom2@db.zdteeaiznhxmbmftiunw.supabase.co:5432/postgres
```

### No Vercel (Produção)

1. Acesse: https://vercel.com/dashboard
2. Vá no seu projeto > **Settings** > **Environment Variables**
3. **DELETE** as variáveis antigas
4. **ADICIONE** as 3 novas variáveis com os valores do **Projeto B**:

```
VITE_SUPABASE_URL=https://zdteeaiznhxmbmftiunw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (sua chave anon do projeto B)
DATABASE_URL=postgresql://postgres:Soldadobom2@db.zdteeaiznhxmbmftiunw.supabase.co:5432/postgres
```

5. Clique em **"Redeploy"** para aplicar as mudanças

---

## 🗄️ 4️⃣ Verificar o Banco de Dados

### Verificar se as tabelas existem no Projeto B:

1. Acesse: https://supabase.com/dashboard/project/zdteeaiznhxmbmftiunw/editor
2. Você deve ver as tabelas no menu lateral esquerdo:
   - `barbershop_settings`
   - `barbers`
   - `services`
   - `appointments`
   - `operating_hours`

### Se NÃO ver as tabelas:

1. Vá em: https://supabase.com/dashboard/project/zdteeaiznhxmbmftiunw/sql/new
2. Abra o arquivo `setup-database.sql` deste projeto
3. Copie **TODO** o conteúdo
4. Cole no SQL Editor
5. Clique em **"Run"**

---

## 👨‍💼 5️⃣ Criar Usuário Administrador (no Projeto B)

1. Acesse: https://supabase.com/dashboard/project/zdteeaiznhxmbmftiunw/auth/users
2. Clique em **"Add user"** > **"Create new user"**
3. Preencha:
   - **Email**: seu-email@gmail.com
   - **Password**: sua-senha-forte
4. ✅ **MARQUE**: **"Auto Confirm User"**
5. Clique em **"Create user"**

---

## 🎨 6️⃣ Criar Bucket de Storage (no Projeto B)

### Criar o Bucket

1. Acesse: https://supabase.com/dashboard/project/zdteeaiznhxmbmftiunw/storage/buckets
2. Clique em **"New bucket"**
3. Preencha:
   - **Name**: `barbershop`
   - **Public bucket**: ✅ MARCAR
4. Clique em **"Create bucket"**

### Adicionar Políticas

1. Clique no bucket `barbershop`
2. Vá na aba **"Policies"**
3. Adicione estas 3 políticas (uma por uma):

**Política 1:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'barbershop' );
```

**Política 2:**
```sql
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'barbershop' );
```

**Política 3:**
```sql
CREATE POLICY "Anyone can update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'barbershop' );
```

---

## 🧪 7️⃣ Testar

### Testar Localmente (Replit):

1. Reinicie o workflow (o sistema vai reiniciar automaticamente)
2. Acesse: http://localhost:5000/api/diagnostic
3. Deve mostrar:
   ```json
   {
     "database": {
       "connected": true
     },
     "tables": {
       "barbershop_settings": true,
       "barbers": true,
       ...
     }
   }
   ```

### Testar Login:

1. Abra a aplicação
2. Clique em "Entrar como Admin"
3. Use o email/senha que você criou no Projeto B
4. ✅ Deve funcionar!

### Testar no Vercel:

1. Faça um novo deploy (ou aguarde o automático do GitHub)
2. Acesse seu site: `https://seu-projeto.vercel.app/admin`
3. Faça login com o mesmo email/senha
4. ✅ Deve funcionar!

---

## ✅ Checklist Final

Antes de testar, confirme:

- [ ] Escolhi usar o Projeto B (`zdteeaiznhxmbmftiunw`)
- [ ] Copiei as 3 credenciais do MESMO projeto
- [ ] Atualizei os Secrets no Replit
- [ ] Atualizei as Environment Variables no Vercel
- [ ] Fiz Redeploy no Vercel
- [ ] As tabelas existem no Projeto B
- [ ] Criei o usuário admin no Auth do Projeto B
- [ ] Criei o bucket `barbershop` no Projeto B
- [ ] Adicionei as 3 políticas de storage
- [ ] Testei localmente (diagnóstico + login)
- [ ] Testei no Vercel

---

## 🎯 Resumo Ultra Rápido

**O problema**: Você misturou 2 projetos diferentes do Supabase

**A solução**: 
1. Escolha UM projeto (recomendo `zdteeaiznhxmbmftiunw`)
2. Pegue as 3 credenciais desse MESMO projeto
3. Atualize no Replit Secrets
4. Atualize no Vercel Environment Variables
5. Verifique tabelas/usuário/bucket nesse projeto
6. Teste!

---

## 📞 Como Verificar se Deu Certo

Execute este teste rápido:

```bash
# No terminal do Replit
curl http://localhost:5000/api/diagnostic
```

Se aparecer `"connected": true` e todas as tabelas como `true`, **FUNCIONOU**! 🎉