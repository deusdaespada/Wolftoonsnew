import { useState } from 'react'
import { useCreateComment } from '@/features/community/hooks'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

interface CommentFormProps {
  targetType: 'title' | 'chapter'
  targetId: string
  parentId?: string | null
  onSuccess?: () => void
  onCancel?: () => void
  placeholder?: string
  autoFocus?: boolean
}

export function CommentForm({
  targetType,
  targetId,
  parentId,
  onSuccess,
  onCancel,
  placeholder = 'Escreva um comentário...',
  autoFocus,
}: CommentFormProps) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const create = useCreateComment()
  const [content, setContent] = useState('')
  const [isSpoiler, setIsSpoiler] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    return (
      <div className="rounded-xl border border-wolf-gray/40 bg-wolf-graphite/50 px-4 py-6 text-center">
        <p className="text-sm text-wolf-white/50">Faça login para comentar.</p>
        <Button size="sm" className="mt-3" onClick={() => navigate('/login')}>
          Entrar
        </Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = content.trim()
    if (trimmed.length < 1) {
      setError('Escreva algo antes de enviar.')
      return
    }
    if (trimmed.length > 2000) {
      setError('Comentário muito longo (máx. 2000 caracteres).')
      return
    }

    try {
      await create.mutateAsync({
        targetType,
        targetId,
        content: trimmed,
        parentId,
        isSpoiler,
      })
      setContent('')
      setIsSpoiler(false)
      onSuccess?.()
    } catch (err: any) {
      setError(err?.message || 'Erro ao enviar comentário.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={parentId ? 2 : 3}
        maxLength={2000}
        className="w-full rounded-xl border border-wolf-gray/60 bg-wolf-black px-4 py-3 text-sm text-wolf-white placeholder:text-wolf-white/40 focus:border-wolf-ice focus:outline-none focus:ring-2 focus:ring-wolf-ice/20 transition-all resize-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs text-wolf-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={isSpoiler}
            onChange={(e) => setIsSpoiler(e.target.checked)}
            className="rounded border-wolf-gray accent-wolf-ice"
          />
          Contém spoiler
        </label>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" size="sm" isLoading={create.isPending}>
            {parentId ? 'Responder' : 'Comentar'}
          </Button>
        </div>
      </div>
    </form>
  )
}
