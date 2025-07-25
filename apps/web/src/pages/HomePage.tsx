import React from 'react'
import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-secondary-900 sm:text-6xl">
          Discover Your
          <span className="text-primary-500"> Cosmic Connection</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-secondary-600 max-w-2xl mx-auto">
          Unlock the secrets of zodiac compatibility and discover your personality traits through
          our AI-powered astrological insights. Take our comprehensive survey to get personalized
          predictions.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/survey" className="btn-primary px-8 py-3 text-lg">
            Start Your Journey
          </Link>
          <a
            href="#features"
            className="text-lg font-semibold leading-6 text-secondary-900 hover:text-primary-600 transition-colors"
          >
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div id="features" className="mt-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-4xl">🔮</div>
            <h3 className="mt-6 text-lg font-semibold text-secondary-900">
              AI-Powered Predictions
            </h3>
            <p className="mt-2 text-secondary-600">
              Advanced algorithms analyze your responses to provide accurate personality insights.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-4xl">💫</div>
            <h3 className="mt-6 text-lg font-semibold text-secondary-900">
              Compatibility Analysis
            </h3>
            <p className="mt-2 text-secondary-600">
              Discover how compatible you are with different zodiac signs and personalities.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-4xl">✨</div>
            <h3 className="mt-6 text-lg font-semibold text-secondary-900">Personalized Results</h3>
            <p className="mt-2 text-secondary-600">
              Get detailed, personalized reports tailored to your unique astrological profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
