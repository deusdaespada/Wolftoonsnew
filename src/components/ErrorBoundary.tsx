import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[WOLFTOON] Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-wolf-black px-4 text-center">
          <h1 className="font-display text-2xl font-bold text-wolf-white">
            Algo deu errado
          </h1>
          <p className="mt-2 max-w-md text-sm text-wolf-white/50">
            Ocorreu um erro inesperado. Recarregue a página. Se o problema continuar,
            tente novamente mais tarde.
          </p>
          {this.state.message && (
            <p className="mt-4 max-w-lg rounded-lg bg-wolf-graphite px-3 py-2 font-mono text-xs text-red-300/80">
              {this.state.message}
            </p>
          )}
          <button
            onClick={() => window.location.assign('/')}
            className="mt-6 rounded-lg bg-wolf-ice px-4 py-2.5 text-sm font-semibold text-wolf-black"
          >
            Voltar ao início
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
