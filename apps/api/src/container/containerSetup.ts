/**
 * Container setup and service registration
 * Implements Inversion of Control pattern
 */

import { container, TOKENS } from './DIContainer.js'
import { ZodiacService } from '../services/ZodiacService.js'
import { SurveyService } from '../services/SurveyService.js'
import { ZodiacDataService } from '../services/ZodiacDataService.js'
import { ConfigService } from '../config/ConfigService.js'

export function setupContainer(): void {
  // Register configuration service as singleton
  container.bindSingleton(TOKENS.ConfigService, () => ConfigService.getInstance())

  // Register data service as singleton (stateless)
  container.bindSingleton(TOKENS.ZodiacDataService, () => new ZodiacDataService())

  // Register zodiac service as singleton
  container.bindSingleton(TOKENS.ZodiacService, () => {
    return new ZodiacService()
  })

  // Register survey service with dependencies
  container.bind(TOKENS.SurveyService, () => {
    const zodiacService = container.get<ZodiacService>(TOKENS.ZodiacService)
    return new SurveyService(zodiacService)
  })
}

// Helper function to get services with type safety
export function getService<T>(token: symbol): T {
  return container.get<T>(token)
}

// Type-safe service getters
export const getConfigService = () => getService<ConfigService>(TOKENS.ConfigService)
export const getZodiacService = () => getService<ZodiacService>(TOKENS.ZodiacService)
export const getSurveyService = () => getService<SurveyService>(TOKENS.SurveyService)
