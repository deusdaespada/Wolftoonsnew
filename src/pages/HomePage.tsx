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
      {/* Hero Banner */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <TitleBanner titles={featured.data ?? []} isLoading={featured.isLoading} />
      </section>

      {/* Content sections */}
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
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
