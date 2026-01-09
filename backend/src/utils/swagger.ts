/**
 * Swagger/OpenAPI Documentation Configuration
 */

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'PayPerAgent API Gateway',
    version: '0.2.0',
    description: '⚡ Zero Gas Fee API Gateway for AI Agents on SKALE Network | 25 APIs, 53 Endpoints',
    contact: {
      name: 'PayPerAgent Support',
      url: 'https://github.com/payperagent',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'https://payperagent.xyz',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check and system status',
    },
    {
      name: 'Weather',
      description: 'Weather data APIs',
    },
    {
      name: 'Crypto',
      description: 'Cryptocurrency price data',
    },
    {
      name: 'News',
      description: 'News articles and headlines',
    },
    {
      name: 'Fun',
      description: 'Entertainment and fun APIs',
    },
    {
      name: 'Knowledge',
      description: 'Educational and reference APIs',
    },
    {
      name: 'Data',
      description: 'Data lookup and information APIs',
    },
    {
      name: 'SKALE Ecosystem',
      description: 'SKALE blockchain integrations',
    },
    {
      name: 'Analytics',
      description: 'Usage analytics and statistics',
    },
    {
      name: 'System',
      description: 'System management and monitoring',
    },
  ],
  components: {
    securitySchemes: {
      X402Payment: {
        type: 'apiKey',
        in: 'header',
        name: 'X-PAYMENT',
        description: 'X402 payment proof for pay-per-use access',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Error message',
              },
              code: {
                type: 'string',
                example: 'ERROR_CODE',
              },
            },
          },
        },
      },
      PaymentRequired: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
            example: 'Payment Required',
          },
          payment: {
            type: 'object',
            properties: {
              network: {
                type: 'string',
                example: 'SKALE Nebula Testnet',
              },
              chainId: {
                type: 'number',
                example: 37084624,
              },
              amount: {
                type: 'string',
                example: '0.001',
              },
              currency: {
                type: 'string',
                example: 'USDC',
              },
              description: {
                type: 'string',
                example: 'Weather data access',
              },
              facilitatorURL: {
                type: 'string',
                example: 'https://facilitator.dirtroad.dev',
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Get system health status and metrics',
        responses: {
          200: {
            description: 'System is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    service: { type: 'string', example: 'PayPerAgent API Gateway' },
                    version: { type: 'string', example: '0.1.0' },
                    timestamp: { type: 'string', format: 'date-time' },
                    uptime: { type: 'object' },
                    memory: { type: 'object' },
                    database: { type: 'object' },
                    network: { type: 'object' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/weather': {
      get: {
        tags: ['Weather'],
        summary: 'Get weather data',
        description: 'Get real-time weather data for a location',
        security: [{ X402Payment: [] }],
        parameters: [
          {
            name: 'city',
            in: 'query',
            description: 'City name',
            schema: { type: 'string', example: 'London' },
          },
          {
            name: 'lat',
            in: 'query',
            description: 'Latitude',
            schema: { type: 'number', example: 51.5074 },
          },
          {
            name: 'lon',
            in: 'query',
            description: 'Longitude',
            schema: { type: 'number', example: -0.1278 },
          },
        ],
        responses: {
          200: {
            description: 'Weather data retrieved successfully',
          },
          402: {
            description: 'Payment required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaymentRequired' },
              },
            },
          },
        },
      },
    },
    '/api/crypto': {
      get: {
        tags: ['Crypto'],
        summary: 'Get cryptocurrency prices',
        description: 'Get real-time crypto prices from Binance',
        security: [{ X402Payment: [] }],
        parameters: [
          {
            name: 'symbol',
            in: 'query',
            description: 'Trading pair symbol',
            schema: { type: 'string', example: 'BTCUSDT' },
          },
          {
            name: 'symbols',
            in: 'query',
            description: 'Multiple symbols (comma-separated)',
            schema: { type: 'string', example: 'BTCUSDT,ETHUSDT' },
          },
        ],
        responses: {
          200: {
            description: 'Crypto prices retrieved successfully',
          },
          402: {
            description: 'Payment required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaymentRequired' },
              },
            },
          },
        },
      },
    },
    '/system/circuit-breakers': {
      get: {
        tags: ['System'],
        summary: 'Get circuit breaker status',
        description: 'Get status of all circuit breakers',
        responses: {
          200: {
            description: 'Circuit breaker status retrieved',
          },
        },
      },
    },
    '/system/metrics': {
      get: {
        tags: ['System'],
        summary: 'Get system metrics',
        description: 'Get system performance metrics',
        responses: {
          200: {
            description: 'System metrics retrieved',
          },
        },
      },
    },
  },
};
