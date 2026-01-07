import { Request } from 'express';

export interface AgentRequest extends Request {
  agentId?: string;
  paymentVerified?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | ErrorDetail;
  timestamp?: string;
}

export interface ErrorDetail {
  message: string;
  code?: string;
  details?: any;
}

export interface PaymentRequirement {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  description: string;
}

export interface UsageMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  endpointStats: EndpointStat[];
}

export interface EndpointStat {
  endpoint: string;
  requests: number;
  avgResponseTime: number;
}

export interface ServiceInfo {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  price: string;
  provider: string;
  category: string;
  rating?: number;
  totalCalls?: number;
}
