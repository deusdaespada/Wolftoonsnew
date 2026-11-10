import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import type { Profile, RoleName } from '@/types/database'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  roles: RoleName[]
  isLoading: boolean
  isInitialized: boolean
  
  // Actions
  initialize: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signUpWithEmail: (email: string, password: string, username: string) => Promise<{ error: Error | null }>
  signInWithOAuth: (provider: 'google' | 'discord') => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  hasRole: (role: RoleName) => boolean
  isStaff: () => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  roles: [],
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      set({ isLoading: true })
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        const { data: rolesData } = await supabase
          .rpc('get_user_roles', { _user_id: session.user.id })
        
        set({
          user: session.user,
          session,
          profile: profile as Profile | null,
          roles: (rolesData as RoleName[]) || [],
          isLoading: false,
          isInitialized: true,
        })
      } else {
        set({
          user: null,
          session: null,
          profile: null,
          roles: [],
          isLoading: false,
          isInitialized: true,
        })
      }

      // Listen to auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          const { data: rolesData } = await supabase
            .rpc('get_user_roles', { _user_id: session.user.id })
          
          set({
            user: session.user,
            session,
            profile: profile as Profile | null,
            roles: (rolesData as RoleName[]) || [],
          })
        } else if (event === 'SIGNED_OUT') {
          set({
            user: null,
            session: null,
            profile: null,
            roles: [],
          })
        }
      })
    } catch (error) {
      console.error('[Auth] Initialize error:', error)
      set({ isLoading: false, isInitialized: true })
    }
  },

  signInWithEmail: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  },

  signUpWithEmail: async (email, password, username) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    })
    return { error: error as Error | null }
  },

  signInWithOAuth: async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error: error as Error | null }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({
      user: null,
      session: null,
      profile: null,
      roles: [],
    })
  },

  refreshProfile: async () => {
    const { user } = get()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    const { data: rolesData } = await supabase
      .rpc('get_user_roles', { _user_id: user.id })
    
    set({
      profile: profile as Profile | null,
      roles: (rolesData as RoleName[]) || [],
    })
  },

  hasRole: (role) => {
    return get().roles.includes(role)
  },

  isStaff: () => {
    const { roles } = get()
    return roles.some(r => ['moderator', 'admin', 'superadmin'].includes(r))
  },

  isAdmin: () => {
    const { roles } = get()
    return roles.some(r => ['admin', 'superadmin'].includes(r))
  },
}))
