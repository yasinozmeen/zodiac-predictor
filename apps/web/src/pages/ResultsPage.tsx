import React from 'react'
import { Link } from 'react-router-dom'

const ResultsPage: React.FC = () => {
  // Mock data - will be replaced with real API data
  const mockResults = {
    zodiacSign: 'Libra',
    compatibility: [
      { sign: 'Gemini', percentage: 95, description: 'Perfect intellectual match' },
      { sign: 'Aquarius', percentage: 88, description: 'Great creative synergy' },
      { sign: 'Leo', percentage: 75, description: 'Dynamic and exciting' },
    ],
    personality: {
      traits: ['Diplomatic', 'Artistic', 'Social'],
      strengths: ['Great listener', 'Balanced perspective', 'Natural mediator'],
      challenges: ['Indecisive', 'Avoids conflict', 'Perfectionist'],
    },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary-900">Your Cosmic Profile ✨</h1>
        <p className="mt-4 text-lg text-secondary-600">
          Here are your personalized astrological insights
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Zodiac Sign Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-secondary-200">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚖️</div>
            <h2 className="text-2xl font-bold text-primary-600">{mockResults.zodiacSign}</h2>
            <p className="text-secondary-600 mt-2">September 23 - October 22</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-secondary-900 mb-2">Key Traits</h3>
              <div className="flex flex-wrap gap-2">
                {mockResults.personality.traits.map(trait => (
                  <span
                    key={trait}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-secondary-900 mb-2">Strengths</h3>
              <ul className="text-secondary-600 space-y-1">
                {mockResults.personality.strengths.map(strength => (
                  <li key={strength} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Compatibility Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-secondary-200">
          <h2 className="text-xl font-bold text-secondary-900 mb-6">💕 Compatibility Matches</h2>

          <div className="space-y-4">
            {mockResults.compatibility.map(match => (
              <div key={match.sign} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-secondary-900">{match.sign}</h3>
                  <span className="text-primary-600 font-bold">{match.percentage}%</span>
                </div>
                <div className="bg-secondary-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${match.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-secondary-600">{match.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-secondary-200 lg:col-span-2">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">🌱 Areas for Growth</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {mockResults.personality.challenges.map(challenge => (
              <div
                key={challenge}
                className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200"
              >
                <span className="text-orange-600 font-medium">{challenge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link to="/survey" className="btn-primary px-8 py-3 mr-4">
          Take Survey Again
        </Link>
        <Link to="/" className="btn-secondary px-8 py-3">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default ResultsPage
