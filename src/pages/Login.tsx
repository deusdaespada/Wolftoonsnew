import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, Loader2 } from 'lucide-react'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        setLoading(false)

        if (error) {
            setError(error.message === 'Invalid login credentials'
                ? 'E-mail ou senha incorretos.'
                : error.message)
            return
        }

        navigate('/')
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
                    <h1 className="mt-6 text-2xl font-bold">Entrar na sua conta</h1>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                        Continue de onde parou
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
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                                E-mail
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-[var(--color-gray)] bg-[var(--color-deep)] py-2.5 pl-10 pr-4 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-[var(--color-gray)] bg-[var(--color-deep)] py-2.5 pl-10 pr-4 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link to="/login" className="text-xs text-[var(--color-accent)] hover:underline">

                                ... 