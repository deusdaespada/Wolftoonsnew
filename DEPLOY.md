# Deploy — WOLFTOON NEW

## Arquitetura de produção

```
GitHub → Vercel (Frontend)
              ↓
         Supabase (Auth + PostgreSQL + Storage)
```

## 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. **SQL Editor** — execute na ordem:
   - `supabase/migrations/20241108000001_initial_schema.sql`
   - `supabase/migrations/20241108000002_reader_helpers.sql`
   - (opcional, só dev) `supabase/seed_dev.sql`
3. **Authentication → Providers**
   - Email: habilitado
   - Google / Discord: configure Client ID e Secret
4. **Authentication → URL Configuration**
   - Site URL: `https://seu-dominio.vercel.app`
   - Redirect URLs: `https://seu-dominio.vercel.app/**` e `http://localhost:5173/**`
5. **Storage** — crie buckets públicos:
   - `covers`
   - `chapter-pages`
   - `avatars`
6. Copie **Project URL** e **anon public key** (Settings → API)

## 2. Variáveis de ambiente

Local:

```bash
cp .env.example .env
# Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
```

Vercel (Project → Settings → Environment Variables):

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | URL do projeto |
| `VITE_SUPABASE_ANON_KEY` | Anon key |

## 3. Vercel

1. Conecte o repositório GitHub
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy

O arquivo `vercel.json` já configura SPA rewrites e headers de segurança.

## 4. Pós-deploy

1. Cadastre-se no site
2. No SQL Editor, promova seu usuário a `superadmin` (ver `SECURITY.md`)
3. Acesse `/admin` e cadastre a primeira obra
4. Teste leitura, biblioteca, comentários e ranking

## 5. Domínio customizado

1. Vercel → Domains → adicione o domínio
2. Atualize Site URL e Redirect URLs no Supabase Auth
3. (Opcional) SSL é automático na Vercel

## Scripts locais

```bash
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # TypeScript
npm run build        # build de produção
npm run preview      # preview do build
```

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Tela em branco após deploy | Verifique variáveis `VITE_*` na Vercel e redeploy |
| Login OAuth falha | Redirect URL deve incluir o domínio exato |
| Upload de capa falha | Crie o bucket `covers` e policies no Storage |
| Admin redireciona para home | Usuário sem role admin/moderator/uploader |
| Comentários/obras vazios | Rode as migrations; confira RLS e `is_published` |
