# WOLFTOON NEW

Plataforma profissional de leitura digital de **Manhwas, Manhuas, Mangás, Webtoons e Novels**.

> Dark mode · Escalável · Supabase · React + TypeScript · Preparada para produção

---

## Status do projeto

| Etapa | Conteúdo | Status |
|-------|----------|--------|
| 1 | Fundação (auth, DB, layout, roles, RLS) | ✅ |
| 2 | Home, catálogo, detalhes da obra | ✅ |
| 3 | Leitor (vertical / paged / novel) + progresso | ✅ |
| 4 | Biblioteca, favoritos, histórico, perfil, settings | ✅ |
| 5 | Comentários, denúncias, notificações, comunidade | ✅ |
| 6 | Painel admin completo | ✅ |
| 7 | Ranking + VIP (estrutura sem pagamentos fictícios) | ✅ |
| 8 | Segurança, docs de deploy, polish | ✅ |

---

## Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Estado:** Zustand + TanStack Query
- **Backend:** Supabase (PostgreSQL, Auth, Storage, RLS)
- **Hospedagem:** Vercel
- **Versionamento:** GitHub

---

## Início rápido (local)

```bash
# 1. Dependências
npm install

# 2. Ambiente
cp .env.example .env
# Edite VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# 3. Banco (Supabase SQL Editor)
# Execute as migrations em supabase/migrations/ na ordem

# 4. Dev server
npm run dev
```

Documentação detalhada:
- **[DEPLOY.md](./DEPLOY.md)** — go-live na Vercel + Supabase
- **[SECURITY.md](./SECURITY.md)** — RLS, roles, checklist de segurança

---

## Rotas principais

| Rota | Descrição |
|------|-----------|
| `/` | Home |
| `/catalog` | Catálogo com filtros |
| `/title/:slug` | Detalhes da obra + comentários |
| `/read/:slug/:chapter` | Leitor imersivo |
| `/library` `/favorites` `/history` | Conta do usuário |
| `/profile/:username` | Perfil público |
| `/settings` | Editar perfil |
| `/community` | Discussões |
| `/ranking` | Rankings |
| `/vip` | Planos VIP |
| `/admin/*` | Painel administrativo |
| `/login` `/register` | Autenticação |

---

## Roles

| Role | Poderes |
|------|---------|
| `reader` | Ler, comentar, biblioteca, favoritos |
| `uploader` | Cadastrar/publicar obras e capítulos |
| `moderator` | Moderação de comentários e denúncias |
| `admin` | Administração completa |
| `superadmin` | Controle global |

A autorização é aplicada no **PostgreSQL (RLS)** e reforçada no frontend com `ProtectedRoute`.

---

## Scripts

```bash
npm run dev        # desenvolvimento
npm run build      # typecheck + build
npm run typecheck  # só TypeScript
npm run preview    # preview do build
```

---

## Estrutura

```
src/
├── app/              # Router, ProtectedRoute
├── components/       # UI, layout, titles, reader, comments, admin, library
├── features/         # titles, chapters, library, community, admin, ranking, vip
├── pages/            # Páginas públicas + admin/
├── stores/           # authStore, readerStore
├── lib/supabase/     # Cliente tipado
└── types/            # Database + domínio
supabase/
└── migrations/       # Schema, RLS, helpers
```

---

## Go-live (resumo)

1. Projeto Supabase + migrations
2. Auth providers + redirect URLs de produção
3. Buckets Storage: `covers`, `chapter-pages`, `avatars`
4. Variáveis `VITE_*` na Vercel
5. Deploy (Vite → `dist`)
6. Promover o primeiro usuário a `superadmin` (SQL — ver SECURITY.md)
7. Cadastrar obras no `/admin`

Detalhes em **DEPLOY.md**.

---

## Avisos importantes

- **Não** é uma ferramenta de criação de obras com IA — é uma plataforma de **leitura**.
- **Não** implementamos pagamentos fictícios. VIP está estruturado para provedores reais.
- **Não** exponha a `service_role` key no frontend.
- Dados de exemplo: use `supabase/seed_dev.sql` **somente em desenvolvimento**.

---

## Licença

Projeto privado — WOLFTOON NEW
