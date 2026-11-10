import { supabase } from '@/lib/supabase/client'
import type { CommentWithAuthor, CreateCommentInput, ReportReason, NotificationItem } from '@/types/community'
import type { Profile } from '@/types/database'

const AUTHOR_SELECT = 'id, username, display_name, avatar_url, is_vip'

function mapComment(row: any, likedIds: Set<string> = new Set()): CommentWithAuthor {
  return {
    id: row.id,
    user_id: row.user_id,
    target_type: row.target_type,
    target_id: row.target_id,
    parent_id: row.parent_id,
    content: row.content,
    likes_count: row.likes_count,
    is_spoiler: row.is_spoiler,
    is_hidden: row.is_hidden,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: row.profiles ?? {
      id: row.user_id,
      username: 'usuário',
      display_name: null,
      avatar_url: null,
      is_vip: false,
    },
    liked_by_me: likedIds.has(row.id),
    replies: [],
  }
}

export async function fetchComments(
  targetType: 'title' | 'chapter',
  targetId: string,
  userId?: string | null
): Promise<CommentWithAuthor[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles ( ${AUTHOR_SELECT} )
    `)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('is_hidden', false)
    .order('created_at', { ascending: true })

  if (error) throw error

  let likedIds = new Set<string>()
  if (userId && data && data.length > 0) {
    const ids = data.map((c) => c.id)
    const { data: likes } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', userId)
      .in('comment_id', ids)

    likedIds = new Set((likes ?? []).map((l) => l.comment_id))
  }

  const all = (data ?? []).map((row) => mapComment(row, likedIds))

  // Build tree: top-level + replies
  const roots: CommentWithAuthor[] = []
  const byId = new Map<string, CommentWithAuthor>()

  for (const c of all) {
    byId.set(c.id, { ...c, replies: [] })
  }

  for (const c of all) {
    const node = byId.get(c.id)!
    if (c.parent_id && byId.has(c.parent_id)) {
      byId.get(c.parent_id)!.replies!.push(node)
    } else if (!c.parent_id) {
      roots.push(node)
    } else {
      // orphan reply — show as root
      roots.push(node)
    }
  }

  // Newest first for roots
  roots.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return roots
}

export async function createComment(
  userId: string,
  input: CreateCommentInput
): Promise<CommentWithAuthor> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      target_type: input.targetType,
      target_id: input.targetId,
      parent_id: input.parentId ?? null,
      content: input.content.trim(),
      is_spoiler: input.isSpoiler ?? false,
    })
    .select(`*, profiles ( ${AUTHOR_SELECT} )`)
    .single()

  if (error) throw error
  return mapComment(data)

  // Notification for reply is handled client-side or via trigger later
}

export async function deleteComment(commentId: string, userId: string): Promise<void> {
  // RLS allows owner or staff
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function toggleCommentLike(
  userId: string,
  commentId: string,
  currentlyLiked: boolean
): Promise<void> {
  if (currentlyLiked) {
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('user_id', userId)
      .eq('comment_id', commentId)
    if (error) throw error

    // Decrement likes_count
    const { data } = await supabase.from('comments').select('likes_count').eq('id', commentId).single()
    if (data && data.likes_count > 0) {
      await supabase
        .from('comments')
        .update({ likes_count: data.likes_count - 1 })
        .eq('id', commentId)
    }
  } else {
    const { error } = await supabase.from('comment_likes').insert({
      user_id: userId,
      comment_id: commentId,
    })
    if (error && error.code !== '23505') throw error

    const { data } = await supabase.from('comments').select('likes_count').eq('id', commentId).single()
    if (data) {
      await supabase
        .from('comments')
        .update({ likes_count: (data.likes_count ?? 0) + 1 })
        .eq('id', commentId)
    }
  }
}

export async function createReport(params: {
  reporterId: string
  targetType: string
  targetId: string
  reason: ReportReason
  description?: string
}): Promise<void> {
  const { error } = await supabase.from('reports').insert({
    reporter_id: params.reporterId,
    target_type: params.targetType,
    target_id: params.targetId,
    reason: params.reason,
    description: params.description ?? null,
    status: 'pending',
  })
  if (error) throw error
}

// ─── Notifications ─────────────────────────────────────────

export async function fetchNotifications(
  userId: string,
  limit = 30
): Promise<NotificationItem[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function fetchUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) throw error
  return count ?? 0
}

export async function markNotificationRead(notificationId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) throw error
}

export async function createNotification(params: {
  userId: string
  type: string
  title: string
  message?: string
  link?: string
}): Promise<void> {
  const { error } = await supabase.from('notifications').insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    message: params.message ?? null,
    link: params.link ?? null,
  })
  // Soft fail — notifications should not break main flow
  if (error) console.error('[Notifications]', error)
}

export type DiscussionItem = CommentWithAuthor & {
  title_slug?: string | null
  title_name?: string | null
}

/** Recent comments across the platform for community page */
export async function fetchRecentDiscussions(limit = 20): Promise<DiscussionItem[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles ( ${AUTHOR_SELECT} )
    `)
    .eq('is_hidden', false)
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  const comments = (data ?? []).map((row) => mapComment(row)) as DiscussionItem[]

  // Resolve title slugs for title-targeted comments
  const titleIds = [...new Set(
    comments.filter((c) => c.target_type === 'title').map((c) => c.target_id)
  )]

  if (titleIds.length > 0) {
    const { data: titles } = await supabase
      .from('titles')
      .select('id, slug, title')
      .in('id', titleIds)

    const map = new Map((titles ?? []).map((t) => [t.id, t]))
    for (const c of comments) {
      if (c.target_type === 'title') {
        const t = map.get(c.target_id)
        c.title_slug = t?.slug ?? null
        c.title_name = t?.title ?? null
      }
    }
  }

  return comments
}
