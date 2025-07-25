import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'

const SurveyPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    personality: '',
    interests: [],
  })
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Send data to API
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      navigate('/results')
    } catch (error) {
      console.error('Survey submission failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalSteps = 3

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-lg text-gray-600">Sonuçlarınız hazırlanıyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="section-title gradient-text mb-2">Zodiac Anketi</h1>
            <p className="text-gray-600 mb-6">
              Adım {currentStep} / {totalSteps}
            </p>
            <div className="bg-dusty-pink rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-pink to-deep-pink h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-deep-pink mb-6 flex items-center">
                  <span className="mr-2">🌟</span>
                  Doğum Bilgileriniz
                </h2>

                <div>
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Doğum Tarihi
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    className="w-full px-4 py-3 border border-rose-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all"
                    value={formData.birthDate}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="birthTime"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Doğum Saati (Opsiyonel)
                  </label>
                  <input
                    id="birthTime"
                    type="time"
                    className="w-full px-4 py-3 border border-rose-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all"
                    value={formData.birthTime}
                    onChange={e => setFormData({ ...formData, birthTime: e.target.value })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="birthLocation"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Doğum Yeri
                  </label>
                  <input
                    id="birthLocation"
                    type="text"
                    placeholder="Şehir, Ülke"
                    className="w-full px-4 py-3 border border-rose-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all"
                    value={formData.birthLocation}
                    onChange={e => setFormData({ ...formData, birthLocation: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-deep-pink mb-6 flex items-center">
                  <span className="mr-2">💫</span>
                  Kişilik Özellikleriniz
                </h2>

                <div>
                  <label
                    htmlFor="personality"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Kendinizi nasıl tanımlarsınız?
                  </label>
                  <textarea
                    id="personality"
                    className="w-full px-4 py-3 border border-rose-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-transparent transition-all resize-none"
                    rows={5}
                    placeholder="Kişiliğiniz, özellikleriniz ve karakteriniz hakkında bize bilgi verin..."
                    value={formData.personality}
                    onChange={e => setFormData({ ...formData, personality: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-deep-pink mb-6 flex items-center">
                  <span className="mr-2">✨</span>
                  Son Sorular
                </h2>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    Ana ilgi alanlarınız nelerdir? (Uygun olanları seçin)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'art', label: 'Sanat', icon: '🎨' },
                      { key: 'music', label: 'Müzik', icon: '🎵' },
                      { key: 'sports', label: 'Spor', icon: '⚽' },
                      { key: 'travel', label: 'Seyahat', icon: '✈️' },
                      { key: 'technology', label: 'Teknoloji', icon: '💻' },
                      { key: 'books', label: 'Kitaplar', icon: '📚' },
                      { key: 'nature', label: 'Doğa', icon: '🌿' },
                      { key: 'food', label: 'Yemek', icon: '🍽️' },
                    ].map(interest => (
                      <label
                        key={interest.key}
                        className="flex items-center p-3 border border-rose-gold rounded-lg hover:bg-dusty-pink transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-rose-gold text-primary-pink focus:ring-primary-pink mr-3"
                          onChange={e => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                interests: [...formData.interests, interest.key as never],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                interests: formData.interests.filter(
                                  (i: string) => i !== interest.key
                                ),
                              })
                            }
                          }}
                        />
                        <span className="mr-2">{interest.icon}</span>
                        <span className="text-gray-700 font-medium">{interest.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-rose-gold/20">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn-secondary px-6 py-3"
                >
                  ← Önceki
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="btn-primary px-6 py-3 ml-auto"
                >
                  Sonraki →
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary px-8 py-3 ml-auto"
                  disabled={isLoading}
                >
                  Sonuçlarımı Göster ✨
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SurveyPage
