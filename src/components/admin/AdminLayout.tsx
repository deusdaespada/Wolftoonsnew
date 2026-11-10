import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Flag,
  Settings,
  ScrollText,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/titles', label: 'Obras', icon: BookOpen },
  { to: '/admin/users', label: 'Usuários', icon: Users },
  { to: '/admin/reports', label: 'Denúncias', icon: Flag },
  { to: '/admin/settings', label: 'Configurações', icon: Settings },
  { to: '/admin/logs', label: 'Logs', icon: ScrollText },
]

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavItems = (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-wolf-ice/20 text-wolf-ice'
                : 'text-wolf-white/60 hover:bg-wolf-gray/40 hover:text-wolf-white'
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-wolf-black">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-wolf-gray/40 bg-wolf-graphite lg:block">
        <div className="flex h-14 items-center gap-2 border-b border-wolf-gray/40 px-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-wolf-white/60 hover:text-wolf-ice">
            <ArrowLeft className="h-4 w-4" />
            Site
          </Link>
        </div>
        <div className="px-4 py-3">
          <p className="font-display text-sm font-bold text-wolf-ice">ADMIN</p>
        </div>
        {NavItems}
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center justify-between border-b border-wolf-gray/40 bg-wolf-graphite px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-wolf-white/70 hover:bg-wolf-gray/40"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-display text-sm font-bold text-wolf-ice">ADMIN</span>
          <Link to="/" className="text-xs text-wolf-white/50">
            Site
          </Link>
        </header>

        {mobileOpen && (
          <div className="border-b border-wolf-gray/40 bg-wolf-graphite lg:hidden">
            {NavItems}
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
