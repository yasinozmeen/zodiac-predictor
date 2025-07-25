import { ZODIAC_SIGNS, ZODIAC_SYMBOLS } from '../index.js'

// Date utilities
export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

export const getMonthDay = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

// Zodiac utilities
export const getZodiacSign = (birthDate: string): string => {
  const date = new Date(birthDate)
  const monthDay = getMonthDay(date)

  // Zodiac date ranges
  const ranges = {
    Capricorn: { start: '12-22', end: '01-19' },
    Aquarius: { start: '01-20', end: '02-18' },
    Pisces: { start: '02-19', end: '03-20' },
    Aries: { start: '03-21', end: '04-19' },
    Taurus: { start: '04-20', end: '05-20' },
    Gemini: { start: '05-21', end: '06-20' },
    Cancer: { start: '06-21', end: '07-22' },
    Leo: { start: '07-23', end: '08-22' },
    Virgo: { start: '08-23', end: '09-22' },
    Libra: { start: '09-23', end: '10-22' },
    Scorpio: { start: '10-23', end: '11-21' },
    Sagittarius: { start: '11-22', end: '12-21' },
  }

  for (const [sign, range] of Object.entries(ranges)) {
    if (isDateInRange(monthDay, range.start, range.end)) {
      return sign
    }
  }

  return 'Aries' // Default fallback
}

export const isDateInRange = (date: string, start: string, end: string): boolean => {
  // Handle year-end crossover (like Capricorn)
  if (start > end) {
    return date >= start || date <= end
  }
  return date >= start && date <= end
}

export const getZodiacElement = (sign: string): string => {
  const elementMap: Record<string, string> = {
    Aries: 'Fire',
    Leo: 'Fire',
    Sagittarius: 'Fire',
    Taurus: 'Earth',
    Virgo: 'Earth',
    Capricorn: 'Earth',
    Gemini: 'Air',
    Libra: 'Air',
    Aquarius: 'Air',
    Cancer: 'Water',
    Scorpio: 'Water',
    Pisces: 'Water',
  }

  return elementMap[sign] || 'Unknown'
}

export const getZodiacSymbol = (sign: string): string => {
  return ZODIAC_SYMBOLS[sign as keyof typeof ZODIAC_SYMBOLS] || '⭐'
}

// String utilities
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidZodiacSign = (sign: string): boolean => {
  return ZODIAC_SIGNS.includes(sign as any)
}

// Array utilities
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffleArray(array)
  return shuffled.slice(0, count)
}

// Percentage utilities
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export const formatPercentage = (percentage: number): string => {
  return `${percentage}%`
}
