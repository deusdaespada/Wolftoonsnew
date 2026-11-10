import { useState } from 'react'
import { useAdminReports, useUpdateReport, useHideComment } from '@/features/admin/hooks'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { formatRelativeTime, cn } from '@/lib/utils'

export function AdminReportsPage() {
  const [filter, setFilter] = useState<string | undefined>('pending')
  const { data: reports = [], isLoading } = useAdminReports(filter)
  const updateReport = useUpdateReport()
  const hideComment = useHideComment()

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Denúncias</h1>
        <p className="text-sm text-wolf-white/50">Moderação de conteúdo</p>
      </div>

      <div className="flex gap-2">
        {['pending', 'reviewed', 'resolved', 'dismissed', undefined].map((s) => (
          <button
            key={s ?? 'all'}
            onClick={() => setFilter(s)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
              filter === s
                ? 'bg-wolf-ice text-wolf-black'
                : 'bg-wolf-gray/50 text-wolf-white/70 hover:bg-wolf-gray'
            )}
          >
            {s ?? 'Todas'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : reports.length === 0 ? (
        <p className="py-16 text-center text-sm text-wolf-white/40">Nenhuma denúncia.</p>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-wolf-gray/40 bg-wolf-graphite/50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-300">
                      {r.reason}
                    </span>
                    <span className="text-xs text-wolf-white/40">{r.target_type}</span>
                    <span className="text-xs text-wolf-white/30">
                      {formatRelativeTime(r.created_at)}
                    </span>
                  </div>
                  {r.description && (
                    <p className="mt-2 text-sm text-wolf-white/70">{r.description}</p>
                  )}
                  <p className="mt-1 text-xs text-wolf-white/40">
                    ID: {r.target_id.slice(0, 8)}… · Status: {r.status}
                    {r.reporter && ` · por @${r.reporter.username}`}
                  </p>
                </div>
                {r.status === 'pending' && (
                  <div className="flex flex-wrap gap-2">
                    {r.target_type === 'comment' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          hideComment.mutate(r.target_id)
                          updateReport.mutate({ reportId: r.id, status: 'resolved' })
                        }}
                      >
                        Ocultar comentário
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateReport.mutate({ reportId: r.id, status: 'resolved' })}
                    >
                      Resolver
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateReport.mutate({ reportId: r.id, status: 'dismissed' })}
                    >
                      Dispensar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
