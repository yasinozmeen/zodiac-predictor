import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SurveyPage from '../../pages/SurveyPage'

const renderSurveyPage = () => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <SurveyPage />
    </BrowserRouter>
  )
}

describe('SurveyPage Component', () => {
  it('renders initial step with progress indicator', () => {
    renderSurveyPage()

    expect(screen.getByText('Zodiac Anketi')).toBeInTheDocument()
    expect(screen.getByText('Adım 1 / 3')).toBeInTheDocument()
    expect(screen.getByText(/Doğum Bilgileriniz/)).toBeInTheDocument()
  })

  it('shows birth information form on step 1', () => {
    renderSurveyPage()

    expect(screen.getByLabelText(/doğum tarihi/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/doğum saati/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/doğum yeri/i)).toBeInTheDocument()
  })

  it('navigates to next step when clicking next button', async () => {
    renderSurveyPage()

    // Fill required fields
    const birthDateInput = screen.getByLabelText(/doğum tarihi/i)
    const birthLocationInput = screen.getByLabelText(/doğum yeri/i)

    fireEvent.change(birthDateInput, { target: { value: '1990-01-01' } })
    fireEvent.change(birthLocationInput, { target: { value: 'Istanbul' } })

    const nextButton = screen.getByRole('button', { name: /sonraki/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Adım 2 / 3')).toBeInTheDocument()
      expect(screen.getByText(/Kişilik Özellikleriniz/)).toBeInTheDocument()
    })
  })

  it('shows personality form on step 2', async () => {
    renderSurveyPage()

    // Navigate to step 2
    const birthDateInput = screen.getByLabelText(/doğum tarihi/i)
    const birthLocationInput = screen.getByLabelText(/doğum yeri/i)

    fireEvent.change(birthDateInput, { target: { value: '1990-01-01' } })
    fireEvent.change(birthLocationInput, { target: { value: 'Istanbul' } })

    const nextButton = screen.getByRole('button', { name: /sonraki/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/kendinizi nasıl tanımlarsınız/i)).toBeInTheDocument()
    })
  })

  it('shows interests selection on step 3', async () => {
    renderSurveyPage()

    // Navigate to step 3
    const birthDateInput = screen.getByLabelText(/doğum tarihi/i)
    const birthLocationInput = screen.getByLabelText(/doğum yeri/i)

    fireEvent.change(birthDateInput, { target: { value: '1990-01-01' } })
    fireEvent.change(birthLocationInput, { target: { value: 'Istanbul' } })

    let nextButton = screen.getByRole('button', { name: /sonraki/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      const personalityInput = screen.getByLabelText(/kendinizi nasıl tanımlarsınız/i)
      fireEvent.change(personalityInput, { target: { value: 'Test personality' } })
    })

    nextButton = screen.getByRole('button', { name: /sonraki/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Adım 3 / 3')).toBeInTheDocument()
      expect(screen.getByText(/Son Sorular/)).toBeInTheDocument()
      expect(screen.getByText(/Ana ilgi alanlarınız/)).toBeInTheDocument()
    })
  })

  it('allows going back to previous steps', async () => {
    renderSurveyPage()

    // Navigate to step 2
    const birthDateInput = screen.getByLabelText(/doğum tarihi/i)
    const birthLocationInput = screen.getByLabelText(/doğum yeri/i)

    fireEvent.change(birthDateInput, { target: { value: '1990-01-01' } })
    fireEvent.change(birthLocationInput, { target: { value: 'Istanbul' } })

    const nextButton = screen.getByRole('button', { name: /sonraki/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Adım 2 / 3')).toBeInTheDocument()
    })

    // Go back to step 1
    const prevButton = screen.getByRole('button', { name: /önceki/i })
    fireEvent.click(prevButton)

    await waitFor(() => {
      expect(screen.getByText('Adım 1 / 3')).toBeInTheDocument()
    })
  })

  it('has accessible form elements', () => {
    renderSurveyPage()

    // Check for proper labels
    expect(screen.getByLabelText(/doğum tarihi/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/doğum saati/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/doğum yeri/i)).toBeInTheDocument()

    // Check for required field validation
    const birthDateInput = screen.getByLabelText(/doğum tarihi/i)
    expect(birthDateInput).toBeRequired()

    const birthLocationInput = screen.getByLabelText(/doğum yeri/i)
    expect(birthLocationInput).toBeRequired()
  })
})
