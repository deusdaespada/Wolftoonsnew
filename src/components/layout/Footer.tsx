import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-wolf-gray/40 bg-wolf-graphite">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-wolf-ice/20">
                <span className="font-display text-sm font-bold text-wolf-ice">W</span>
              </div>
              <span className="font-display font-semibold">
                WOLFTOON <span className="text-wolf-ice">NEW</span>
              </span>
            </div>
            <p className="text-sm text-wolf-white/50">
              Plataforma profissional de leitura de Manhwas, Manhuas, Mangás, Webtoons e Novels.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-wolf-white">Navegação</h4>
            <ul className="space-y-2 text-sm text-wolf-white/60">
              <li><Link to="/catalog" className="hover:text-wolf-ice transition-colors">Catálogo</Link></li>
              <li><Link to="/latest" className="hover:text-wolf-ice transition-colors">Novidades</Link></li>
              <li><Link to="/ranking" className="hover:text-wolf-ice transition-colors">Ranking</Link></li>
              <li><Link to="/novels" className="hover:text-wolf-ice transition-colors">Novels</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-wolf-white">Conta</h4>
            <ul className="space-y-2 text-sm text-wolf-white/60">
              <li><Link to="/library" className="hover:text-wolf-ice transition-colors">Biblioteca</Link></li>
              <li><Link to="/favorites" className="hover:text-wolf-ice transition-colors">Favoritos</Link></li>
              <li><Link to="/vip" className="hover:text-wolf-ice transition-colors">VIP</Link></li>
              <li><Link to="/settings" className="hover:text-wolf-ice transition-colors">Configurações</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-wolf-white">Comunidade</h4>
            <ul className="space-y-2 text-sm text-wolf-white/60">
              <li><Link to="/community" className="hover:text-wolf-ice transition-colors">Discussões</Link></li>
              <li><a href="#" className="hover:text-wolf-ice transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-wolf-ice transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-wolf-ice transition-colors">Privacidade</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-wolf-gray/40 pt-6 text-center text-xs text-wolf-white/40">
          © {new Date().getFullYear()} WOLFTOON NEW. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
