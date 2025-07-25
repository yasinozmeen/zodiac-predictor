/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Pink Mystique Theme Colors
        'primary-pink': '#E91E63', // Main CTA buttons, progress bars, active states
        'soft-pink': '#F8BBD9', // Background gradients, hover states, gentle accents
        'rose-gold': '#E8B4CB', // Secondary buttons, borders, decorative elements
        'deep-pink': '#AD1457', // Text emphasis, selected states, important alerts
        'dusty-pink': '#F3E5F5', // Background washes, card backgrounds, subtle areas
        'mystical-gold': '#FFD700', // Accent details, star elements, premium features

        // Legacy compatibility
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Dancing Script', 'ui-serif', 'serif'],
      },
      screens: {
        sm: '320px', // Mobile
        md: '768px', // Tablet
        lg: '1024px', // Desktop
        xl: '1440px', // Wide
      },
      backgroundImage: {
        'pink-mystique': 'linear-gradient(135deg, #F8BBD9 0%, #E8B4CB 50%, #F3E5F5 100%)',
        'mystical-gradient': 'linear-gradient(135deg, #F3E5F5 0%, #E8B4CB 100%)',
      },
    },
  },
  plugins: [],
}
