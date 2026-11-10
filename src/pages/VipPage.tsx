import { Link } from 'react-router-dom'
import { Crown, Check, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useActiveSubscription, useMySubscriptions } from '@/features/vip/hooks'
import { VIP_PLANS } from '@/types/vip'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function VipPage() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const { data: active } = useActiveSubscription()
  const { data: history = [] } = useMySubscriptions()

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
      {/* Hero */}
      <div className="text-center space-y-4 mb-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20">
          <Crown className="h-8 w-8 text-amber-400" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          WOLFTOON <span className="text-amber-400">VIP</span>
        </h1>
        <p className="mx-auto max-w-lg text-wolf-white/60">
          Apoie a plataforma e desbloqueie benefícios exclusivos. A estrutura está pronta —
          pagamentos serão integrados com provedores reais e seguros.
        </p>
        {profile?.is_vip && (
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1.5 text-sm font-medium text-amber-300">
            <Sparkles className="h-4 w-4" />
            Você é VIP
            {active?.ends_at && (
              <span className="text-amber-300/60">
                · até {formatDate(active.ends_at)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Plans */}
      <div className="grid gap-6 sm:grid-cols-2 mb-12">
        {VIP_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'relative rounded-2xl border p-6 transition-all',
              plan.highlighted
                ? 'border-amber-500/50 bg-amber-500/5 shadow-lg shadow-amber-500/10'
                : 'border-wolf-gray/40 bg-wolf-graphite/50'
            )}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold text-wolf-black">
                Recomendado
              </span>
            )}
            <h2 className="font-display text-xl font-bold text-wolf-white">{plan.name}</h2>
            <p className="mt-1 text-sm text-wolf-white/50">{plan.description}</p>
            <p className="mt-4 font-display text-2xl font-bold text-amber-400">
              {plan.price_label}
            </p>
            <ul className="mt-6 space-y-3">
              {plan.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-wolf-white/70">
                  <Check className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full"
              variant={plan.highlighted ? 'primary' : 'secondary'}
              disabled
              title="Pagamentos em breve"
            >
              Em breve
            </Button>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="rounded-xl border border-wolf-ice/20 bg-wolf-ice/5 px-5 py-4 text-sm text-wolf-white/60 mb-10">
        <p className="font-medium text-wolf-ice">Sobre pagamentos</p>
        <p className="mt-1">
          Não implementamos pagamentos fictícios. Quando a integração financeira for ativada,
          usaremos apenas provedores reais e seguros (ex.: Stripe, Pagar.me, Mercado Pago).
          Administradores podem conceder VIP manualmente pelo painel.
        </p>
      </div>

      {/* User subscription history */}
      {user && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Seu histórico de assinaturas</h2>
          {history.length === 0 ? (
            <p className="text-sm text-wolf-white/40">Nenhuma assinatura registrada.</p>
          ) : (
            <div className="space-y-2">
              {history.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-wolf-gray/30 bg-wolf-graphite/40 px-4 py-3 text-sm"
                >
                  <div>
                    <span className="font-medium text-wolf-white">{sub.plan}</span>
                    <span
                      className={cn(
                        'ml-2 rounded px-1.5 py-0.5 text-[10px] font-medium',
                        sub.status === 'active' && 'bg-emerald-500/20 text-emerald-400',
                        sub.status === 'expired' && 'bg-wolf-gray/50 text-wolf-white/50',
                        sub.status === 'cancelled' && 'bg-red-500/20 text-red-400',
                        sub.status === 'pending' && 'bg-amber-500/20 text-amber-400'
                      )}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <div className="text-xs text-wolf-white/40">
                    {formatDate(sub.starts_at)}
                    {sub.ends_at && ` → ${formatDate(sub.ends_at)}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!user && (
        <div className="text-center">
          <Link to="/login">
            <Button variant="secondary">Entrar para ver seu status VIP</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
