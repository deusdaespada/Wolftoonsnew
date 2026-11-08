import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, User, Loader2 } from 'lucide-react'

export function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        if (username.length < 3) {
            setError('O nome de usuário deve ter pelo menos 3 caracteres.')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.')
            setLoading(false)
            return
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
            return
        }

        // Cria o perfil após o signup (trigger no banco também pode fazer isso)
        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                display_name: username,
            })

            if (profileError && !profileError.message.includes('duplicate')) {
                console.error('Erro ao criar perfil:', profileError)
            }
        }

        setLoading(false)
        setSuccess(true)
    }

    const handleOAuth = async (provider: 'google' | 'discord') => {
        setError(null)
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        })
        if (error) setError(error.message)
    }

    if (success) {
        return (
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
                <div className="w-full max-w-md text-center">
                    <div className="card p-8">
                        <h1 className="text-2xl font-bold text-[var(--color-accent)]">Conta criada!</h1>
                        <p className="mt-3 text-[var(--color-muted)]">
                            Verifique seu e-mail para confirmar a conta (se a confirmação estiver ativada no Supabase).
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary mt-6"
                        >
                            Ir para o login
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)] font-bold text-white">
                            W
                        </div>
                        <span className="font-[family-name:var(--font-display)] text-xl font-bold">
                            WOLFTOON NEW
                        </span>
                    </Link>
                    <h1 className="mt-6 text-2xl font-bold">Criar conta</h1>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Comece a ler agora
                    </p>
                </div>

                <div className="card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="mb-1.5 block text-sm font-medium">
                                Nome de usuário
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ... 