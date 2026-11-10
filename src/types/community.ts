import type { Comment, Notification, Profile } from './database'

export type CommentWithAuthor = Comment & {
  author: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url' | 'is_vip'>
  liked_by_me?: boolean
  replies?: CommentWithAuthor[]
}

export type NotificationItem = Notification

export type ReportReason =
  | 'spam'
  | 'abuse'
  | 'spoiler'
  | 'inappropriate'
  | 'other'

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: 'Spam',
  abuse: 'Abuso / Assédio',
  spoiler: 'Spoiler sem marcação',
  inappropriate: 'Conteúdo inadequado',
  other: 'Outro',
}

export type CreateCommentInput = {
  targetType: 'title' | 'chapter'
  targetId: string
  content: string
  parentId?: string | null
  isSpoiler?: boolean
}
