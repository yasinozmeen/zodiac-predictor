import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotFoundPage from '../../pages/NotFoundPage'

const renderNotFoundPage = () => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <NotFoundPage />
    </BrowserRouter>
  )
}

describe('NotFoundPage Component', () => {
  it('renders 404 error message', () => {
    renderNotFoundPage()

    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('Sayfa Bulunamadı')).toBeInTheDocument()
  })

  it('displays helpful error message', () => {
    renderNotFoundPage()

    expect(
      screen.getByText(/Aradığınız sayfa mevcut değil ya da taşınmış olabilir/)
    ).toBeInTheDocument()
  })

  it('provides navigation back to home', () => {
    renderNotFoundPage()

    const homeLink = screen.getByRole('link', { name: /ana sayfaya dön/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('has proper styling and theme', () => {
    renderNotFoundPage()

    const container = screen.getByText('404').parentElement?.parentElement
    expect(container).toHaveClass('min-h-screen')
    expect(container).toHaveClass('bg-gradient-to-br')
  })

  it('has accessible button', () => {
    renderNotFoundPage()

    const homeButton = screen.getByRole('link', { name: /ana sayfaya dön/i })
    expect(homeButton).toHaveClass('inline-flex', 'items-center')
    expect(homeButton).toHaveClass('bg-primary-pink')
  })
})
