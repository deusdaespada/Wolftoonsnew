import { supabase } from '@/lib/supabase/client'
import type { Subscription } from '@/types/vip'

export async function fetchUserSubscriptions(userId: string): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Subscription[]
}

export async function fetchActiveSubscription(
  userId: string
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('ends_at', { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data as Subscription | null
}

export async function grantVipSubscription(params: {
  userId: string
  plan: string
  days: number
  adminId: string
}): Promise<void> {
  const startsAt = new Date()
  const endsAt = new Date()
  endsAt.setDate(endsAt.getDate() + params.days)

  await supabase
    .from('subscriptions')
    .update({ status: 'expired', updated_at: new Date().toISOString() })
    .eq('user_id', params.userId)
    .eq('status', 'active')

  const { error } = await supabase.from('subscriptions').insert({
    user_id: params.userId,
    plan: params.plan,
    status: 'active',
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
  })

  if (error) throw error

  await supabase
    .from('profiles')
    .update({ is_vip: true, updated_at: new Date().toISOString() })
    .eq('id', params.userId)

  try {
    await supabase.from('admin_logs').insert({
      admin_id: params.adminId,
      action: 'grant_vip',
      target_type: 'user',
      target_id: params.userId,
      details: { plan: params.plan, days: params.days },
    })
  } catch {
    // non-critical
  }
}

export async function revokeVip(params: {
  userId: string
  adminId: string
}): Promise<void> {
  await supabase
    .from('subscriptions')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('user_id', params.userId)
    .eq('status', 'active')

  await supabase
    .from('profiles')
    .update({ is_vip: false, updated_at: new Date().toISOString() })
    .eq('id', params.userId)

  try {
    await supabase.from('admin_logs').insert({
      admin_id: params.adminId,
      action: 'revoke_vip',
      target_type: 'user',
      target_id: params.userId,
    })
  } catch {
    // non-critical
  }
}
