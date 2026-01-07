import axios, { AxiosInstance, AxiosError } from 'axios';
import { ethers } from 'ethers';
import { formatUSDC, formatDuration, truncateAddress, formatCryptoPrice, formatPriceChange } from './utils';

export interface PayPerAgentConfig {
  gatewayUrl: string;
  wallet?: ethers.Wallet;
  autoRetry?: boolean;
  maxRetries?: number;
  timeout?: number;
  debug?: boolean;
  onPayment?: (amount: string, description: string) => void;
  onError?: (error: Error) => void;
}

export interface RequestMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  cached?: boolean;
  retries: number;
  paymentRequired: boolean;
}

export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  weather: string;
  description: string;
  wind_speed: number;
  clouds: number;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export interface CryptoData {
  [symbol: string]: {
    usd: number;
    usd_24h_change: number;
    usd_24h_high: number;
    usd_24h_low: number;
    usd_24h_volume: number;
  };
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  author: string;
  imageUrl?: string;
}

export interface NewsData {
  totalResults: number;
  articles: NewsArticle[];
}

export class PayPerAgentClient {
  private client: AxiosInstance;
  private wallet?: ethers.Wallet;
  private autoRetry: boolean;
  private maxRetries: number;
  private debug: boolean;
  private onPayment?: (amount: string, description: string) => void;
  private onError?: (error: Error) => void;
  private metrics: Map<string, RequestMetrics> = new Map();

  constructor(config: PayPerAgentConfig) {
    this.client = axios.create({
      baseURL: config.gatewayUrl,
      timeout: config.timeout || 10000,
      headers: {
        'User-Agent': 'PayPerAgent-SDK/0.1.0',
        'Accept': 'application/json',
      },
    });
    this.wallet = config.wallet;
    this.autoRetry = config.autoRetry ?? true;
    this.maxRetries = config.maxRetries || 3;
    this.debug = config.debug || false;
    this.onPayment = config.onPayment;
    this.onError = config.onError;

    if (this.debug) {
      this.log('✨ PayPerAgent SDK initialized', {
        gateway: config.gatewayUrl,
        wallet: this.wallet?.address,
        autoRetry: this.autoRetry,
      });
    }
  }

  private log(message: string, data?: any): void {
    if (this.debug) {
      console.log(`[PayPerAgent] ${message}`, data || '');
    }
  }

  /**
   * Generate payment proof for a request
   */
  private async generatePaymentProof(amount: string, description: string): Promise<string> {
    if (!this.wallet) {
      throw new Error('💳 Wallet not configured. Cannot generate payment proof.');
    }

    this.log(`💰 Generating payment proof`, { amount, description });

    const timestamp = Date.now().toString();
    const message = `${timestamp}:${amount}:${description}`;
    const signature = await this.wallet.signMessage(message);

    if (this.onPayment) {
      this.onPayment(amount, description);
    }

    this.log(`✅ Payment proof generated`, { 
      signer: this.wallet.address,
      amount: `${amount} USDC`,
    });

    return `${signature}:${timestamp}:${amount}`;
  }

  /**
   * Make a request with automatic payment handling and retry logic
   */
  private async requestWithPayment<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    const requestId = `${endpoint}-${Date.now()}`;
    const metrics: RequestMetrics = {
      startTime: Date.now(),
      retries: 0,
      paymentRequired: false,
    };

    this.log(`🚀 Request started`, { endpoint, params });

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        // Try without payment first
        const response = await this.client.get(endpoint, { params });
        
        metrics.endTime = Date.now();
        metrics.duration = metrics.endTime - metrics.startTime;
        metrics.cached = response.headers['x-cache-hit'] === 'true';
        this.metrics.set(requestId, metrics);

        this.log(`✅ Request successful`, {
          duration: `${metrics.duration}ms`,
          cached: metrics.cached,
          retries: metrics.retries,
        });

        return response.data.data;
      } catch (error: any) {
        if (error.response?.status === 402 && this.autoRetry && this.wallet && attempt < this.maxRetries) {
          metrics.paymentRequired = true;
          metrics.retries++;

          this.log(`💳 Payment required (attempt ${attempt + 1}/${this.maxRetries})`, {
            amount: error.response.data.payment?.amount,
          });

          // Payment required - generate proof and retry
          const paymentInfo = error.response.data.payment;
          const paymentProof = await this.generatePaymentProof(
            paymentInfo.amount,
            paymentInfo.description
          );

          const retryResponse = await this.client.get(endpoint, {
            params,
            headers: {
              'X-PAYMENT': paymentProof,
            },
          });

          metrics.endTime = Date.now();
          metrics.duration = metrics.endTime - metrics.startTime;
          this.metrics.set(requestId, metrics);

          this.log(`✅ Request successful after payment`, {
            duration: `${metrics.duration}ms`,
            retries: metrics.retries,
          });

          return retryResponse.data.data;
        }

        // Handle other errors
        const enhancedError = this.enhanceError(error);
        if (this.onError) {
          this.onError(enhancedError);
        }
        this.log(`❌ Request failed`, { error: enhancedError.message });
        throw enhancedError;
      }
    }

    throw new Error(`Max retries (${this.maxRetries}) exceeded`);
  }

  /**
   * Enhance error messages with helpful information
   */
  private enhanceError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 402) {
        return new Error(
          `💳 Payment Required: ${data.payment?.amount} USDC for ${data.payment?.description}. ` +
          `Configure a wallet to enable automatic payments.`
        );
      } else if (status === 429) {
        return new Error(
          `⏱️  Rate Limit Exceeded: ${data.error || 'Too many requests'}. Please try again later.`
        );
      } else if (status === 400) {
        return new Error(
          `❌ Invalid Request: ${data.error || 'Bad request'}. Check your parameters.`
        );
      }
    }

    return error instanceof Error ? error : new Error(String(error));
  }

  /**
   * Get request metrics for debugging and monitoring
   */
  getMetrics(): Map<string, RequestMetrics> {
    return this.metrics;
  }

  /**
   * Clear metrics history
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.log('🧹 Metrics cleared');
  }

  /**
   * Get weather data for a city or coordinates
   */
  async getWeather(params: { city?: string; lat?: string; lon?: string }): Promise<WeatherData> {
    return this.requestWithPayment<WeatherData>('/api/weather', params);
  }

  /**
   * Get cryptocurrency prices
   */
  async getCrypto(params: { symbol?: string; symbols?: string }): Promise<CryptoData> {
    return this.requestWithPayment<CryptoData>('/api/crypto', params);
  }

  /**
   * Get news articles
   */
  async getNews(params: {
    query?: string;
    category?: string;
    country?: string;
    pageSize?: number;
  }): Promise<NewsData> {
    return this.requestWithPayment<NewsData>('/api/news', params);
  }

  /**
   * Get gateway information
   */
  async getGatewayInfo(): Promise<any> {
    const response = await this.client.get('/api');
    return response.data;
  }

  /**
   * Get gateway statistics
   */
  async getStats(): Promise<any> {
    const response = await this.client.get('/stats');
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

// Export convenience function
export function createClient(config: PayPerAgentConfig): PayPerAgentClient {
  return new PayPerAgentClient(config);
}

// Export utilities
export * from './utils';
