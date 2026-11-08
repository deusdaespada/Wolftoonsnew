import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'
import { supabase } from '@/lib/supabase'

interface AuthState {
    user: User | null
    session: Session | null
    profile: Profile | null
    loading: boolean
    initialized: boolean
    setSession: (session: Session | null) => void
    setProfile: (profile: Profile | null) => void
    setLoading: (loading: boolean) => void
    initialize: () => Promise<void>
    signOut: () => Promise<void>
    fetchProfile: (userId: string) => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    profile: null,
    loading: true,
    initialized: false,

    setSession: (session) =>
        set({
            session,
            user: session?.user ?? null,
        }),

    setProfile: (profile) => set({ profile }),

    setLoading: (loading) => set({ loading }),

    fetchProfile: async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (!error && data) {
            set({ profile: data })
        }
    },

    initialize: async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            set({
                session,
                user: session?.user ?? null,
                loading: false,
                initialized: true,
            })

            if (session?.user) {
                await get().fetchProfile(session.user.id)
            }

            supabase.auth.onAuthStateChange(async (_event, session) => {
                set({
                    session,
                    user: session?.user ?? null,
                })

                if (session?.user) {
                    await get().fetchProfile(session.user.id)
                } else {
                    set({ profile: null })
                }
            })
        } catch (error) {
            console.error('Erro ao inicializar auth:', error)
            set({ loading: false, initialized: true })
        }
    },

    signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null, profile: null })
    },
}))
