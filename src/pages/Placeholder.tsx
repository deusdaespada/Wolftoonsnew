import { useLocation } from 'react-router-dom'

export function Placeholder({ title }: { title?: string }) {
    const location = useLocation()
    const pageTitle = title || location.pathname.replace('/', '') || 'Página'

    return (
        <div className="container-app py-10">
            <h1 className="text-2xl font-bold capitalize">{pageTitle}</h1>
            <p className="mt-2 text-[var(--color-muted)]">
                Esta página será implementada nas próximas etapas.
            </p>
        </div>
    )
}
