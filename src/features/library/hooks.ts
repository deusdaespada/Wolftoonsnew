import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchUserLibrary,
  getLibraryEntry,
  setLibraryStatus,
  removeFromLibrary,
  fetchFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
  fetchReadingHistory,
  fetchProfileByUsername,
  updateProfile,
  fetchProfileStats,
  isFollowing,
  followUser,
  unfollowUser,
} from './api'
import { useAuthStore } from '@/stores/authStore'
import type { LibraryStatus } from '@/types/library'
import type { Profile } from '@/types/database'

export function useLibrary(status?: LibraryStatus) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['library', user?.id, status ?? 'all'],
    queryFn: () => fetchUserLibrary(user!.id, status),
    enabled: !!user?.id,
  })
}

export function useLibraryEntry(titleId: string | undefined) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['library-entry', user?.id, titleId],
    queryFn: () => getLibraryEntry(user!.id, titleId!),
    enabled: !!user?.id && !!titleId,
  })
}

export function useSetLibraryStatus() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      titleId: string
      status: LibraryStatus
      progressChapter?: number | null
    }) => {
      if (!user?.id) throw new Error('Não autenticado')
      await setLibraryStatus({ userId: user.id, ...params })
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['library', user?.id] })
      qc.invalidateQueries({ queryKey: ['library-entry', user?.id, vars.titleId] })
    },
  })
}

export function useRemoveFromLibrary() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (titleId: string) => {
      if (!user?.id) throw new Error('Não autenticado')
      await removeFromLibrary(user.id, titleId)
    },
    onSuccess: (_d, titleId) => {
      qc.invalidateQueries({ queryKey: ['library', user?.id] })
      qc.invalidateQueries({ queryKey: ['library-entry', user?.id, titleId] })
    },
  })
}

export function useFavorites() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => fetchFavorites(user!.id),
    enabled: !!user?.id,
  })
}

export function useIsFavorite(titleId: string | undefined) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['is-favorite', user?.id, titleId],
    queryFn: () => isFavorite(user!.id, titleId!),
    enabled: !!user?.id && !!titleId,
  })
}

export function useToggleFavorite() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (params: { titleId: string; currentlyFavorite: boolean }) => {
      if (!user?.id) throw new Error('Não autenticado')
      if (params.currentlyFavorite) {
        await removeFavorite(user.id, params.titleId)
      } else {
        await addFavorite(user.id, params.titleId)
      }
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['favorites', user?.id] })
      qc.invalidateQueries({ queryKey: ['is-favorite', user?.id, vars.titleId] })
      qc.invalidateQueries({ queryKey: ['title'] })
    },
  })
}

export function useReadingHistory(limit = 50) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['reading-history', user?.id, limit],
    queryFn: () => fetchReadingHistory(user!.id, limit),
    enabled: !!user?.id,
  })
}

export function useProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchProfileByUsername(username),
    enabled: !!username,
  })
}

export function useUpdateProfile() {
  const user = useAuthStore((s) => s.user)
  const refreshProfile = useAuthStore((s) => s.refreshProfile)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (
      updates: Partial<Pick<Profile, 'display_name' | 'bio' | 'avatar_url' | 'username'>>
    ) => {
      if (!user?.id) throw new Error('Não autenticado')
      return updateProfile(user.id, updates)
    },
    onSuccess: async (data) => {
      await refreshProfile()
      qc.invalidateQueries({ queryKey: ['profile', data.username] })
    },
  })
}

export function useProfileStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile-stats', userId],
    queryFn: () => fetchProfileStats(userId!),
    enabled: !!userId,
  })
}

export function useIsFollowing(followingId: string | undefined) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['is-following', user?.id, followingId],
    queryFn: () => isFollowing(user!.id, followingId!),
    enabled: !!user?.id && !!followingId && user.id !== followingId,
  })
}

export function useToggleFollow() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (params: { followingId: string; currentlyFollowing: boolean }) => {
      if (!user?.id) throw new Error('Não autenticado')
      if (params.currentlyFollowing) {
        await unfollowUser(user.id, params.followingId)
      } else {
        await followUser(user.id, params.followingId)
        // Notify the followed user
        try {
          const { createNotification } = await import('@/features/community/api')
          await createNotification({
            userId: params.followingId,
            type: 'new_follower',
            title: 'Novo seguidor',
            message: `${profile?.display_name || profile?.username || 'Alguém'} começou a seguir você`,
            link: profile?.username ? `/profile/${profile.username}` : undefined,
          })
        } catch {
          // non-critical
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['is-following'] })
      qc.invalidateQueries({ queryKey: ['profile'] })
      qc.invalidateQueries({ queryKey: ['profile-stats'] })
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
