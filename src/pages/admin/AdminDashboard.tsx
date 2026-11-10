import { Link } from 'react-router-dom'
import { Users, BookOpen, FileText, MessageSquare, Flag, Eye } from 'lucide-react'
import { useAdminStats } from '@/features/admin/hooks'
import { Spinner } from '@/components/ui/Spinner'

export function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats()

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const cards = [
    { label: 'Usuários', value: stats?.users ?? 0, icon: Users, to: '/admin/users' },
    { label: 'Obras', value: stats?.titles ?? 0, icon: BookOpen, to: '/admin/titles' },
    { label: 'Capítulos', value: stats?.chapters ?? 0, icon: FileText, to: '/admin/titles' },
    { label: 'Comentários', value: stats?.comments ?? 0, icon: MessageSquare, to: '/community' },
    {
      label: 'Denúncias pendentes',
      value: stats?.reports_pending ?? 0,
      icon: Flag,
      to: '/admin/reports',
      highlight: (stats?.reports_pending ?? 0) > 0,
    },
    {
      label: 'Views totais',
      value: stats?.views_total ?? 0,
      icon: Eye,
      to: '/admin/titles',
    },
  ]

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-wolf-white/50">Visão geral da plataforma</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className={`rounded-xl border p-5 transition-all hover:border-wolf-ice/40 ${
              card.highlight
                ? 'border-amber-500/40 bg-amber-500/10'
                : 'border-wolf-gray/40 bg-wolf-graphite/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <card.icon
                className={`h-5 w-5 ${card.highlight ? 'text-amber-400' : 'text-wolf-ice'}`}
              />
            </div>
            <p className="mt-3 text-2xl font-bold text-wolf-white">
              {card.value.toLocaleString('pt-BR')}
            </p>
            <p className="mt-1 text-xs text-wolf-white/50">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/titles/new"
          className="rounded-lg bg-wolf-ice px-4 py-2.5 text-sm font-semibold text-wolf-black hover:bg-wolf-ice/90"
        >
          + Nova obra
        </Link>
        <Link
          to="/admin/reports"
          className="rounded-lg bg-wolf-gray px-4 py-2.5 text-sm font-semibold text-wolf-white hover:bg-wolf-gray/80"
        >
          Ver denúncias
        </Link>
      </div>
    </div>
  )
}
