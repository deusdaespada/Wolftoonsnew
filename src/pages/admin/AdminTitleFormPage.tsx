import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  useAdminTitle,
  useCreateTitle,
  useUpdateTitle,
  useAdminChapters,
  useCreateChapter,
  useDeleteChapter,
  useUploadImage,
} from '@/features/admin/hooks'
import { useGenres } from '@/features/titles/hooks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { CATEGORY_OPTIONS, STATUS_OPTIONS, type TitleFormData, type ChapterFormData } from '@/types/admin'
import { slugify } from '@/lib/utils'
import { Trash2, Plus } from 'lucide-react'

const emptyTitle: TitleFormData = {
  title: '',
  slug: '',
  description: '',
  cover_url: '',
  banner_url: '',
  category: 'manhwa',
  status: 'ongoing',
  author: '',
  artist: '',
  is_published: false,
  genre_ids: [],
  alternative_titles: [],
}

export function AdminTitleFormPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()

  const { data: existing, isLoading } = useAdminTitle(isNew ? undefined : id)
  const { data: genres = [] } = useGenres()
  const { data: chapters = [] } = useAdminChapters(isNew ? undefined : id)
  const createTitle = useCreateTitle()
  const updateTitle = useUpdateTitle()
  const createChapter = useCreateChapter()
  const deleteChapter = useDeleteChapter()
  const uploadImage = useUploadImage()

  const [form, setForm] = useState<TitleFormData>(emptyTitle)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [showChapterForm, setShowChapterForm] = useState(false)
  const [chapterForm, setChapterForm] = useState<ChapterFormData>({
    number: 1,
    title: '',
    slug: '',
    content_type: 'images',
    text_content: '',
    is_published: true,
    scheduled_at: null,
    page_urls: [],
  })
  const [pageUrlsText, setPageUrlsText] = useState('')

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        description: existing.description ?? '',
        cover_url: existing.cover_url ?? '',
        banner_url: existing.banner_url ?? '',
        category: existing.category,
        status: existing.status,
        author: existing.author ?? '',
        artist: existing.artist ?? '',
        is_published: existing.is_published,
        genre_ids: existing.genres?.map((g) => g.id) ?? [],
        alternative_titles: existing.alternative_titles ?? [],
      })
    }
  }, [existing])

  useEffect(() => {
    if (chapters.length > 0 && showChapterForm) {
      const maxNum = Math.max(...chapters.map((c) => Number(c.number)))
      setChapterForm((f) => ({ ...f, number: maxNum + 1, slug: `chapter-${maxNum + 1}` }))
    }
  }, [chapters, showChapterForm])

  const set = (partial: Partial<TitleFormData>) => setForm((f) => ({ ...f, ...partial }))

  const handleTitleChange = (title: string) => {
    set({
      title,
      slug: isNew ? slugify(title) : form.slug,
    })
  }

  const toggleGenre = (id: number) => {
    set({
      genre_ids: form.genre_ids.includes(id)
        ? form.genre_ids.filter((g) => g !== id)
        : [...form.genre_ids, id],
    })
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadImage.mutateAsync({
        file,
        bucket: 'covers',
        path: `cover-${Date.now()}`,
      })
      set({ cover_url: url })
    } catch (err: any) {
      setMessage({ type: 'err', text: err?.message || 'Erro no upload. Use URL manual se o bucket não existir.' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!form.title.trim()) {
      setMessage({ type: 'err', text: 'Título é obrigatório' })
      return
    }
    try {
      if (isNew) {
        const created = await createTitle.mutateAsync(form)
        setMessage({ type: 'ok', text: 'Obra criada!' })
        navigate(`/admin/titles/${created.id}`, { replace: true })
      } else {
        await updateTitle.mutateAsync({ id: id!, form })
        setMessage({ type: 'ok', text: 'Obra atualizada!' })
      }
    } catch (err: any) {
      setMessage({ type: 'err', text: err?.message || 'Erro ao salvar' })
    }
  }

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || isNew) return
    const urls = pageUrlsText
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean)

    try {
      await createChapter.mutateAsync({
        titleId: id,
        form: {
          ...chapterForm,
          slug: chapterForm.slug || `chapter-${chapterForm.number}`,
          page_urls: chapterForm.content_type === 'images' ? urls : [],
        },
      })
      setShowChapterForm(false)
      setPageUrlsText('')
      setChapterForm({
        number: chapterForm.number + 1,
        title: '',
        slug: '',
        content_type: 'images',
        text_content: '',
        is_published: true,
        scheduled_at: null,
        page_urls: [],
      })
    } catch (err: any) {
      alert(err?.message || 'Erro ao criar capítulo')
    }
  }

  if (!isNew && isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in mx-auto max-w-3xl space-y-8">
      <div>
        <Link to="/admin/titles" className="text-sm text-wolf-ice hover:underline">
          ← Voltar
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold">
          {isNew ? 'Nova obra' : 'Editar obra'}
        </h1>
      </div>

      {message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.type === 'ok'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-wolf-gray/40 bg-wolf-graphite p-6">
        <Input
          label="Título *"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />
        <Input
          label="Slug"
          value={form.slug}
          onChange={(e) => set({ slug: e.target.value })}
          required
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-wolf-white/80">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-wolf-gray/60 bg-wolf-black px-4 py-2.5 text-sm text-wolf-white focus:border-wolf-ice focus:outline-none resize-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-wolf-white/80 mb-1.5">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => set({ category: e.target.value as any })}
              className="w-full rounded-lg border border-wolf-gray/60 bg-wolf-black px-3 py-2.5 text-sm text-wolf-white"
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-wolf-white/80 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => set({ status: e.target.value as any })}
              className="w-full rounded-lg border border-wolf-gray/60 bg-wolf-black px-3 py-2.5 text-sm text-wolf-white"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Autor" value={form.author} onChange={(e) => set({ author: e.target.value })} />
          <Input label="Artista" value={form.artist} onChange={(e) => set({ artist: e.target.value })} />
        </div>

        <Input
          label="URL da capa"
          value={form.cover_url}
          onChange={(e) => set({ cover_url: e.target.value })}
          placeholder="https://..."
        />
        <div>
          <label className="block text-sm font-medium text-wolf-white/80 mb-1.5">
            Upload de capa (requer bucket "covers" no Storage)
          </label>
          <input type="file" accept="image/*" onChange={handleCoverUpload} className="text-sm text-wolf-white/60" />
        </div>

        <div>
          <label className="block text-sm font-medium text-wolf-white/80 mb-2">Gêneros</label>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  form.genre_ids.includes(g.id)
                    ? 'bg-wolf-ice text-wolf-black'
                    : 'bg-wolf-gray/50 text-wolf-white/70 hover:bg-wolf-gray'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-wolf-white/80 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => set({ is_published: e.target.checked })}
            className="accent-wolf-ice"
          />
          Publicada (visível no site)
        </label>

        <Button type="submit" isLoading={createTitle.isPending || updateTitle.isPending}>
          {isNew ? 'Criar obra' : 'Salvar alterações'}
        </Button>
      </form>

      {/* Chapters section — only when editing */}
      {!isNew && id && (
        <div className="space-y-4 rounded-2xl border border-wolf-gray/40 bg-wolf-graphite p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-wolf-white">
              Capítulos ({chapters.length})
            </h2>
            <Button size="sm" variant="secondary" onClick={() => setShowChapterForm(!showChapterForm)}>
              <Plus className="h-4 w-4" />
              Novo capítulo
            </Button>
          </div>

          {showChapterForm && (
            <form onSubmit={handleCreateChapter} className="space-y-3 rounded-xl border border-wolf-gray/40 bg-wolf-black/50 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  label="Número"
                  type="number"
                  step="0.1"
                  value={chapterForm.number}
                  onChange={(e) =>
                    setChapterForm((f) => ({
                      ...f,
                      number: Number(e.target.value),
                      slug: `chapter-${e.target.value}`,
                    }))
                  }
                  required
                />
                <Input
                  label="Título do cap."
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm((f) => ({ ...f, title: e.target.value }))}
                />
                <div>
                  <label className="block text-sm font-medium text-wolf-white/80 mb-1.5">Tipo</label>
                  <select
                    value={chapterForm.content_type}
                    onChange={(e) =>
                      setChapterForm((f) => ({
                        ...f,
                        content_type: e.target.value as 'images' | 'text',
                      }))
                    }
                    className="w-full rounded-lg border border-wolf-gray/60 bg-wolf-black px-3 py-2.5 text-sm text-wolf-white"
                  >
                    <option value="images">Imagens</option>
                    <option value="text">Texto (Novel)</option>
                  </select>
                </div>
              </div>

              {chapterForm.content_type === 'images' ? (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-wolf-white/80">
                    URLs das páginas (uma por linha, na ordem)
                  </label>
                  <textarea
                    value={pageUrlsText}
                    onChange={(e) => setPageUrlsText(e.target.value)}
                    rows={5}
                    placeholder="https://exemplo.com/pagina1.jpg&#10;https://exemplo.com/pagina2.jpg"
                    className="w-full rounded-lg border border-wolf-gray/60 bg-wolf-black px-4 py-2.5 text-sm text-wolf-white font-mono focus:border-wolf-ice focus:outline-none resize-none"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-wolf-white/80">Conteúdo do texto</label>
                  <textarea
                    value={chapterForm.text_content}
                    onChange={(e) =>
                      setChapterForm((f) => ({ ...f, text_content: e.target.value }))
                    }
                    rows={8}
                    className="w-full rounded-lg border border-wolf-gray/60 bg-wolf-black px-4 py-2.5 text-sm text-wolf-white focus:border-wolf-ice focus:outline-none resize-none"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 text-sm text-wolf-white/80">
                <input
                  type="checkbox"
                  checked={chapterForm.is_published}
                  onChange={(e) =>
                    setChapterForm((f) => ({ ...f, is_published: e.target.checked }))
                  }
                  className="accent-wolf-ice"
                />
                Publicar agora
              </label>

              <div className="flex gap-2">
                <Button type="submit" size="sm" isLoading={createChapter.isPending}>
                  Publicar capítulo
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowChapterForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-1">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="flex items-center justify-between rounded-lg border border-wolf-gray/30 px-4 py-2.5"
              >
                <div>
                  <span className="text-sm font-medium text-wolf-white">
                    Cap. {ch.number}
                    {ch.title && <span className="text-wolf-white/50"> — {ch.title}</span>}
                  </span>
                  <span className="ml-2 text-xs text-wolf-white/40">
                    {ch.content_type} · {ch.is_published ? 'publicado' : 'rascunho'} · {ch.pages_count} págs
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Excluir capítulo ${ch.number}?`)) {
                      deleteChapter.mutate({ chapterId: ch.id, titleId: id })
                    }
                  }}
                  className="rounded-lg p-1.5 text-wolf-white/40 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {chapters.length === 0 && (
              <p className="py-6 text-center text-sm text-wolf-white/40">Nenhum capítulo.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
