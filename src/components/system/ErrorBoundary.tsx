import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[TaskFlow Pro] Unhandled render error', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-neutral-100">
        <section className="w-full max-w-lg rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-modal">
          <p className="text-xs font-bold uppercase tracking-wider text-red-300">Application Error</p>
          <h1 className="mt-3 text-2xl font-bold text-white">Something went wrong.</h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            The interface hit an unexpected render error. In production this is where we would
            report the exception to monitoring and keep the rest of the app isolated.
          </p>

          {this.state.message && (
            <pre className="mt-4 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-300">
              {this.state.message}
            </pre>
          )}

          <button
            type="button"
            onClick={this.handleReset}
            className="mt-5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-primary-500"
          >
            Try Again
          </button>
        </section>
      </div>
    )
  }
}
