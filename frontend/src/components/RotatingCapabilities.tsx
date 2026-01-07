import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const capabilities = [
  "Fetch Live Crypto Prices",
  "Query Blockchain Data",
  "Search Wikipedia",
  "Analyze GitHub Repos",
  "Monitor Reddit Trends",
  "Track DeFi Pools",
  "Get Swap Quotes",
  "Access Weather Data",
  "Retrieve News Feeds",
  "Analyze Sentiment"
];

export default function RotatingCapabilities() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % capabilities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 py-8 min-h-[120px] px-4">
      <span className="text-gray-500 text-lg md:text-2xl font-light tracking-wide pt-1 text-center md:text-left">
        Agents can
      </span>
      <div className="relative h-20 md:h-24 w-full max-w-[600px] flex items-center justify-center md:justify-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -40, rotateX: 90 }}
            transition={{ 
              duration: 0.6,
              ease: [0.2, 0.8, 0.2, 1],
              opacity: { duration: 0.3 } 
            }}
            className="absolute left-0 right-0 text-center md:text-left origin-center py-2"
          >
            <span className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-void-200 to-void-400 animate-gradient-x drop-shadow-lg leading-tight block px-1">
              {capabilities[index]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
