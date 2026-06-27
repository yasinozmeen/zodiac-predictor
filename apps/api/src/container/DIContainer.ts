/**
 * Dependency Injection Container
 * Implements Service Locator and Factory patterns for better architecture
 */

export interface Container {
  get<T>(token: symbol | string): T
  bind<T>(token: symbol | string, factory: () => T): void
  bindSingleton<T>(token: symbol | string, factory: () => T): void
}

class DIContainer implements Container {
  private services = new Map<symbol | string, any>()
  private singletons = new Map<symbol | string, any>()
  private factories = new Map<symbol | string, () => any>()

  bind<T>(token: symbol | string, factory: () => T): void {
    this.factories.set(token, factory)
  }

  bindSingleton<T>(token: symbol | string, factory: () => T): void {
    this.factories.set(token, factory)
    this.singletons.set(token, null) // Mark as singleton
  }

  get<T>(token: symbol | string): T {
    // Check if it's a singleton and already instantiated
    if (this.singletons.has(token)) {
      const existing = this.singletons.get(token)
      if (existing) {
        return existing
      }
    }

    // Get factory and create instance
    const factory = this.factories.get(token)
    if (!factory) {
      throw new Error(`Service not found: ${String(token)}`)
    }

    const instance = factory()

    // Store singleton instance
    if (this.singletons.has(token)) {
      this.singletons.set(token, instance)
    }

    return instance
  }

  clear(): void {
    this.services.clear()
    this.singletons.clear()
    this.factories.clear()
  }
}

// Service tokens for type safety
export const TOKENS = {
  ZodiacService: Symbol('ZodiacService'),
  SurveyService: Symbol('SurveyService'),
  ZodiacDataService: Symbol('ZodiacDataService'),
  ConfigService: Symbol('ConfigService'),
} as const

// Global container instance
export const container = new DIContainer()

export default container
