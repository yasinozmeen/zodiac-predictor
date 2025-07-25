import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import { lazy } from 'react'
import Layout from './components/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'
import ErrorBoundary from './components/error/ErrorBoundary'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const SurveyPage = lazy(() => import('./pages/SurveyPage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/survey" element={<SurveyPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ErrorBoundary>
  )
}

export default App
