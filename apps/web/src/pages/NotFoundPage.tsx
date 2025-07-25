import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="text-center">
        <div className="text-6xl font-bold text-deep-pink mb-4">404</div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Sayfa Bulunamadı</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil ya da taşınmış olabilir.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-pink hover:bg-deep-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-pink transition-colors duration-200"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
