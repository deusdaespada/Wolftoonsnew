# WOLFTOON NEW

Plataforma profissional de leitura digital de Manhwas, Manhuas, Mangás, Webtoons e Novels.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4
- **Estado**: Zustand + TanStack Query
- **Backend**: Supabase (Auth + PostgreSQL + Storage + RLS)
- **Deploy**: Vercel

## Etapa 1 — Fundação (atual)

- Projeto Vite + React + TypeScript configurado
- Tailwind CSS 4 com tema dark (cores oficiais)
- Cliente Supabase tipado
- Autenticação real (e-mail/senha + Google + Discord)
- Layout base (Header + Footer + menu mobile)
- Rotas principais estruturadas
- Migration SQL completa do banco
- Store de autenticação com Zustand
- `.env.example`

## Como rodar

### 1. Instalar dependências

```bash
cd wolftoon-new
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No SQL Editor, execute o arquivo `supabase/migrations/001_initial_schema.sql`
3. Em Authentication → Providers, ative **Google** e **Discord** (opcional)
4. Copie a URL e a anon key

```bash
cp .env.example .env
```

Preencha:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Rodar

```bash
npm run dev
```

## Estrutura de pastas

```
src/
├── components/
│   ├── layout/     # Header, Footer, Layout
│   └── ui/         # Componentes base (próximas etapas)
├── features/       # Módulos por domínio
├── lib/            # supabase, utils
├── pages/          # Páginas das rotas
├── stores/         # Zustand
└── types/          # Tipos TypeScript
```

## Próximas etapas

- **Etapa 2**: Home dinâmica, Catálogo com filtros, Página de obra
- **Etapa 3**: Leitor (vertical/horizontal/novel)
- **Etapa 4**: Biblioteca, favoritos, perfil
- **Etapa 5**: Comentários, seguidores, notificações
- **Etapa 6**: Painel administrativo
- **Etapa 7**: Ranking, VIP, estatísticas
- **Etapa 8**: Segurança final, testes, deploy

## Identidade visual

| Cor | Hex |
|-----|-----|
| Preto profundo | `#090B10` |
| Grafite | `#121722` |
| Cinza | `#202938` |
| Branco | `#F4F6FA` |
| Azul-gelo | `#36A3FF` |
| Azul profundo | `#142B50` |

Dark mode padrão. Mobile-first.
