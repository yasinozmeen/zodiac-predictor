import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SurveyPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    personality: '',
    interests: [],
  })
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Send data to API
    navigate('/results')
  }

  const totalSteps = 3

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 text-center">Zodiac Survey</h1>
        <p className="mt-2 text-secondary-600 text-center">
          Step {currentStep} of {totalSteps}
        </p>
        <div className="mt-4 bg-secondary-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-secondary-900">Birth Information</h2>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Birth Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.birthDate}
                onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Birth Time (Optional)
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.birthTime}
                onChange={e => setFormData({ ...formData, birthTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Birth Location
              </label>
              <input
                type="text"
                placeholder="City, Country"
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.birthLocation}
                onChange={e => setFormData({ ...formData, birthLocation: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-secondary-900">Personality Traits</h2>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                How would you describe yourself?
              </label>
              <textarea
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="Tell us about your personality, traits, and characteristics..."
                value={formData.personality}
                onChange={e => setFormData({ ...formData, personality: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-secondary-900">Final Questions</h2>
            <div>
              <p className="text-sm font-medium text-secondary-700 mb-4">
                What are your main interests? (Select all that apply)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Art', 'Music', 'Sports', 'Travel', 'Technology', 'Books', 'Nature', 'Food'].map(
                  interest => (
                    <label key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        onChange={e => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              interests: [...formData.interests, interest as never],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              interests: formData.interests.filter((i: string) => i !== interest),
                            })
                          }
                        }}
                      />
                      <span className="ml-2 text-secondary-700">{interest}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn-secondary px-6 py-2"
            >
              Previous
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn-primary px-6 py-2 ml-auto"
            >
              Next
            </button>
          ) : (
            <button type="submit" className="btn-primary px-6 py-2 ml-auto">
              Get My Results ✨
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default SurveyPage
