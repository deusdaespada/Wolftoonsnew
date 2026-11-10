import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { useAdminTitles, useDeleteTitle } from '@/features/admin/hooks'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types/title'
import { formatRelativeTime } from '@/lib/utils'

export function AdminTitlesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminTitles({ search, page })
  const deleteTitle = useDeleteTitle()

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Excluir a obra "${title}"? Esta ação não pode ser desfeita.`)) return
    deleteTitle.mutate(id)
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Obras</h1>
          <p className="text-sm text-wolf-white/50">
            {data?.count ?? 0} obra{(data?.count ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/admin/titles/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Nova obra
          </Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wolf-white/40" />
        <input
          type="search"
          placeholder="Buscar obras..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full rounded-lg border border-wolf-gray/60 bg-wolf-black py-2 pl-10 pr-4 text-sm text-wolf-white placeholder:text-wolf-white/40 focus:border-wolf-ice focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-wolf-gray/40">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-wolf-gray/40 bg-wolf-graphite text-xs uppercase text-wolf-white/50">
              <tr>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3 hidden sm:table-cell">Categoria</th>
                <th className="px-4 py-3 hidden md:table-cell">Status</th>
                <th className="px-4 py-3 hidden md:table-cell">Caps</th>
                <th className="px-4 py-3 hidden lg:table-cell">Atualizado</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wolf-gray/30">
              {(data?.data ?? []).map((t) => (
                <tr key={t.id} className="hover:bg-wolf-graphite/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {t.cover_url ? (
                        <img src={t.cover_url} alt="" className="h-12 w-8 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-8 rounded bg-wolf-gray/40" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-wolf-white truncate max-w-[200px]">{t.title}</p>
                        <p className="text-xs text-wolf-white/40 flex items-center gap-1">
                          {t.is_published ? (
                            <Eye className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <EyeOff className="h-3 w-3 text-wolf-white/30" />
                          )}
                          {t.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-wolf-white/60">
                    {CATEGORY_LABELS[t.category]}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-wolf-white/60">
                    {STATUS_LABELS[t.status]}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-wolf-white/60">{t.chapters_count}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-wolf-white/40 text-xs">
                    {formatRelativeTime(t.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/titles/${t.id}`}
                        className="rounded-lg p-2 text-wolf-white/50 hover:bg-wolf-gray/40 hover:text-wolf-ice"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(t.id, t.title)}
                        className="rounded-lg p-2 text-wolf-white/50 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(data?.data ?? []).length === 0 && (
            <p className="py-12 text-center text-sm text-wolf-white/40">Nenhuma obra encontrada.</p>
          )}
        </div>
      )}
    </div>
  )
}
