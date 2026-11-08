import { Link } from 'react-router-dom'
import { BookOpen, TrendingUp, Clock, Star } from 'lucide-react'

export function Home() {
    return (
        <div className="pb-12">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-[var(--color-gray)] bg-gradient-to-b from-[var(--color-accent-deep)]/40 to-[var(--color-deep)]">
                <div className="container-app py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
                            Sua próxima leitura{' '}
                            <span className="text-[var(--color-accent)]">começa aqui</span>
                        </h1>
                        <p className="mt-4 text-lg text-[var(--color-muted)]">
                            Manhwas, Manhuas, Mangás, Webtoons e Novels em uma plataforma moderna, rápida e feita para leitores.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/catalog" className="btn-primary inline-flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Explorar catálogo
                            </Link>
                            <Link
                                to="/latest"
                                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-gray)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--color-gray)]"
                            >
                                Ver novidades
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick sections placeholders */}
            <section className="container-app mt-12">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                        <TrendingUp className="h-5 w-5 text-[var(--color-accent)]" />
                        Populares
                    </h2>
                    <Link to="/ranking" className="text-sm text-[var(--color-accent)] hover:underline">
                        Ver ranking
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="card overflow-hidden">
                            <div className="aspect-[2/3] bg-[var(--color-gray)] animate-pulse" />
                            <div className="p-3">
                                <div className="h-4 w-3/4 rounded bg-[var(--color-gray)] animate-pulse" />
                                <div className="mt-2 h-3 w-1/2 rounded bg-[var(--color-gray)] animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container-app mt-12">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                        <Clock className="h-5 w-5 text-[var(--color-accent)]" />
                        Atualizações recentes
                    </h2>
                    <Link to="/latest" className="text-sm text-[var(--color-accent)] hover:underline">
                        Ver todas
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="card overflow-hidden">
                            <div className="aspect-[2/3] bg-[var(--color-gray)] animate-pulse" />
                            <div className="p-3">
                                <div className="h-4 w-3/4 rounded bg-[var(--color-gray)] animate-pulse" />
                                <div className="mt-2 h-3 w-1/2 rounded bg-[var(--color-gray)] animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container-app mt-12">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                        <Star className="h-5 w-5 text-[var(--color-accent)]" />
                        Recomendados
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {Array.from({
                        length: 6 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ... 