import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAdminStats,
  fetchAdminTitles,
  fetchAdminTitle,
  createTitle,
  updateTitle,
  deleteTitle,
  fetchAdminChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  fetchAdminUsers,
  setUserRole,
  fetchAdminReports,
  updateReportStatus,
  hideComment,
  fetchPlatformSettings,
  updatePlatformSetting,
  fetchAdminLogs,
  uploadImage,
} from './api'
import { useAuthStore } from '@/stores/authStore'
import type { TitleFormData, ChapterFormData } from '@/types/admin'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchAdminStats,
    staleTime: 1000 * 60,
  })
}

export function useAdminTitles(params?: { search?: string; page?: number }) {
  return useQuery({
    queryKey: ['admin', 'titles', params],
    queryFn: () => fetchAdminTitles(params),
  })
}

export function useAdminTitle(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'title', id],
    queryFn: () => fetchAdminTitle(id!),
    enabled: !!id,
  })
}

export function useCreateTitle() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: TitleFormData) => {
      if (!user?.id) throw new Error('Não autenticado')
      return createTitle(form, user.id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'titles'] }),
  })
}

export function useUpdateTitle() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { id: string; form: Partial<TitleFormData> }) => {
      if (!user?.id) throw new Error('Não autenticado')
      return updateTitle(params.id, params.form, user.id)
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['admin', 'titles'] })
      qc.invalidateQueries({ queryKey: ['admin', 'title', vars.id] })
      qc.invalidateQueries({ queryKey: ['title'] })
    },
  })
}

export function useDeleteTitle() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      if (!user?.id) throw new Error('Não autenticado')
      return deleteTitle(id, user.id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'titles'] }),
  })
}

export function useAdminChapters(titleId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'chapters', titleId],
    queryFn: () => fetchAdminChapters(titleId!),
    enabled: !!titleId,
  })
}

export function useCreateChapter() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { titleId: string; form: ChapterFormData }) => {
      if (!user?.id) throw new Error('Não autenticado')
      return createChapter(params.titleId, params.form, user.id)
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['admin', 'chapters', vars.titleId] })
      qc.invalidateQueries({ queryKey: ['admin', 'title', vars.titleId] })
      qc.invalidateQueries({ queryKey: ['title'] })
    },
  })
}

export function useUpdateChapter() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      chapterId: string
      titleId: string
      form: Partial<ChapterFormData>
    }) => {
      if (!user?.id) throw new Error('Não autenticado')
      return updateChapter(params.chapterId, params.form, user.id)
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['admin', 'chapters', vars.titleId] })
    },
  })
}

export function useDeleteChapter() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { chapterId: string; titleId: string }) => {
      if (!user?.id) throw new Error('Não autenticado')
      return deleteChapter(params.chapterId, params.titleId, user.id)
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['admin', 'chapters', vars.titleId] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

export function useAdminUsers(params?: { search?: string; page?: number }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => fetchAdminUsers(params),
  })
}

export function useSetUserRole() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { userId: string; roleName: string; grant: boolean }) => {
      if (!user?.id) throw new Error('Não autenticado')
      return setUserRole(params.userId, params.roleName, params.grant, user.id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useAdminReports(status?: string) {
  return useQuery({
    queryKey: ['admin', 'reports', status],
    queryFn: () => fetchAdminReports(status),
  })
}

export function useUpdateReport() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      reportId: string
      status: 'reviewed' | 'resolved' | 'dismissed'
    }) => {
      if (!user?.id) throw new Error('Não autenticado')
      return updateReportStatus(params.reportId, params.status, user.id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reports'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

export function useHideComment() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (commentId: string) => {
      if (!user?.id) throw new Error('Não autenticado')
      return hideComment(commentId, user.id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments'] }),
  })
}

export function usePlatformSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: fetchPlatformSettings,
  })
}

export function useUpdateSetting() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { key: string; value: unknown }) => {
      if (!user?.id) throw new Error('Não autenticado')
      return updatePlatformSetting(params.key, params.value, user.id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'settings'] }),
  })
}

export function useAdminLogs() {
  return useQuery({
    queryKey: ['admin', 'logs'],
    queryFn: () => fetchAdminLogs(50),
  })
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (params: {
      file: File
      bucket: 'covers' | 'chapter-pages' | 'avatars'
      path: string
    }) => uploadImage(params.file, params.bucket, params.path),
  })
}
