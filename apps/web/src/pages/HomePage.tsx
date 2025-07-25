import React from 'react'
import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="hero-title gradient-text mb-6">
              Kozmik Bağlantınızı
              <br />
              <span className="mystical-text">Keşfedin ✨</span>
            </h1>
            <p className="text-lg leading-8 text-gray-700 max-w-3xl mx-auto mb-10">
              Yapay zeka destekli astrolojik öngörülerimiz ile burç uyumunuzun sırlarını açın ve
              kişilik özelliklerinizi keşfedin. Kişiselleştirilmiş tahminler için kapsamlı
              anketimizi doldurun.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/survey" className="btn-primary px-8 py-4 text-lg w-full sm:w-auto">
                Yolculuğunuza Başlayın
              </Link>
              <a href="#features" className="btn-ghost px-8 py-4 text-lg w-full sm:w-auto">
                Daha Fazla Bilgi <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 text-mystical-gold opacity-30 animate-pulse">
          ⭐
        </div>
        <div className="absolute top-40 right-20 w-16 h-16 text-soft-pink opacity-40 animate-bounce">
          🌙
        </div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 text-rose-gold opacity-50 animate-pulse">
          ✨
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title gradient-text mb-4">Neden Zodiac Predictor?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gelişmiş teknoloji ve astroloji bilimini birleştirerek size en doğru tahminleri
              sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card text-center transform hover:scale-105 transition-transform duration-300">
              <div className="mx-auto h-16 w-16 text-5xl mb-6 flex items-center justify-center">
                🔮
              </div>
              <h3 className="card-title text-deep-pink mb-4">AI Destekli Tahminler</h3>
              <p className="text-gray-600 leading-relaxed">
                Gelişmiş algoritmalar yanıtlarınızı analiz ederek doğru kişilik öngörüleri sağlar.
              </p>
            </div>

            <div className="card text-center transform hover:scale-105 transition-transform duration-300">
              <div className="mx-auto h-16 w-16 text-5xl mb-6 flex items-center justify-center">
                💫
              </div>
              <h3 className="card-title text-deep-pink mb-4">Uyumluluk Analizi</h3>
              <p className="text-gray-600 leading-relaxed">
                Farklı burç işaretleri ve kişiliklerle ne kadar uyumlu olduğunuzu keşfedin.
              </p>
            </div>

            <div className="card text-center transform hover:scale-105 transition-transform duration-300">
              <div className="mx-auto h-16 w-16 text-5xl mb-6 flex items-center justify-center">
                ✨
              </div>
              <h3 className="card-title text-deep-pink mb-4">Kişiselleştirilmiş Sonuçlar</h3>
              <p className="text-gray-600 leading-relaxed">
                Eşsiz astrolojik profilinize özel olarak hazırlanmış detaylı raporlar alın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mystical-text mb-6">Yıldızlar Sizi Bekliyor ⭐</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Kozmik yolculuğunuza bugün başlayın ve kendinizi daha iyi tanıyın.
          </p>
          <Link to="/survey" className="btn-primary px-10 py-4 text-lg">
            Hemen Başla
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
