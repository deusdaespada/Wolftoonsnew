import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Flag, Trash2, User, Crown } from 'lucide-react'
import type { CommentWithAuthor } from '@/types/community'
import { useToggleCommentLike, useDeleteComment, useCreateReport } from '@/features/community/hooks'
import { useAuthStore } from '@/stores/authStore'
import { CommentForm } from './CommentForm'
import { formatRelativeTime, cn } from '@/lib/utils'
import { REPORT_REASON_LABELS, type ReportReason } from '@/types/community'

interface CommentItemProps {
  comment: CommentWithAuthor
  targetType: 'title' | 'chapter'
  targetId: string
  depth?: number
}

export function CommentItem({ comment, targetType, targetId, depth = 0 }: CommentItemProps) {
  const user = useAuthStore((s) => s.user)
  const isStaff = useAuthStore((s) => s.isStaff)
  const toggleLike = useToggleCommentLike()
  const deleteComment = useDeleteComment()
  const createReport = useCreateReport()

  const [showReply, setShowReply] = useState(false)
  const [spoilerRevealed, setSpoilerRevealed] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [reportReason, setReportReason] = useState<ReportReason>('spam')
  const [reportDone, setReportDone] = useState(false)

  const isOwner = user?.id === comment.user_id
  const canDelete = isOwner || isStaff()

  const handleLike = () => {
    if (!user) return
    toggleLike.mutate({
      commentId: comment.id,
      currentlyLiked: !!comment.liked_by_me,
      targetType,
      targetId,
    })
  }

  const handleDelete = () => {
    if (!confirm('Excluir este comentário?')) return
    deleteComment.mutate({
      commentId: comment.id,
      targetType,
      targetId,
    })
  }

  const handleReport = async () => {
    try {
      await createReport.mutateAsync({
        targetType: 'comment',
        targetId: comment.id,
        reason: reportReason,
      })
      setReportDone(true)
      setTimeout(() => {
        setShowReport(false)
        setReportDone(false)
      }, 1500)
    } catch {
      // ignore
    }
  }

  return (
    <div className={cn('group', depth > 0 && 'ml-6 sm:ml-10 border-l border-wolf-gray/30 pl-4')}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Link to={`/profile/${comment.author.username}`} className="shrink-0">
          {comment.author.avatar_url ? (
            <img
              src={comment.author.avatar_url}
              alt={comment.author.username}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-wolf-gray/40"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wolf-gray">
              <User className="h-4 w-4 text-wolf-white/40" />
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/profile/${comment.author.username}`}
              className="text-sm font-semibold text-wolf-white hover:text-wolf-ice transition-colors"
            >
              {comment.author.display_name || comment.author.username}
            </Link>
            {comment.author.is_vip && (
              <Crown className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span className="text-xs text-wolf-white/40">
              {formatRelativeTime(comment.created_at)}
            </span>
          </div>

          {/* Content */}
          <div className="mt-1.5">
            {comment.is_spoiler && !spoilerRevealed ? (
              <button
                onClick={() => setSpoilerRevealed(true)}
                className="rounded-lg bg-wolf-gray/50 px-3 py-2 text-xs text-wolf-white/60 hover:bg-wolf-gray transition-colors"
              >
                ⚠ Contém spoiler — clique para revelar
              </button>
            ) : (
              <p className="text-sm leading-relaxed text-wolf-white/80 whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <button
              onClick={handleLike}
              disabled={!user || toggleLike.isPending}
              className={cn(
                'flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors',
                comment.liked_by_me
                  ? 'text-red-400'
                  : 'text-wolf-white/40 hover:text-wolf-white/70'
              )}
            >
              <Heart className={cn('h-3.5 w-3.5', comment.liked_by_me && 'fill-red-400')} />
              {comment.likes_count > 0 && comment.likes_count}
            </button>

            {depth < 2 && user && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-wolf-white/40 hover:text-wolf-white/70 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Responder
              </button>
            )}

            {user && !isOwner && (
              <button
                onClick={() => setShowReport(!showReport)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-wolf-white/30 hover:text-wolf-white/60 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Flag className="h-3.5 w-3.5" />
                Denunciar
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={deleteComment.isPending}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-400/60 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Report form */}
          {showReport && (
            <div className="mt-3 rounded-lg border border-wolf-gray/40 bg-wolf-black/50 p-3 space-y-2">
              {reportDone ? (
                <p className="text-xs text-emerald-400">Denúncia enviada. Obrigado.</p>
              ) : (
                <>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as ReportReason)}
                    className="w-full rounded-lg border border-wolf-gray/60 bg-wolf-black px-3 py-1.5 text-xs text-wolf-white"
                  >
                    {Object.entries(REPORT_REASON_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReport}
                      className="rounded-lg bg-red-600/80 px-3 py-1.5 text-xs text-white hover:bg-red-600"
                    >
                      Enviar
                    </button>
                    <button
                      onClick={() => setShowReport(false)}
                      className="rounded-lg px-3 py-1.5 text-xs text-wolf-white/50 hover:text-wolf-white"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Reply form */}
          {showReply && (
            <div className="mt-3">
              <CommentForm
                targetType={targetType}
                targetId={targetId}
                parentId={comment.id}
                autoFocus
                placeholder={`Responder a @${comment.author.username}...`}
                onSuccess={() => setShowReply(false)}
                onCancel={() => setShowReply(false)}
              />
            </div>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  targetType={targetType}
                  targetId={targetId}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
