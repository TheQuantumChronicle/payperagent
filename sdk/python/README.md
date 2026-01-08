# PayPerAgent Python SDK

Official Python SDK for PayPerAgent API Gateway.

## Installation

```bash
pip install payperagent
```

## Quick Start

```python
from payperagent import create_client

# Create client with wallet for payments
client = create_client(
    gateway_url='https://payperagent.xyz',
    private_key='your-private-key',
    auto_retry=True  # Automatically handle payments
)

# Get crypto prices
crypto_data = client.get_crypto(symbol='BTCUSDT')
print(f"BTC Price: ${crypto_data['btc']['usd']}")

# Get weather
weather = client.get_weather(city='London')
print(f"Temperature: {weather['temperature']}°C")

# Get news
news = client.get_news(category='technology', page_size=5)
for article in news['articles']:
    print(article['title'])
```

## Features

- ✅ Automatic payment handling with SKALE Network
- ✅ Zero gas fees
- ✅ Full type hints support
- ✅ Automatic retry on 402 Payment Required
- ✅ Built-in error handling
- ✅ Compatible with LangChain and other AI frameworks

## API Reference

### `create_client(gateway_url, private_key=None, auto_retry=True)`

Create a new PayPerAgent client.

**Parameters:**
- `gateway_url` (str): URL of the PayPerAgent gateway
- `private_key` (str, optional): Private key for signing payments
- `auto_retry` (bool, optional): Auto-retry with payment on 402 (default: True)

**Returns:** `PayPerAgentClient`

### `client.get_crypto(symbol=None, symbols=None)`

Get cryptocurrency prices.

**Parameters:**
- `symbol` (str, optional): Single symbol (e.g., 'BTCUSDT')
- `symbols` (str, optional): Comma-separated symbols

**Returns:** `dict` with crypto price data

### `client.get_weather(city=None, lat=None, lon=None)`

Get weather data.

**Parameters:**
- `city` (str, optional): City name
- `lat` (str, optional): Latitude
- `lon` (str, optional): Longitude

**Returns:** `dict` with weather data

### `client.get_news(query=None, category=None, country=None, page_size=None)`

Get news articles.

**Parameters:**
- `query` (str, optional): Search query
- `category` (str, optional): News category
- `country` (str, optional): Country code
- `page_size` (int, optional): Number of articles

**Returns:** `dict` with news data and articles

## Examples

### Multiple Cryptocurrencies

```python
data = client.get_crypto(symbols='BTCUSDT,ETHUSDT,BNBUSDT')

print(f"BTC: ${data['btc']['usd']}")
print(f"ETH: ${data['eth']['usd']}")
print(f"BNB: ${data['bnb']['usd']}")
```

### Weather by Coordinates

```python
weather = client.get_weather(lat='40.7128', lon='-74.0060')
print(f"{weather['location']}: {weather['temperature']}°C")
```

### News Search

```python
news = client.get_news(query='AI', country='us', page_size=10)

for article in news['articles']:
    print(f"{article['title']} - {article['source']}")
```

## LangChain Integration

```python
from langchain.tools import Tool
from payperagent import create_client

client = create_client(
    gateway_url='http://localhost:3000',
    private_key='your-private-key'
)

# Create LangChain tool
crypto_tool = Tool(
    name="CryptoPrices",
    func=lambda symbol: client.get_crypto(symbol=symbol),
    description="Get real-time cryptocurrency prices"
)

weather_tool = Tool(
    name="Weather",
    func=lambda city: client.get_weather(city=city),
    description="Get current weather for a city"
)
```

## Error Handling

```python
try:
    data = client.get_crypto(symbol='BTCUSDT')
except requests.HTTPError as e:
    if e.response.status_code == 402:
        print("Payment required but wallet not configured")
    else:
        print(f"Request failed: {e}")
```

## License

MIT
