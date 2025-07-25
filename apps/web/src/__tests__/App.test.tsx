import { render, screen } from '@testing-library/react'
import App from '../App'

// Helper to render App - App already includes Router
const renderApp = () => {
  return render(<App />)
}

describe('App Component', () => {
  it('renders without crashing', () => {
    renderApp()
    expect(document.body).toBeInTheDocument()
  })

  it('displays header navigation', () => {
    renderApp()

    // Check for main navigation elements
    expect(screen.getByText('✨ Zodiac Predictor')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Take Survey')).toBeInTheDocument()
  })

  it('displays footer', () => {
    renderApp()

    expect(screen.getByText(/© 2025 Zodiac Predictor/)).toBeInTheDocument()
  })

  it('shows welcome message on home page', () => {
    renderApp()

    expect(screen.getByText('Discover Your')).toBeInTheDocument()
    expect(screen.getByText('Cosmic Connection')).toBeInTheDocument()
    expect(screen.getByText(/Unlock the secrets of zodiac compatibility/)).toBeInTheDocument()
  })
})
