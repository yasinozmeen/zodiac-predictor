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

  it('displays header navigation with Turkish content', () => {
    renderApp()

    // Check for main navigation elements
    expect(screen.getByText('Zodiac Predictor')).toBeInTheDocument()
    expect(screen.getAllByText('Ana Sayfa')).toHaveLength(2) // Desktop and mobile menu
    expect(screen.getAllByText('Anket')).toHaveLength(2)
    expect(screen.getAllByText('Sonuçlar')).toHaveLength(2)
  })

  it('displays footer with Turkish content', () => {
    renderApp()

    expect(screen.getByText(/© 2025 Zodiac Predictor/)).toBeInTheDocument()
    expect(screen.getByText(/Yıldızlarla yapılmış/)).toBeInTheDocument()
  })

  it('shows welcome message on home page', async () => {
    renderApp()

    // Wait for lazy-loaded content
    await screen.findByText(/Kozmik Bağlantınızı/)
    expect(screen.getByText(/Keşfedin/)).toBeInTheDocument()
    expect(screen.getByText(/Yapay zeka destekli astrolojik öngörülerimiz/)).toBeInTheDocument()
  })

  it('has accessible navigation', () => {
    renderApp()

    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(nav).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    renderApp()

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
