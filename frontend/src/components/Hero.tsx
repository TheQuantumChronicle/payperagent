import { motion } from 'framer-motion';
import { Zap, Shield, Coins, TrendingUp } from 'lucide-react';
import RotatingCapabilities from './RotatingCapabilities';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-void-900/20 via-transparent to-void-900/20" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-void-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-glow-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-void-300 to-gray-100 bg-clip-text text-transparent tracking-tight">
            PayPerAgent
          </h1>
          <p className="text-xl md:text-3xl text-gray-400 mb-6 max-w-3xl mx-auto">
            Agentic x402 API Gateway
          </p>
          <p className="text-sm text-gray-600 mb-8 max-w-xl mx-auto px-4">
            Pay-per-use access to 25 APIs • Zero-knowledge payments • No subscriptions
          </p>
          <div className="mb-8 md:mb-12">
            <RotatingCapabilities />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mb-12 md:mb-16"
        >
          <a
            href="https://github.com/TheQuantumChronicle/payperagent"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-border px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm font-medium hover:bg-void-500/10 transition-all duration-500 text-void-300 hover:text-void-200 inline-block"
          >
            Get Started
          </a>
          <a
            href="/docs"
            className="px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm font-medium border border-gray-800 hover:border-void-500/30 transition-all duration-500 text-gray-500 hover:text-void-300 inline-block"
          >
            Documentation
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
        >
          <StatCard icon={<Zap />} value="25" label="APIs" />
          <StatCard icon={<Shield />} value="100%" label="Uptime" />
          <StatCard icon={<Coins />} value="$0" label="Gas Fees" />
          <StatCard icon={<TrendingUp />} value="3" label="SKALE Chains" />
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -3 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="cyber-border p-4 md:p-6 rounded-xl bg-black/40 group"
    >
      <div className="text-void-400 mb-2 flex justify-center group-hover:text-void-300 transition-colors duration-500 scale-90 md:scale-100">{icon}</div>
      <div className="text-2xl md:text-3xl font-bold mb-1 text-void-300">{value}</div>
      <div className="text-[10px] md:text-xs text-gray-600 uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}
