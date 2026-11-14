import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  {
    title: 'Explorar',
    links: [
      { to: '/catalog', label: 'Catálogo' },
      { to: '/ranking', label: 'Ranking' },
      { to: '/novels', label: 'Novels' },
      { to: '/community', label: 'Comunidade' },
    ],
  },
  {
    title: 'Conta',
    links: [
      { to: '/library', label: 'Biblioteca' },
      { to: '/favorites', label: 'Favoritos' },
      { to: '/history', label: 'Histórico' },
      { to: '/vip', label: 'VIP' },
    ],
  },
  {
    title: 'Plataforma',
    links: [
      { to: '/login', label: 'Entrar' },
      { to: '/register', label: 'Criar conta' },
      { to: '/settings', label: 'Configurações' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-wolf-gray/30 bg-wolf-graphite/50">
      <div className="page-container py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-wolf-ice to-sky-400">
                <span className="font-display text-sm font-bold text-wolf-black">W</span>
              </div>
              <span className="font-display text-base font-semibold">
                WOLFTOON <span className="text-wolf-ice">NEW</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-wolf-white/40">
              Plataforma de leitura de manhwas, manhuas, mangás, webtoons e novels.
              Design escuro, leitura imersiva.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
                {group.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-wolf-white/45 transition-colors hover:text-wolf-ice"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-wolf-gray/30 pt-6 sm:flex-row">
          <p className="text-xs text-wolf-white/30">
            © {new Date().getFullYear()} WOLFTOON NEW. Todos os direitos reservados.
          </p>
          <p className="text-xs text-wolf-white/25">
            Feito para leitores · Dark mode nativo
          </p>
        </div>
      </div>
    </footer>
  )
}
