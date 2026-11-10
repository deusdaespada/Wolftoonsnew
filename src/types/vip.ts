export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending'

export type Subscription = {
  id: string
  user_id: string
  plan: string
  status: SubscriptionStatus
  starts_at: string
  ends_at: string | null
  created_at: string
  updated_at: string
}

export const VIP_PLANS = [
  {
    id: 'vip_monthly',
    name: 'VIP Mensal',
    description: 'Acesso VIP por 30 dias',
    price_label: 'Em breve',
    benefits: [
      'Badge VIP no perfil',
      'Sem anúncios (quando implementados)',
      'Acesso antecipado a novos recursos',
      'Suporte prioritário',
    ],
  },
  {
    id: 'vip_yearly',
    name: 'VIP Anual',
    description: 'Melhor custo-benefício',
    price_label: 'Em breve',
    highlighted: true,
    benefits: [
      'Tudo do plano mensal',
      'Badge VIP exclusivo',
      '2 meses grátis equivalentes',
      'Prioridade em solicitações',
    ],
  },
] as const
