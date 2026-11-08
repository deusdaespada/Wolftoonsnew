import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Catalog } from '@/pages/Catalog'
import { Placeholder } from '@/pages/Placeholder'
import { useAuthStore } from '@/stores/authStore'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 2,
            retry: 1,
        },
    },
})

function AuthInitializer({ children }: { children: React.ReactNode }) {
    const initialize = useAuthStore((s) => s.initialize)
    const loading = useAuthStore((s) => s.loading)

    useEffect(() => {
        initialize()
    }, [initialize])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-deep)]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
            </div>
        )
    }

    return <>{children}</>
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthInitializer>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/catalog" element={<Catalog />} />
                            <Route path="/latest" element={<Placeholder title="Novidades" />} />
                            <Route path="/ranking" element={<Placeholder title="Ranking" />} />
                            <Route path="/novels" element={<Placeholder title="Novels" />} />
                            <Route path="/library" element={<Placeholder title="Biblioteca" />} />
                            <Route path="/favorites" element={<Placeholder title="Favoritos" />} />
                            <Route path="/history" element={<Placeholder title="Histórico" />} />
                            <Route path="/vip" element={<Placeholder title="VIP" />} />
                            <Route path="/community" element={<Placeholder title="Comunidade" />} />
                            <Route path="/settings" element={<Placeholder title="Configurações" />} />
                            <Route path="/profile/:username" element={<Placeholder title="Perfil" />} />
                            <Route path="/title/:slug" element={<Placeholder title="Obra" />} />
                            <Route path="/read/:slug/:chapter" element={<Placeholder title="Leitor" />} />
                            <Route path="/admin" element={<Placeholder title="Admin" />} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </AuthInitializer>
            </BrowserRouter>
        </QueryClientProvider>
    )
}
