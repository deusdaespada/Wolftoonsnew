# Checklist de go-live — WOLFTOON NEW

## Supabase

- [ ] Projeto criado
- [ ] Migration `20241108000001_initial_schema.sql` executada
- [ ] Migration `20241108000002_reader_helpers.sql` executada
- [ ] Email Auth habilitado
- [ ] Google / Discord (opcional) configurados
- [ ] Site URL + Redirect URLs de produção
- [ ] Buckets: `covers`, `chapter-pages`, `avatars`
- [ ] Policies de Storage revisadas

## Frontend / Vercel

- [ ] `VITE_SUPABASE_URL` definida
- [ ] `VITE_SUPABASE_ANON_KEY` definida
- [ ] Build `npm run build` ok
- [ ] Deploy Vercel ok
- [ ] SPA routes funcionando (refresh em `/title/...`)
- [ ] Headers de segurança ativos (`vercel.json`)

## Conta admin

- [ ] Usuário criado pelo registro normal
- [ ] Role `superadmin` ou `admin` concedida via SQL
- [ ] Acesso a `/admin` ok

## Funcional smoke test

- [ ] Login / registro
- [ ] Catálogo e home
- [ ] Criar obra no admin
- [ ] Publicar capítulo (URLs de imagem ou texto)
- [ ] Ler capítulo nos 3 modos
- [ ] Biblioteca / favoritos / histórico
- [ ] Comentar e receber notificação de reply
- [ ] Ranking carrega
- [ ] Página VIP carrega
- [ ] Denúncia aparece no admin

## Segurança

- [ ] `.env` não commitado
- [ ] Service role fora do frontend
- [ ] RLS não desabilitado
- [ ] OAuth redirects só para domínios oficiais

Quando todos os itens estiverem marcados, a plataforma está pronta para receber usuários reais.
