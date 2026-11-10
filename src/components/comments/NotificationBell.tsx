import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/features/community/hooks'
import { useAuthStore } from '@/stores/authStore'
import { formatRelativeTime, cn } from '@/lib/utils'

export function NotificationBell() {
  const user = useAuthStore((s) => s.user)
  const { data: unread = 0 } = useUnreadCount()
  const { data: notifications = [] } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAll = useMarkAllNotificationsRead()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-wolf-white/70 transition-colors hover:bg-wolf-gray/40 hover:text-wolf-white"
        aria-label="Notificações"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wolf-ice px-1 text-[10px] font-bold text-wolf-black">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right animate-scale-in rounded-xl border border-wolf-gray/50 bg-wolf-graphite shadow-wolf-lg sm:w-96">
          <div className="flex items-center justify-between border-b border-wolf-gray/40 px-4 py-3">
            <h3 className="text-sm font-semibold text-wolf-white">Notificações</h3>
            {unread > 0 && (
              <button
                onClick={() => markAll.mutate()}
                className="text-xs text-wolf-ice hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-wolf-white/40">
                Nenhuma notificação.
              </p>
            ) : (
              notifications.slice(0, 15).map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'border-b border-wolf-gray/20 px-4 py-3 transition-colors hover:bg-wolf-gray/20',
                    !n.is_read && 'bg-wolf-ice/5'
                  )}
                >
                  {n.link ? (
                    <Link
                      to={n.link}
                      onClick={() => {
                        if (!n.is_read) markRead.mutate(n.id)
                        setOpen(false)
                      }}
                      className="block"
                    >
                      <NotificationContent n={n} />
                    </Link>
                  ) : (
                    <button
                      className="w-full text-left"
                      onClick={() => {
                        if (!n.is_read) markRead.mutate(n.id)
                      }}
                    >
                      <NotificationContent n={n} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationContent({ n }: { n: { title: string; message: string | null; created_at: string; is_read: boolean } }) {
  return (
    <>
      <div className="flex items-start gap-2">
        {!n.is_read && (
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-wolf-ice" />
        )}
        <div className={cn(!n.is_read && 'ml-0', n.is_read && 'ml-3.5')}>
          <p className="text-sm font-medium text-wolf-white">{n.title}</p>
          {n.message && (
            <p className="mt-0.5 text-xs text-wolf-white/50 line-clamp-2">{n.message}</p>
          )}
          <p className="mt-1 text-[10px] text-wolf-white/30">
            {formatRelativeTime(n.created_at)}
          </p>
        </div>
      </div>
    </>
  )
}
