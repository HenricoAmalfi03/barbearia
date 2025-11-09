# Configuração para Deploy no Vercel

## 📋 Passo a Passo

### 1️⃣ Configurar Variáveis de Ambiente no Vercel

Acesse: **Vercel Dashboard > Seu Projeto > Settings > Environment Variables**

Adicione as seguintes variáveis:

```bash
# URL do projeto Supabase
VITE_SUPABASE_URL=https://drbqmjmsscqovtsqmszf.supabase.co

# Chave pública (anon key) do Supabase
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyYnFtam1zc2Nxb3Z0c3Ftc3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjcyNDUsImV4cCI6MjA3ODEwMzI0NX0.RLfT9b-5y2Q_yQD1oeq0y73seNZxz1WRFqJe8zm1n_A

# Connection String do PostgreSQL (encontre em Supabase > Settings > Database > Connection String > URI)
# IMPORTANTE: Substitua [YOUR-PASSWORD] pela sua senha real do banco
DATABASE_URL=postgresql://postgres.drbqmjmsscqovtsqmszf:[SUA-SENHA-AQUI]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

**⚠️ IMPORTANTE**: Ao adicionar `DATABASE_URL`, você precisa substituir `[SUA-SENHA-AQUI]` pela senha real do seu banco de dados Supabase.

### 2️⃣ Onde encontrar a senha do banco?

A senha foi definida quando você criou o projeto Supabase. Se esqueceu:

1. Acesse: https://supabase.com/dashboard/project/drbqmjmsscqovtsqmszf/settings/database
2. Clique em **"Reset Database Password"**
3. Defina uma nova senha
4. Use essa senha na `DATABASE_URL`

### 3️⃣ Configurar Storage no Supabase (Para upload de imagens)

1. Acesse: https://supabase.com/dashboard/project/drbqmjmsscqovtsqmszf/storage/buckets
2. Clique em **"New bucket"**
3. Nome do bucket: `barbershop`
4. **Public bucket**: ✅ Marque como público
5. Clique em **"Create bucket"**

### 4️⃣ Configurar Políticas de Storage (RLS)

Após criar o bucket, configure as políticas:

1. Clique no bucket `barbershop`
2. Vá em **"Policies"**
3. Adicione as seguintes políticas:

**Política de SELECT (Leitura pública):**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'barbershop' );
```

**Política de INSERT (Upload de imagens):**
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'barbershop' );
```

**Política de UPDATE:**
```sql
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'barbershop' );
```

### 5️⃣ Deploy no Vercel

Agora pode fazer o deploy normalmente:

```bash
git add .
git commit -m "Configurado para Supabase"
git push origin main
```

O Vercel vai fazer o deploy automaticamente se estiver conectado ao repositório.

## 🔐 Autenticação de Administrador

**IMPORTANTE**: O sistema usa Supabase Auth para autenticação do administrador.

### Como criar o primeiro usuário administrador:

1. Acesse: https://supabase.com/dashboard/project/drbqmjmsscqovtsqmszf/auth/users
2. Clique em **"Add user"** > **"Create new user"**
3. Preencha:
   - **Email**: seu email de admin
   - **Password**: sua senha (mínimo 6 caracteres)
   - **Auto Confirm User**: ✅ Marque esta opção
4. Clique em **"Create user"**

Agora você pode fazer login na aplicação com esse email/senha na página de administrador!

## 📝 Barbeiros vs Administradores

- **Administradores**: São usuários criados em **Supabase Auth** (Authentication > Users)
- **Barbeiros**: São criados pelo administrador dentro da aplicação e ficam salvos na tabela `barbers`

## ✅ Verificação Final

Antes de fazer o deploy, verifique:

- [ ] Tabelas criadas no Supabase usando o arquivo `setup-database.sql`
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Bucket `barbershop` criado e público
- [ ] Políticas de Storage configuradas
- [ ] Usuário administrador criado no Supabase Auth
- [ ] DATABASE_URL com a senha correta

## 🐛 Problemas Comuns

### "Error: listen EADDRINUSE"
- Reinicie o workflow/servidor

### "Database connection failed"
- Verifique se a senha na `DATABASE_URL` está correta
- Teste a conexão no Supabase Dashboard

### "Storage upload failed"
- Verifique se o bucket `barbershop` existe
- Confirme se o bucket está marcado como público
- Verifique as políticas de storage

### "Login de administrador não funciona"
- Verifique se criou o usuário no Supabase Auth (não na tabela barbers)
- Confirme que marcou "Auto Confirm User"

## 📚 Recursos Úteis

- [Supabase Dashboard](https://supabase.com/dashboard/project/drbqmjmsscqovtsqmszf)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Documentação Drizzle ORM](https://orm.drizzle.team/docs/overview)