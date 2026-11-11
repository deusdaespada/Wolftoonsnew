import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Search, User, LogOut, Settings, BookOpen, Heart, History, Crown } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { NotificationBell } from '@/components/comments/NotificationBell'

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/catalog', label: 'Catálogo' },
  { to: '/latest', label: 'Novidades' },
  { to: '/ranking', label: 'Ranking' },
  { to: '/novels', label: 'Novels' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, signOut, isStaff } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-wolf-gray/40 bg-wolf-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-wolf-ice/20">
            <span className="font-display text-lg font-bold text-wolf-ice">W</span>
          </div>
          <span className="hidden font-display text-lg font-semibold tracking-tight sm:block">
            WOLFTOON <span className="text-wolf-ice">NEW</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-wolf-white/70 transition-colors hover:bg-wolf-gray/40 hover:text-wolf-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            to="/catalog"
            className="rounded-lg p-2 text-wolf-white/70 transition-colors hover:bg-wolf-gray/40 hover:text-wolf-white"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </Link>

          <NotificationBell />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-wolf-gray/40"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-wolf-ice/30"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wolf-gray">
                    <User className="h-4 w-4 text-wolf-white/70" />
                  </div>
                )}
                {profile?.is_vip && (
                  <Crown className="h-4 w-4 text-amber-400" />
                )}
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right animate-scale-in rounded-xl border border-wolf-gray/50 bg-wolf-graphite p-2 shadow-wolf-lg">
                    <div className="border-b border-wolf-gray/40 px-3 py-2">
                      <p className="text-sm font-semibold text-wolf-white">
                        {profile?.display_name || profile?.username}
                      </p>
                      <p className="text-xs text-wolf-white/50">@{profile?.username}</p>
                    </div>
                    <div className="py-1">
                      <MenuLink to={`/profile/${profile?.username}`} icon={User} onClick={() => setUserMenuOpen(false)}>
                        Meu Perfil
                      </MenuLink>
                      <MenuLink to="/library" icon={BookOpen} onClick={() => setUserMenuOpen(false)}>
                        Biblioteca
                      </MenuLink>
                      <MenuLink to="/favorites" icon={Heart} onClick={() => setUserMenuOpen(false)}>
                        Favoritos
                      </MenuLink>
                      <MenuLink to="/history" icon={History} onClick={() => setUserMenuOpen(false)}>
                        Histórico
                      </MenuLink>
                      <MenuLink to="/settings" icon={Settings} onClick={() => setUserMenuOpen(false)}>
                        Configurações
                      </MenuLink>
                      {isStaff() && (
                        <MenuLink to="/admin" icon={Settings} onClick={() => setUserMenuOpen(false)}>
                          Administração
                        </MenuLink>
                      )}
                    </div>
                    <div className="border-t border-wolf-gray/40 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Criar conta
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="rounded-lg p-2 text-wolf-white/70 transition-colors hover:bg-wolf-gray/40 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-wolf-gray/40 bg-wolf-graphite md:hidden animate-slide-up">
          <nav className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-wolf-white/80 transition-colors hover:bg-wolf-gray/40 hover:text-wolf-white"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="mt-2 flex flex-col gap-2 border-t border-wolf-gray/40 pt-3">
                <Button variant="secondary" onClick={() => { setMobileOpen(false); navigate('/login') }}>
                  Entrar
                </Button>
                <Button onClick={() => { setMobileOpen(false); navigate('/register') }}>
                  Criar conta
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

function MenuLink({
  to,
  icon: Icon,
  children,
  onClick,
}: {
  to: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-wolf-white/80 transition-colors hover:bg-wolf-gray/40 hover:text-wolf-white"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  )
}
