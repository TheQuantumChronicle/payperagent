import { motion } from 'framer-motion';
import { Code, Zap, Lock } from 'lucide-react';

export default function Explanation() {
  return (
    <section className="py-20 md:py-32 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-void-900/10 via-transparent to-void-900/10" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="inline-block mb-4">
            <span className="text-xs font-mono text-void-400 tracking-wider uppercase px-4 py-2 rounded-full border border-void-500/20 bg-void-500/5">
              How It Works
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-void-300 to-gray-100 bg-clip-text text-transparent">
            Pay-Per-Use APIs
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            PayPerAgent is a blockchain-powered API gateway that lets AI agents and developers 
            access 25 APIs with <span className="text-void-300">microtransactions</span>. No subscriptions. 
            No API keys. Just pay for what you use.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <Step
            icon={<Code className="w-6 h-6" />}
            number="01"
            title="Make Request"
            description="Call any API endpoint with a simple HTTP request. Include payment proof in the header."
            index={0}
          />
          <Step
            icon={<Zap className="w-6 h-6" />}
            number="02"
            title="Instant Payment"
            description="Microtransaction settles on SKALE Network in milliseconds. Zero gas fees."
            index={1}
          />
          <Step
            icon={<Lock className="w-6 h-6" />}
            number="03"
            title="Get Data"
            description="Receive real-time data from CoinGecko, GitHub, Reddit, SKALE blockchain, and more."
            index={2}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="cyber-border p-6 md:p-12 rounded-2xl bg-black/40 backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-void-200">Built for AI Agents</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                Designed for autonomous agents that need instant API access without human intervention. 
                No registration, no KYC, no rate limits. Just code and go.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <a
                href="https://github.com/TheQuantumChronicle/payperagent"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-border px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm font-medium hover:bg-void-500/10 transition-all duration-500 text-void-300 hover:text-void-200 text-center"
              >
                View on GitHub
              </a>
              <a
                href="/docs"
                className="px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm font-medium border border-gray-800 hover:border-void-500/30 transition-all duration-500 text-gray-500 hover:text-void-300 text-center"
              >
                Read Documentation
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Step({ icon, number, title, description, index }: {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative"
    >
      <div className="text-5xl md:text-6xl font-bold text-void-500/10 mb-4">{number}</div>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-void-400">{icon}</div>
        <h3 className="text-xl font-bold text-gray-200">{title}</h3>
      </div>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}
