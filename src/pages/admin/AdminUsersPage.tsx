import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAdminUsers, useSetUserRole } from '@/features/admin/hooks'
import { useGrantVip, useRevokeVip } from '@/features/vip/hooks'
import { Spinner } from '@/components/ui/Spinner'
import { formatDate, cn } from '@/lib/utils'

const ASSIGNABLE_ROLES = ['uploader', 'moderator', 'admin'] as const

export function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useAdminUsers({ search })
  const setRole = useSetUserRole()
  const grantVip = useGrantVip()
  const revokeVip = useRevokeVip()

  const toggleRole = (userId: string, roleName: string, hasRole: boolean) => {
    if (!confirm(`${hasRole ? 'Remover' : 'Conceder'} role "${roleName}"?`)) return
    setRole.mutate({ userId, roleName, grant: !hasRole })
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Usuários</h1>
        <p className="text-sm text-wolf-white/50">{data?.count ?? 0} usuários</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wolf-white/40" />
        <input
          type="search"
          placeholder="Buscar por username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-wolf-gray/60 bg-wolf-black py-2 pl-10 pr-4 text-sm text-wolf-white focus:border-wolf-ice focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-wolf-gray/40">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-wolf-gray/40 bg-wolf-graphite text-xs uppercase text-wolf-white/50">
              <tr>
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3 hidden sm:table-cell">Nível</th>
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3 hidden md:table-cell">Cadastro</th>
                <th className="px-4 py-3 text-right">VIP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wolf-gray/30">
              {(data?.data ?? []).map((u) => (
                <tr key={u.id} className="hover:bg-wolf-graphite/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-wolf-gray" />
                      )}
                      <div>
                        <p className="font-medium text-wolf-white">{u.display_name || u.username}</p>
                        <p className="text-xs text-wolf-white/40">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-wolf-white/60">
                    Lv.{u.level}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <span
                          key={r}
                          className="rounded bg-wolf-ice/15 px-1.5 py-0.5 text-[10px] font-medium text-wolf-ice"
                        >
                          {r}
                        </span>
                      ))}
                      {ASSIGNABLE_ROLES.map((role) => {
                        const has = u.roles.includes(role)
                        return (
                          <button
                            key={role}
                            onClick={() => toggleRole(u.id, role, has)}
                            className={cn(
                              'rounded px-1.5 py-0.5 text-[10px] border transition-colors',
                              has
                                ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
                                : 'border-wolf-gray/50 text-wolf-white/40 hover:border-wolf-ice/40 hover:text-wolf-ice'
                            )}
                            title={has ? `Remover ${role}` : `Conceder ${role}`}
                          >
                            {has ? `−${role}` : `+${role}`}
                          </button>
                        )
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-wolf-white/40">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.is_vip ? (
                      <button
                        onClick={() => {
                          if (confirm('Revogar VIP deste usuário?')) revokeVip.mutate(u.id)
                        }}
                        className="rounded-lg px-2 py-1 text-[10px] font-medium text-amber-400 border border-amber-500/30 hover:bg-amber-500/10"
                      >
                        Revogar VIP
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (confirm('Conceder VIP por 30 dias?')) {
                            grantVip.mutate({ userId: u.id, plan: 'vip_monthly', days: 30 })
                          }
                        }}
                        className="rounded-lg px-2 py-1 text-[10px] font-medium text-amber-400/70 border border-amber-500/20 hover:bg-amber-500/10"
                      >
                        + VIP 30d
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
