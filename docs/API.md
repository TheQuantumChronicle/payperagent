# PayPerAgent API Documentation

## Overview

PayPerAgent provides a gateway for AI agents to access premium APIs using SKALE's x402 payment protocol.

## Base URL

```
https://api.payperagent.com/api
```

## Authentication

All endpoints require payment via the x402 protocol. Include the `X-PAYMENT` header with your payment proof.

## Payment Flow

1. Make request without payment header
2. Receive 402 Payment Required response with payment details
3. Generate payment on SKALE Network
4. Retry request with `X-PAYMENT` header

## Endpoints

### Weather API

**GET** `/api/weather`

Get current weather data for a location.

**Query Parameters:**
- `city` (string, optional): City name (e.g., "London")
- `lat` (string, optional): Latitude
- `lon` (string, optional): Longitude

**Price:** 0.001 USDC per request

**Example Request:**
```bash
curl -X GET "https://api.payperagent.com/api/weather?city=London" \
  -H "X-PAYMENT: <payment_proof>"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "location": "London",
    "country": "GB",
    "temperature": 15.2,
    "feels_like": 14.1,
    "humidity": 72,
    "weather": "Clouds",
    "description": "overcast clouds"
  },
  "timestamp": "2026-01-07T10:15:00.000Z"
}
```

---

### Crypto Price Data

**Endpoint:** `GET /api/crypto`

**Price:** 0.002 USDC per request

**Data Source:** Binance API (real-time, no API key required)

**Query Parameters:**
- `symbol` (string, optional): Single trading pair (e.g., "BTCUSDT")
- `symbols` (string, optional): Comma-separated trading pairs (e.g., "BTCUSDT,ETHUSDT,BNBUSDT")

**Supported Symbols:** Any Binance USDT trading pair (BTCUSDT, ETHUSDT, BNBUSDT, SOLUSDT, etc.)

**Example Request:**
```bash
curl -H "X-PAYMENT: <proof>" \
  "https://payperagent.xyz/api/crypto?symbol=BTCUSDT"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "btc": {
      "usd": 45123.50,
      "usd_24h_change": 2.35,
      "usd_24h_high": 45500.00,
      "usd_24h_low": 44000.00,
      "usd_24h_volume": 1234567890.50
    }
  },
  "timestamp": "2024-01-07T10:00:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid parameters"
}
```

### 402 Payment Required
```json
{
  "success": false,
  "error": "Payment Required",
  "payment": {
    "facilitatorURL": "https://facilitator.dirtroad.dev",
    "accepts": [
      {
        "scheme": "exact",
        "network": "skale-base-sepolia",
        "maxAmountRequired": "0.001",
        "description": "Weather data access"
      }
    ]
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "message": "Internal server error"
  }
}
```

## Rate Limits

- 100 requests per minute per agent
- 1000 requests per day per agent

## Support

For issues or questions, contact: support@payperagent.com
