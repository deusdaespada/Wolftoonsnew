# Segurança — WOLFTOON NEW

## Princípios

1. **Autorização sempre no backend** — RLS (Row Level Security) no PostgreSQL/Supabase.
2. **Frontend nunca confia em si mesmo** — roles e permissões são validadas no banco.
3. **Chaves privadas nunca no frontend** — apenas `VITE_SUPABASE_ANON_KEY` (protegida por RLS).
4. **Sem pagamentos fictícios** — integrações financeiras só com provedores reais.

## Controles implementados

| Controle | Onde |
|----------|------|
| Row Level Security | Todas as tabelas públicas |
| Roles (reader → superadmin) | `roles` + `user_roles` + funções `has_role` / `is_staff` / `is_admin` |
| Proteção de rotas | `ProtectedRoute` + checagem de role |
| Auth real | Supabase Auth (email, Google, Discord) |
| Upload controlado | Storage + policies (configurar no dashboard) |
| XSS | React escapa por padrão; não usar `dangerouslySetInnerHTML` |
| SQL Injection | Client Supabase usa queries parametrizadas |
| Logs administrativos | Tabela `admin_logs` |
| Headers HTTP | `vercel.json` (X-Frame-Options, nosniff, etc.) |
| Denúncias | Sistema de reports para moderação |

## Checklist antes do go-live

- [ ] RLS habilitado em **todas** as tabelas (migration inicial já faz isso)
- [ ] Service role key **nunca** exposta no frontend ou no repositório
- [ ] Providers OAuth com redirect URLs de produção configuradas
- [ ] Buckets de Storage com policies restritivas (upload só autenticado/staff)
- [ ] Primeiro superadmin criado manualmente via SQL (não deixar signup virar admin)
- [ ] `maintenance_mode` testado
- [ ] CORS / Site URL do Supabase apontando para o domínio de produção
- [ ] Rate limiting: habilitar no Supabase (Auth rate limits) e considerar WAF/Vercel

## Criar o primeiro administrador

Após o primeiro usuário se cadastrar pelo site:

```sql
-- Substitua USER_UUID pelo id em auth.users / profiles
INSERT INTO public.user_roles (user_id, role_id)
SELECT 'USER_UUID', id FROM public.roles WHERE name = 'superadmin'
ON CONFLICT DO NOTHING;
```

## Storage (recomendado)

Buckets públicos para leitura: `covers`, `chapter-pages`, `avatars`.

Policies sugeridas:
- **SELECT**: público (`true`)
- **INSERT/UPDATE/DELETE**: apenas usuários autenticados com role `uploader`, `moderator`, `admin` ou `superadmin`

Use funções `has_role(auth.uid(), 'uploader')` nas policies do Storage quando possível.

## O que NÃO fazer

- Não desabilitar RLS “só para testar” em produção
- Não commitar `.env`
- Não usar a service role no browser
- Não confiar só em `if (user.role === 'admin')` no React
