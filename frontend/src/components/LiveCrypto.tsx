import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface CryptoData {
  [key: string]: {
    usd: number;
    usd_24h_change?: number;
  };
}

export default function LiveCrypto() {
  const [cryptoData, setCryptoData] = useState<CryptoData>({});
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const { isConnected, subscribe, lastMessage } = useWebSocketContext();

  useEffect(() => {
    if (isConnected) {
      // Small delay to ensure connection is fully established
      const timer = setTimeout(() => {
        subscribe('crypto', { symbols: 'BTCUSDT,ETHUSDT,BNBUSDT' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isConnected, subscribe]);

  useEffect(() => {
    if (lastMessage?.type === 'crypto_update' && lastMessage.data) {
      // Only update if data has actually changed
      const newData = JSON.stringify(lastMessage.data);
      const oldData = JSON.stringify(cryptoData);
      if (newData !== oldData) {
        setCryptoData(lastMessage.data);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    }
  }, [lastMessage, cryptoData]);

  const coins = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH' },
    { id: 'bnb', name: 'BNB', symbol: 'BNB' },
  ];

  return (
    <section className="py-20 md:py-32 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void-900/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-void-500/20 bg-void-500/5">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-xs font-mono text-green-400 tracking-wider uppercase">
                  Live • WebSocket Connected
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-mono text-gray-400 tracking-wider uppercase">
                  Connecting...
                </span>
              </>
            )}
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-void-300 to-gray-100 bg-clip-text text-transparent">
            Real-Time Crypto Prices
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Live cryptocurrency prices via WebSocket • Updates every 5 seconds
          </p>
          {lastUpdate && (
            <p className="text-sm text-gray-600 mt-2">
              Last update: {lastUpdate}
            </p>
          )}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {coins.map((coin, index) => {
            const data = cryptoData[coin.id];
            const price = data?.usd || 0;
            const change = data?.usd_24h_change || 0;
            const isPositive = change >= 0;

            return (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:glass-hover transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-void-100 mb-1">{coin.name}</h3>
                    <p className="text-sm text-gray-400">{coin.symbol}</p>
                  </div>
                  {isConnected && (
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold text-void-200">
                      ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className={`flex items-center gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-semibold">
                      {isPositive ? '+' : ''}{change.toFixed(2)}%
                    </span>
                    <span className="text-xs text-gray-500">24h</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {!isConnected && (
          <div className="mt-8 text-center">
            <div className="inline-block px-6 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400">
              <p className="text-sm">WebSocket connection lost. Attempting to reconnect...</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
