import { MessageSquare } from 'lucide-react'
import { useComments } from '@/features/community/hooks'
import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'
import { Spinner } from '@/components/ui/Spinner'

interface CommentSectionProps {
  targetType: 'title' | 'chapter'
  targetId: string
  title?: string
}

export function CommentSection({
  targetType,
  targetId,
  title = 'Comentários',
}: CommentSectionProps) {
  const { data: comments, isLoading, error } = useComments(targetType, targetId)

  const totalCount = comments
    ? comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0)
    : 0

  return (
    <section className="space-y-6">
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
        <MessageSquare className="h-5 w-5 text-wolf-ice" />
        {title}
        {totalCount > 0 && (
          <span className="text-sm font-normal text-wolf-white/40">({totalCount})</span>
        )}
      </h2>

      <CommentForm targetType={targetType} targetId={targetId} />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-center text-sm text-red-400">Erro ao carregar comentários.</p>
      ) : !comments || comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-wolf-white/40">
          Nenhum comentário ainda. Seja o primeiro!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              targetType={targetType}
              targetId={targetId}
            />
          ))}
        </div>
      )}
    </section>
  )
}
