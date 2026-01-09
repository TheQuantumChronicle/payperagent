/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures when external services are down
 */

import { CircuitBreakerError } from './errors';

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

interface CircuitBreakerOptions {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private nextAttempt: number = Date.now();
  private readonly options: CircuitBreakerOptions;
  private readonly name: string;

  constructor(name: string, options?: Partial<CircuitBreakerOptions>) {
    this.name = name;
    this.options = {
      failureThreshold: options?.failureThreshold || 5,
      successThreshold: options?.successThreshold || 2,
      timeout: options?.timeout || 60000, // 1 minute
      resetTimeout: options?.resetTimeout || 30000, // 30 seconds
    };
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new CircuitBreakerError(`Circuit breaker is OPEN for ${this.name}`);
      }
      this.state = CircuitState.HALF_OPEN;
      this.successCount = 0;
    }

    try {
      const result = await this.callWithTimeout(fn);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private async callWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), this.options.timeout)
      ),
    ]);
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.options.successThreshold) {
        this.state = CircuitState.CLOSED;
        console.log(`✅ Circuit breaker CLOSED for ${this.name}`);
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    
    if (this.failureCount >= this.options.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.options.resetTimeout;
      console.error(`🔴 Circuit breaker OPEN for ${this.name} (failures: ${this.failureCount})`);
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getStats() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      nextAttempt: this.state === CircuitState.OPEN ? new Date(this.nextAttempt).toISOString() : null,
    };
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
    console.log(`🔄 Circuit breaker RESET for ${this.name}`);
  }
}

// Global circuit breakers for external services
export const circuitBreakers = {
  openweather: new CircuitBreaker('OpenWeather API'),
  binance: new CircuitBreaker('Binance API'),
  newsapi: new CircuitBreaker('NewsAPI'),
  coingecko: new CircuitBreaker('CoinGecko API'),
  ruby: new CircuitBreaker('Ruby Exchange API'),
  chirper: new CircuitBreaker('Chirper API'),
  jokes: new CircuitBreaker('Jokes API'),
  bored: new CircuitBreaker('Bored API'),
  agify: new CircuitBreaker('Agify API'),
  genderize: new CircuitBreaker('Genderize API'),
  nationalize: new CircuitBreaker('Nationalize API'),
  catfacts: new CircuitBreaker('Cat Facts API'),
  universities: new CircuitBreaker('Universities API'),
  countries: new CircuitBreaker('REST Countries API'),
  advice: new CircuitBreaker('Advice Slip API'),
  zipcode: new CircuitBreaker('Zipcode API'),
  randomuser: new CircuitBreaker('Random User API'),
  openlibrary: new CircuitBreaker('Open Library API'),
  rickmorty: new CircuitBreaker('Rick and Morty API'),
};
