import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-pink-mystique flex flex-col">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-rose-gold/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl">✨</span>
                <h1 className="text-2xl font-semibold mystical-text">Zodiac Predictor</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex space-x-8"
              role="navigation"
              aria-label="Main navigation"
            >
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/')
                    ? 'text-primary-pink bg-dusty-pink'
                    : 'text-gray-700 hover:text-primary-pink hover:bg-dusty-pink'
                }`}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/survey"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/survey')
                    ? 'text-primary-pink bg-dusty-pink'
                    : 'text-gray-700 hover:text-primary-pink hover:bg-dusty-pink'
                }`}
                aria-current={isActive('/survey') ? 'page' : undefined}
              >
                Anket
              </Link>
              <Link
                to="/results"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/results')
                    ? 'text-primary-pink bg-dusty-pink'
                    : 'text-gray-700 hover:text-primary-pink hover:bg-dusty-pink'
                }`}
                aria-current={isActive('/results') ? 'page' : undefined}
              >
                Sonuçlar
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-pink hover:bg-dusty-pink focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-pink"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                aria-label="Ana menü"
              >
                <span className="sr-only">Ana menüyü aç</span>
                {/* Menu icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* X icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm border-t border-rose-gold/20">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'text-primary-pink bg-dusty-pink'
                  : 'text-gray-700 hover:text-primary-pink hover:bg-dusty-pink'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/survey"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive('/survey')
                  ? 'text-primary-pink bg-dusty-pink'
                  : 'text-gray-700 hover:text-primary-pink hover:bg-dusty-pink'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-current={isActive('/survey') ? 'page' : undefined}
            >
              Anket
            </Link>
            <Link
              to="/results"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive('/results')
                  ? 'text-primary-pink bg-dusty-pink'
                  : 'text-gray-700 hover:text-primary-pink hover:bg-dusty-pink'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-current={isActive('/results') ? 'page' : undefined}
            >
              Sonuçlar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1" role="main">
        {children}
      </main>

      <footer
        className="bg-white/90 backdrop-blur-sm border-t border-rose-gold/20 mt-auto"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              &copy; 2025 Zodiac Predictor.
              <span className="mystical-text ml-1">Yıldızlarla yapılmış ✨</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
