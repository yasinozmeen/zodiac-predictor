import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../../components/common/LoadingSpinner'

describe('LoadingSpinner Component', () => {
  it('renders with default size', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute('aria-label', 'Yükleniyor')
  })

  it('renders with small size', () => {
    render(<LoadingSpinner size="sm" />)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-4', 'h-4')
  })

  it('renders with large size', () => {
    render(<LoadingSpinner size="lg" />)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-12', 'h-12')
  })

  it('applies custom className', () => {
    render(<LoadingSpinner className="my-custom-class" />)

    const container = screen.getByRole('status').parentElement
    expect(container).toHaveClass('my-custom-class')
  })

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Yükleniyor')

    const srText = screen.getByText('Yükleniyor...')
    expect(srText).toHaveClass('sr-only')
  })
})
