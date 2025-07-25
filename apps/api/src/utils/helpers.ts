import crypto from 'crypto'

export const generateId = (): string => {
  return crypto.randomBytes(16).toString('hex')
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
