import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">✨ Zodiac Predictor</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-secondary-600 hover:text-primary-600 transition-colors">
                Home
              </a>
              <a
                href="/survey"
                className="text-secondary-600 hover:text-primary-600 transition-colors"
              >
                Take Survey
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t border-secondary-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-secondary-500">
            <p>&copy; 2025 Zodiac Predictor. Made with ✨ and AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
