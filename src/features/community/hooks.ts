import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchComments,
  createComment,
  deleteComment,
  toggleCommentLike,
  createReport,
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  createNotification,
  fetchRecentDiscussions,
} from './api'
import { useAuthStore } from '@/stores/authStore'
import type { CreateCommentInput, ReportReason } from '@/types/community'

export function useComments(targetType: 'title' | 'chapter', targetId: string | undefined) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['comments', targetType, targetId],
    queryFn: () => fetchComments(targetType, targetId!, user?.id),
    enabled: !!targetId,
  })
}

export function useCreateComment() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateCommentInput) => {
      if (!user?.id) throw new Error('Não autenticado')
      const comment = await createComment(user.id, input)

      // Notify parent comment author on reply
      if (input.parentId) {
        // Fetch parent to get author
        const { data: parent } = await (await import('@/lib/supabase/client')).supabase
          .from('comments')
          .select('user_id')
          .eq('id', input.parentId)
          .single()

        if (parent && parent.user_id !== user.id) {
          await createNotification({
            userId: parent.user_id,
            type: 'comment_reply',
            title: 'Nova resposta no seu comentário',
            message: `${profile?.display_name || profile?.username || 'Alguém'} respondeu ao seu comentário`,
            link:
              input.targetType === 'title'
                ? `/title/${input.targetId}`
                : undefined,
          })
        }
      }

      return comment
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['comments', vars.targetType, vars.targetId] })
      qc.invalidateQueries({ queryKey: ['discussions'] })
    },
  })
}

export function useDeleteComment() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      commentId: string
      targetType: 'title' | 'chapter'
      targetId: string
    }) => {
      if (!user?.id) throw new Error('Não autenticado')
      await deleteComment(params.commentId, user.id)
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['comments', vars.targetType, vars.targetId] })
    },
  })
}

export function useToggleCommentLike() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      commentId: string
      currentlyLiked: boolean
      targetType: 'title' | 'chapter'
      targetId: string
    }) => {
      if (!user?.id) throw new Error('Não autenticado')
      await toggleCommentLike(user.id, params.commentId, params.currentlyLiked)
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['comments', vars.targetType, vars.targetId] })
    },
  })
}

export function useCreateReport() {
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async (params: {
      targetType: string
      targetId: string
      reason: ReportReason
      description?: string
    }) => {
      if (!user?.id) throw new Error('Não autenticado')
      await createReport({
        reporterId: user.id,
        ...params,
      })
    },
  })
}

export function useNotifications() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => fetchNotifications(user!.id),
    enabled: !!user?.id,
    refetchInterval: 1000 * 60, // poll every minute
  })
}

export function useUnreadCount() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['notifications-unread', user?.id],
    queryFn: () => fetchUnreadCount(user!.id),
    enabled: !!user?.id,
    refetchInterval: 1000 * 30,
  })
}

export function useMarkNotificationRead() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user?.id) return
      await markNotificationRead(notificationId, user.id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications', user?.id] })
      qc.invalidateQueries({ queryKey: ['notifications-unread', user?.id] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) return
      await markAllNotificationsRead(user.id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications', user?.id] })
      qc.invalidateQueries({ queryKey: ['notifications-unread', user?.id] })
    },
  })
}

export function useRecentDiscussions(limit = 20) {
  return useQuery({
    queryKey: ['discussions', limit],
    queryFn: () => fetchRecentDiscussions(limit),
    staleTime: 1000 * 60,
  })
}
