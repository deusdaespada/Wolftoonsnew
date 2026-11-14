import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  Search,
  BookMarked,
  Heart,
  History,
  Settings,
  LogOut,
  Shield,
  User,
  Crown,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { NotificationBell } from '@/components/comments/NotificationBell'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Início', end: true },
  { to: '/catalog', label: 'Catálogo' },
  { to: '/ranking', label: 'Ranking' },
  { to: '/community', label: 'Comunidade' },
  { to: '/novels', label: 'Novels' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, isStaff, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-lg px-3 py-2 text-sm font-medium transition-all',
      isActive
        ? 'bg-wolf-ice/15 text-wolf-ice'
        : 'text-wolf-white/65 hover:bg-wolf-gray/40 hover:text-wolf-white'
    )

  return (
    <header className="sticky top-0 z-40 border-b border-wolf-gray/30 bg-wolf-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-wolf-ice to-sky-400 shadow-wolf transition-transform group-hover:scale-105">
            <span className="font-display text-lg font-bold text-wolf-black">W</span>
          </div>
          <span className="hidden font-display text-lg font-semibold tracking-tight sm:block">
            WOLFTOON <span className="text-gradient">NEW</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link
            to="/catalog"
            className="rounded-lg p-2 text-wolf-white/60 transition-colors hover:bg-wolf-gray/40 hover:text-wolf-white"
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
                    alt=""
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-wolf-gray/50"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wolf-gray ring-2 ring-wolf-gray/50">
                    <User className="h-4 w-4 text-wolf-white/50" />
                  </div>
                )}
                {profile?.is_vip && (
                  <Crown className="hidden h-3.5 w-3.5 text-amber-400 sm:block" />
                )}
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right animate-scale-in rounded-xl border border-wolf-gray/50 bg-wolf-graphite py-1.5 shadow-wolf-lg">
                    <div className="border-b border-wolf-gray/40 px-4 py-2.5">
                      <p className="truncate text-sm font-semibold">
                        {profile?.display_name || profile?.username}
                      </p>
                      <p className="truncate text-xs text-wolf-white/40">@{profile?.username}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { to: '/library', icon: BookMarked, label: 'Biblioteca' },
                        { to: '/favorites', icon: Heart, label: 'Favoritos' },
                        { to: '/history', icon: History, label: 'Histórico' },
                        { to: '/settings', icon: Settings, label: 'Configurações' },
                        { to: '/vip', icon: Crown, label: 'VIP' },
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-wolf-white/70 hover:bg-wolf-gray/40 hover:text-wolf-white"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                      {isStaff() && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-wolf-ice hover:bg-wolf-ice/10"
                        >
                          <Shield className="h-4 w-4" />
                          Administração
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-wolf-gray/40 py-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
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
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Criar conta</Button>
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-wolf-white/70 hover:bg-wolf-gray/40 md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="animate-slide-up border-t border-wolf-gray/30 bg-wolf-graphite/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-0.5 px-4 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={navClass}
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2 border-t border-wolf-gray/30 pt-3">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">
                    Criar conta
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
