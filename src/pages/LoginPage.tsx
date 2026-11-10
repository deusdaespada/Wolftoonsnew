import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { signInWithEmail, signInWithOAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error } = await signInWithEmail(email, password)
    
    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'E-mail ou senha incorretos' 
        : error.message)
      setIsLoading(false)
      return
    }

    navigate(from, { replace: true })
  }

  const handleOAuth = async (provider: 'google' | 'discord') => {
    setError('')
    const { error } = await signInWithOAuth(provider)
    if (error) setError(error.message)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-wolf-ice/20">
            <span className="font-display text-2xl font-bold text-wolf-ice">W</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Entrar na conta</h1>
          <p className="mt-2 text-sm text-wolf-white/50">
            Acesse sua biblioteca e continue de onde parou
          </p>
        </div>

        <div className="rounded-2xl border border-wolf-gray/40 bg-wolf-graphite p-6 shadow-wolf sm:p-8">
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              type="password"
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-wolf-ice hover:underline">
                Esqueceu a senha?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Entrar
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-wolf-gray/50" />
            <span className="text-xs text-wolf-white/40">ou continue com</span>
            <div className="h-px flex-1 bg-wolf-gray/50" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" type="button" onClick={() => handleOAuth('google')}>
              Google
            </Button>
            <Button variant="secondary" type="button" onClick={() => handleOAuth('discord')}>
              Discord
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-wolf-white/50">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-medium text-wolf-ice hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
