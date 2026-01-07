# Integration Guide for AI Agents

## Quick Start

### 1. Install Dependencies

```bash
npm install axios ethers
```

### 2. Basic Integration

```typescript
import axios from 'axios';

const API_BASE = 'https://api.payperagent.com/api';

async function getWeather(city: string) {
  try {
    const response = await axios.get(`${API_BASE}/weather`, {
      params: { city },
      headers: {
        'X-PAYMENT': '<your_payment_proof>'
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 402) {
      console.log('Payment required:', error.response.data.payment);
    }
    throw error;
  }
}
```

### 3. With x402 Payment Flow

```typescript
import axios from 'axios';
import { ethers } from 'ethers';

class PayPerAgentClient {
  private wallet: ethers.Wallet;
  private baseUrl: string;

  constructor(privateKey: string, baseUrl: string) {
    const provider = new ethers.JsonRpcProvider(
      'https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet'
    );
    this.wallet = new ethers.Wallet(privateKey, provider);
    this.baseUrl = baseUrl;
  }

  async makeRequest(endpoint: string, params: any) {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 402) {
        const paymentInfo = error.response.data.payment;
        const paymentProof = await this.generatePayment(paymentInfo);
        
        const retryResponse = await axios.get(`${this.baseUrl}${endpoint}`, {
          params,
          headers: {
            'X-PAYMENT': paymentProof,
          },
        });
        
        return retryResponse.data;
      }
      throw error;
    }
  }

  private async generatePayment(paymentInfo: any) {
    return 'payment_proof_placeholder';
  }
}

const client = new PayPerAgentClient('your_private_key', 'https://api.payperagent.com/api');
const weather = await client.makeRequest('/weather', { city: 'London' });
console.log(weather);
```

## LangChain Integration

```typescript
import { Tool } from 'langchain/tools';
import { PayPerAgentClient } from './client';

class WeatherTool extends Tool {
  name = 'weather';
  description = 'Get current weather for a city. Input should be a city name.';
  
  private client: PayPerAgentClient;

  constructor(apiKey: string) {
    super();
    this.client = new PayPerAgentClient(apiKey, 'https://api.payperagent.com/api');
  }

  async _call(city: string): Promise<string> {
    const data = await this.client.makeRequest('/weather', { city });
    return JSON.stringify(data.data);
  }
}

const weatherTool = new WeatherTool('your_private_key');
```

## Python Integration

```python
import requests
from web3 import Web3

class PayPerAgentClient:
    def __init__(self, private_key, base_url):
        self.private_key = private_key
        self.base_url = base_url
        self.w3 = Web3(Web3.HTTPProvider('https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet'))
    
    def make_request(self, endpoint, params):
        try:
            response = requests.get(f"{self.base_url}{endpoint}", params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 402:
                payment_info = e.response.json()['payment']
                payment_proof = self.generate_payment(payment_info)
                
                headers = {'X-PAYMENT': payment_proof}
                retry_response = requests.get(
                    f"{self.base_url}{endpoint}",
                    params=params,
                    headers=headers
                )
                return retry_response.json()
            raise

client = PayPerAgentClient('your_private_key', 'https://api.payperagent.com/api')
weather = client.make_request('/weather', {'city': 'London'})
print(weather)
```

## Best Practices

1. **Cache Payment Proofs**: Reuse payment proofs when possible
2. **Handle 402 Errors**: Always implement retry logic for payment required responses
3. **Monitor Spending**: Track your API usage and costs
4. **Use Testnet First**: Test integration on SKALE testnet before mainnet
5. **Implement Timeouts**: Set reasonable timeouts for API calls

## Support

- Documentation: https://docs.payperagent.com
- Discord: https://discord.gg/payperagent
- Email: support@payperagent.com
