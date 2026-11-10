import { useAdminLogs } from '@/features/admin/hooks'
import { Spinner } from '@/components/ui/Spinner'
import { formatRelativeTime } from '@/lib/utils'

export function AdminLogsPage() {
  const { data: logs = [], isLoading } = useAdminLogs()

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Logs administrativos</h1>
        <p className="text-sm text-wolf-white/50">Registro de ações dos administradores</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : logs.length === 0 ? (
        <p className="py-16 text-center text-sm text-wolf-white/40">Nenhum log ainda.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log: any) => (
            <div
              key={log.id}
              className="rounded-lg border border-wolf-gray/30 bg-wolf-graphite/40 px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-wolf-ice">{log.action}</span>
                {log.target_type && (
                  <span className="text-wolf-white/40">
                    {log.target_type}
                    {log.target_id && ` · ${String(log.target_id).slice(0, 8)}`}
                  </span>
                )}
                <span className="text-xs text-wolf-white/30 ml-auto">
                  {formatRelativeTime(log.created_at)}
                </span>
              </div>
              {log.profiles && (
                <p className="mt-1 text-xs text-wolf-white/40">
                  por @{log.profiles.username || log.profiles.display_name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
