import React from 'react'
import { Link } from 'react-router-dom'

const ResultsPage: React.FC = () => {
  // Mock data - will be replaced with real API data
  const mockResults = {
    zodiacSign: 'Terazi',
    zodiacIcon: '⚖️',
    dateRange: '23 Eylül - 22 Ekim',
    compatibility: [
      { sign: 'İkizler', percentage: 95, description: 'Mükemmel zihinsel uyum', icon: '♊' },
      { sign: 'Kova', percentage: 88, description: 'Harika yaratıcı sinerji', icon: '♒' },
      { sign: 'Aslan', percentage: 75, description: 'Dinamik ve heyecan verici', icon: '♌' },
    ],
    personality: {
      traits: ['Diplomatik', 'Sanatsal', 'Sosyal'],
      strengths: ['Harika dinleyici', 'Dengeli bakış açısı', 'Doğal arabulucu'],
      challenges: ['Kararsız', 'Çatışmalardan kaçar', 'Mükemmeliyetçi'],
    },
    confidence: 92,
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="hero-title gradient-text mb-4">Kozmik Profiliniz ✨</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Size özel astrolojik öngörülerinizi keşfedin
          </p>
        </div>

        {/* Main Results Grid */}
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Zodiac Sign Card */}
          <div className="card text-center lg:col-span-1">
            <div className="mb-6">
              <div className="text-8xl mb-4 animate-pulse">{mockResults.zodiacIcon}</div>
              <h2 className="section-title mystical-text">{mockResults.zodiacSign}</h2>
              <p className="text-gray-600 mt-2 font-medium">{mockResults.dateRange}</p>
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-mystical-gradient rounded-full">
                <span className="text-deep-pink font-semibold">
                  %{mockResults.confidence} Güven
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="card-title text-deep-pink mb-3">Ana Özellikler</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {mockResults.personality.traits.map(trait => (
                    <span
                      key={trait}
                      className="px-3 py-1 bg-soft-pink text-deep-pink rounded-full text-sm font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="card-title text-deep-pink mb-3">Güçlü Yanlarınız</h3>
                <ul className="text-gray-600 space-y-2 text-left">
                  {mockResults.personality.strengths.map(strength => (
                    <li key={strength} className="flex items-center">
                      <span className="text-mystical-gold mr-2">✨</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Compatibility Section */}
          <div className="card lg:col-span-1 xl:col-span-2">
            <h2 className="section-title text-center gradient-text mb-8">
              💕 Uyumluluk Analiziniz
            </h2>

            <div className="space-y-6">
              {mockResults.compatibility.map(match => (
                <div
                  key={match.sign}
                  className="bg-white/70 backdrop-blur-sm border border-rose-gold/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{match.icon}</span>
                      <h3 className="card-title text-deep-pink">{match.sign}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold gradient-text">%{match.percentage}</span>
                    </div>
                  </div>

                  <div className="bg-dusty-pink rounded-full h-3 mb-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-pink to-mystical-gold h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${match.percentage}%`,
                        animation: `slideIn 1s ease-out ${mockResults.compatibility.indexOf(match) * 0.2}s forwards`,
                      }}
                    />
                  </div>

                  <p className="text-gray-600 font-medium">{match.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Areas Section */}
          <div className="card lg:col-span-2 xl:col-span-3">
            <h2 className="section-title text-center gradient-text mb-8">🌱 Gelişim Alanlarınız</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {mockResults.personality.challenges.map((challenge, index) => (
                <div
                  key={challenge}
                  className="text-center p-6 bg-gradient-to-br from-dusty-pink to-white rounded-xl border border-rose-gold/20 hover:scale-105 transition-transform duration-300"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                  }}
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <span className="text-deep-pink font-semibold">{challenge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link to="/survey" className="btn-primary px-8 py-4 text-lg w-full sm:w-auto">
            Anketi Tekrar Al
          </Link>
          <Link to="/" className="btn-secondary px-8 py-4 text-lg w-full sm:w-auto">
            Ana Sayfaya Dön
          </Link>
          <button
            className="btn-ghost px-8 py-4 text-lg w-full sm:w-auto"
            onClick={() => window.print()}
          >
            Sonuçları Yazdır 🖨️
          </button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slideIn {
          from { width: 0%; }
          to { width: var(--target-width, 0%); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default ResultsPage
