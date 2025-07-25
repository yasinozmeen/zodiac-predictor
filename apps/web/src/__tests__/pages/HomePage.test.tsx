import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from '../../pages/HomePage'

const renderHomePage = () => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <HomePage />
    </BrowserRouter>
  )
}

describe('HomePage Component', () => {
  it('renders hero section with main heading', () => {
    renderHomePage()

    expect(screen.getByText(/Kozmik Bağlantınızı/)).toBeInTheDocument()
    expect(screen.getByText(/Keşfedin/)).toBeInTheDocument()
  })

  it('displays call-to-action buttons', () => {
    renderHomePage()

    const startButton = screen.getByRole('link', { name: /yolculuğunuza başlayın/i })
    expect(startButton).toBeInTheDocument()
    expect(startButton).toHaveAttribute('href', '/survey')

    const learnMoreButton = screen.getByRole('link', { name: /daha fazla bilgi/i })
    expect(learnMoreButton).toBeInTheDocument()
  })

  it('shows features section', () => {
    renderHomePage()

    expect(screen.getByText(/Neden Zodiac Predictor/)).toBeInTheDocument()
    expect(screen.getByText(/AI Destekli Tahminler/)).toBeInTheDocument()
    expect(screen.getByText(/Uyumluluk Analizi/)).toBeInTheDocument()
    expect(screen.getByText(/Kişiselleştirilmiş Sonuçlar/)).toBeInTheDocument()
  })

  it('has accessible structure', () => {
    renderHomePage()

    // Check for semantic sections
    const sections = screen.getAllByRole('generic')
    expect(sections.length).toBeGreaterThan(0)

    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)
  })

  it('displays decorative elements', () => {
    renderHomePage()

    // Check for decorative emoji elements (they should be in the DOM)
    const decorativeElements = document.querySelectorAll('.absolute')
    expect(decorativeElements.length).toBeGreaterThan(0)
  })

  it('has final CTA section', () => {
    renderHomePage()

    expect(screen.getByText(/Yıldızlar Sizi Bekliyor/)).toBeInTheDocument()

    const finalCTAButton = screen.getByRole('link', { name: /hemen başla/i })
    expect(finalCTAButton).toBeInTheDocument()
    expect(finalCTAButton).toHaveAttribute('href', '/survey')
  })
})
