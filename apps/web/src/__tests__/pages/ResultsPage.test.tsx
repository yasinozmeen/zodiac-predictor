import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ResultsPage from '../../pages/ResultsPage'

const renderResultsPage = () => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ResultsPage />
    </BrowserRouter>
  )
}

describe('ResultsPage Component', () => {
  it('renders main heading', () => {
    renderResultsPage()

    expect(screen.getByText(/Kozmik Profiliniz/)).toBeInTheDocument()
  })

  it('displays zodiac sign information', () => {
    renderResultsPage()

    expect(screen.getByText('Terazi')).toBeInTheDocument()
    expect(screen.getByText('23 Eylül - 22 Ekim')).toBeInTheDocument()
    expect(screen.getByText('%92 Güven')).toBeInTheDocument()
  })

  it('shows personality traits', () => {
    renderResultsPage()

    expect(screen.getByText('Ana Özellikler')).toBeInTheDocument()
    expect(screen.getByText('Diplomatik')).toBeInTheDocument()
    expect(screen.getByText('Sanatsal')).toBeInTheDocument()
    expect(screen.getByText('Sosyal')).toBeInTheDocument()
  })

  it('displays strengths', () => {
    renderResultsPage()

    expect(screen.getByText('Güçlü Yanlarınız')).toBeInTheDocument()
    expect(screen.getByText('Harika dinleyici')).toBeInTheDocument()
    expect(screen.getByText('Dengeli bakış açısı')).toBeInTheDocument()
    expect(screen.getByText('Doğal arabulucu')).toBeInTheDocument()
  })

  it('shows compatibility analysis', () => {
    renderResultsPage()

    expect(screen.getByText(/Uyumluluk Analiziniz/)).toBeInTheDocument()
    expect(screen.getByText('İkizler')).toBeInTheDocument()
    expect(screen.getByText('Kova')).toBeInTheDocument()
    expect(screen.getByText('Aslan')).toBeInTheDocument()

    expect(screen.getByText('%95')).toBeInTheDocument()
    expect(screen.getByText('%88')).toBeInTheDocument()
    expect(screen.getByText('%75')).toBeInTheDocument()
  })

  it('displays growth areas', () => {
    renderResultsPage()

    expect(screen.getByText(/Gelişim Alanlarınız/)).toBeInTheDocument()
    expect(screen.getByText('Kararsız')).toBeInTheDocument()
    expect(screen.getByText('Çatışmalardan kaçar')).toBeInTheDocument()
    expect(screen.getByText('Mükemmeliyetçi')).toBeInTheDocument()
  })

  it('provides action buttons', () => {
    renderResultsPage()

    const retakeButton = screen.getByRole('link', { name: /anketi tekrar al/i })
    expect(retakeButton).toBeInTheDocument()
    expect(retakeButton).toHaveAttribute('href', '/survey')

    const homeButton = screen.getByRole('link', { name: /ana sayfaya dön/i })
    expect(homeButton).toBeInTheDocument()
    expect(homeButton).toHaveAttribute('href', '/')

    const printButton = screen.getByText(/Sonuçları Yazdır/)
    expect(printButton).toBeInTheDocument()
  })

  it('has proper responsive layout', () => {
    renderResultsPage()

    const container = screen.getByText(/Kozmik Profiliniz/).parentElement?.parentElement
    expect(container).toHaveClass('max-w-6xl')
    expect(container).toHaveClass('mx-auto')
  })

  it('includes zodiac icon', () => {
    renderResultsPage()

    expect(screen.getByText('⚖️')).toBeInTheDocument()
  })
})
