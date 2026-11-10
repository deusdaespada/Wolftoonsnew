import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchUserSubscriptions,
  fetchActiveSubscription,
  grantVipSubscription,
  revokeVip,
} from './api'
import { useAuthStore } from '@/stores/authStore'

export function useMySubscriptions() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn: () => fetchUserSubscriptions(user!.id),
    enabled: !!user?.id,
  })
}

export function useActiveSubscription() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['subscription-active', user?.id],
    queryFn: () => fetchActiveSubscription(user!.id),
    enabled: !!user?.id,
  })
}

export function useGrantVip() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { userId: string; plan: string; days: number }) => {
      if (!user?.id) throw new Error('Não autenticado')
      return grantVipSubscription({ ...params, adminId: user.id })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['subscriptions'] })
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useRevokeVip() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => {
      if (!user?.id) throw new Error('Não autenticado')
      return revokeVip({ userId, adminId: user.id })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['subscriptions'] })
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
