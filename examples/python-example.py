#!/usr/bin/env python3
"""
PayPerAgent Python Example

This example demonstrates how to use the PayPerAgent Python SDK
to access weather, crypto, and news data with automatic payments.
"""

import os
from payperagent import create_client

def main():
    print("🤖 PayPerAgent Python Example\n")
    
    # Get private key from environment or use a test key
    private_key = os.getenv('PRIVATE_KEY', '0x' + '0' * 64)
    
    # Initialize client
    # Use production URL or localhost for development
    gateway_url = os.getenv('API_URL', 'https://payperagent.xyz')
    client = create_client(
        gateway_url=gateway_url,
        private_key=private_key,
        auto_retry=True
    )
    
    try:
        # Example 1: Get cryptocurrency prices
        print("📊 Fetching crypto prices...")
        crypto_data = client.get_crypto(symbols='BTCUSDT,ETHUSDT,BNBUSDT')
        
        print(f"BTC: ${crypto_data['btc']['usd']:,.2f}")
        print(f"ETH: ${crypto_data['eth']['usd']:,.2f}")
        print(f"BNB: ${crypto_data['bnb']['usd']:,.2f}")
        print()
        
        # Example 2: Get weather data
        print("🌤️  Fetching weather for London...")
        weather = client.get_weather(city='London')
        
        print(f"Location: {weather['location']}, {weather['country']}")
        print(f"Temperature: {weather['temperature']}°C (feels like {weather['feels_like']}°C)")
        print(f"Conditions: {weather['description']}")
        print(f"Humidity: {weather['humidity']}%")
        print()
        
        # Example 3: Get news articles
        print("📰 Fetching tech news...")
        news = client.get_news(category='technology', page_size=3)
        
        print(f"Found {news['totalResults']} articles:")
        for i, article in enumerate(news['articles'], 1):
            print(f"{i}. {article['title']}")
            print(f"   Source: {article['source']}")
        print()
        
        # Example 4: Get gateway stats
        print("📈 Gateway statistics:")
        stats = client.get_stats()
        print(f"Total requests: {stats['overview']['totalRequests']}")
        print(f"Success rate: {stats['overview']['successRate']}")
        print(f"Avg response time: {stats['overview']['averageResponseTime']}")
        
    except Exception as error:
        print(f"Error: {error}")
        if hasattr(error, 'response') and error.response.status_code == 402:
            print("\n💡 Tip: Make sure your wallet has USDC on SKALE Network")

if __name__ == '__main__':
    main()
