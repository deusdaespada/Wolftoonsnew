import { Link } from 'react-router-dom'
import { BookOpen, Flame, Star, Sparkles, Trophy, Crown } from 'lucide-react'
import { TitleBanner } from '@/components/titles/TitleBanner'
import { TitleSection } from '@/components/titles/TitleSection'
import {
  useFeaturedTitles,
  usePopularTitles,
  useLatestUpdates,
  useTopRated,
  useCompletedTitles,
  useOngoingTitles,
  useNovels,
} from '@/features/titles/hooks'

const QUICK_LINKS = [
  { to: '/catalog?category=manhwa', label: 'Manhwa', icon: BookOpen },
  { to: '/catalog?category=manhua', label: 'Manhua', icon: BookOpen },
  { to: '/catalog?category=manga', label: 'Mangá', icon: BookOpen },
  { to: '/catalog?category=webtoon', label: 'Webtoon', icon: Sparkles },
  { to: '/novels', label: 'Novels', icon: BookOpen },
  { to: '/ranking', label: 'Ranking', icon: Trophy },
  { to: '/catalog?sort=updated', label: 'Atualizados', icon: Flame },
  { to: '/vip', label: 'VIP', icon: Crown },
]

export function HomePage() {
  const featured = useFeaturedTitles(5)
  const popular = usePopularTitles(12)
  const latest = useLatestUpdates(12)
  const topRated = useTopRated(12)
  const completed = useCompletedTitles(12)
  const ongoing = useOngoingTitles(12)
  const novels = useNovels(12)

  return (
    <div className="animate-fade-in">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-hero-glow" />

      <section className="relative page-container pt-6">
        <TitleBanner titles={featured.data ?? []} isLoading={featured.isLoading} />
      </section>

      {/* Quick categories */}
      <section className="relative page-container mt-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex shrink-0 items-center gap-2 rounded-full border border-wolf-gray/40 bg-wolf-graphite/60 px-4 py-2 text-sm font-medium text-wolf-white/70 backdrop-blur transition-all hover:border-wolf-ice/40 hover:bg-wolf-ice/10 hover:text-wolf-ice"
            >
              <item.icon className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="relative page-container space-y-14 py-10">
        <TitleSection
          title="Atualizações recentes"
          subtitle="Últimos capítulos publicados"
          titles={latest.data ?? []}
          isLoading={latest.isLoading}
          viewAllHref="/latest"
        />

        <TitleSection
          title="Mais populares"
          subtitle="As obras mais lidas da plataforma"
          titles={popular.data ?? []}
          isLoading={popular.isLoading}
          viewAllHref="/catalog?sort=popularity"
        />

        <TitleSection
          title="Melhores avaliações"
          subtitle="Obras com as notas mais altas"
          titles={topRated.data ?? []}
          isLoading={topRated.isLoading}
          viewAllHref="/catalog?sort=rating"
        />

        {/* Mid-page CTA */}
        <div className="relative overflow-hidden rounded-2xl border border-wolf-ice/20 bg-gradient-to-r from-wolf-deep/80 via-wolf-graphite to-wolf-graphite p-6 sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-wolf-ice/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-wolf-ice">
                <Star className="h-5 w-5 fill-wolf-ice" />
                <span className="text-sm font-semibold uppercase tracking-wider">Destaque</span>
              </div>
              <h3 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                Explore o catálogo completo
              </h3>
              <p className="mt-1 max-w-md text-sm text-wolf-white/50">
                Filtre por gênero, status e avaliação. Encontre a próxima história para devorar.
              </p>
            </div>
            <Link
              to="/catalog"
              className="shrink-0 rounded-xl bg-wolf-ice px-5 py-2.5 text-sm font-bold text-wolf-black shadow-wolf transition-all hover:bg-wolf-ice/90 hover:shadow-wolf-lg"
            >
              Abrir catálogo
            </Link>
          </div>
        </div>

        <TitleSection
          title="Em andamento"
          subtitle="Obras sendo atualizadas regularmente"
          titles={ongoing.data ?? []}
          isLoading={ongoing.isLoading}
          viewAllHref="/catalog?status=ongoing"
        />

        <TitleSection
          title="Novels em destaque"
          subtitle="Light Novels e Web Novels"
          titles={novels.data ?? []}
          isLoading={novels.isLoading}
          viewAllHref="/novels"
        />

        <TitleSection
          title="Obras concluídas"
          subtitle="Histórias finalizadas para maratonar"
          titles={completed.data ?? []}
          isLoading={completed.isLoading}
          viewAllHref="/catalog?status=completed"
        />
      </div>
    </div>
  )
}
