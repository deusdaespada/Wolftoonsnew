import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { signUpWithEmail, signInWithOAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      setError('Username deve ter 3-30 caracteres (letras, números e _)')
      return
    }

    setIsLoading(true)
    const { error } = await signUpWithEmail(email, password, username)
    
    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  const handleOAuth = async (provider: 'google' | 'discord') => {
    setError('')
    const { error } = await signInWithOAuth(provider)
    if (error) setError(error.message)
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6 text-center animate-fade-in">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold">Conta criada!</h1>
          <p className="text-wolf-white/60">
            Enviamos um e-mail de confirmação para <strong>{email}</strong>. 
            Verifique sua caixa de entrada para ativar a conta.
          </p>
          <Button onClick={() => navigate('/login')}>Ir para o Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-wolf-ice/20">
            <span className="font-display text-2xl font-bold text-wolf-ice">W</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Criar conta</h1>
          <p className="mt-2 text-sm text-wolf-white/50">
            Junte-se à comunidade WOLFTOON NEW
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
              id="username"
              type="text"
              label="Nome de usuário"
              placeholder="seu_username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              autoComplete="username"
            />
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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <Input
              id="confirmPassword"
              type="password"
              label="Confirmar senha"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Criar conta
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
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-wolf-ice hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
