import { motion } from 'framer-motion';
import { Gamepad2, TrendingUp, MessageSquare, Coins, Zap, Shield } from 'lucide-react';

export default function SkaleEcosystem() {
  const hubs = [
    {
      name: 'Europa Hub',
      icon: <Coins className="w-8 h-8" />,
      description: 'DeFi & Liquidity',
      color: 'from-blue-500 to-cyan-500',
      integrations: ['Ruby.Exchange DEX', 'Token Prices', 'Swap Quotes', 'Pool Liquidity'],
      endpoint: '/api/ruby',
    },
    {
      name: 'Nebula Hub',
      icon: <Gamepad2 className="w-8 h-8" />,
      description: 'Gaming Ecosystem',
      color: 'from-purple-500 to-pink-500',
      integrations: ['CryptoBlades', 'BitHotel', 'Mystrios', 'MotoDex', '5tars'],
      endpoint: '/api/gaming',
    },
    {
      name: 'Calypso Hub',
      icon: <Shield className="w-8 h-8" />,
      description: 'NFT Marketplace',
      color: 'from-green-500 to-emerald-500',
      integrations: ['NFT Prices', 'Game Assets', 'Bazaar Integration', 'Collections'],
      endpoint: '/api/gaming/nft',
    },
    {
      name: 'Chirper AI',
      icon: <MessageSquare className="w-8 h-8" />,
      description: 'AI Social Network',
      color: 'from-orange-500 to-red-500',
      integrations: ['Trending Topics', 'Sentiment Analysis', 'AI Conversations', 'Agent Stats'],
      endpoint: '/api/chirper',
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: 'Zero Gas Fees',
      description: 'All SKALE transactions are completely free',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
      title: 'Instant Settlement',
      description: 'Sub-second transaction finality',
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: 'Ethereum Security',
      description: 'Secured by Ethereum mainnet',
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void-900/20 via-transparent to-void-900/20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-void-300 to-gray-100 bg-clip-text text-transparent">
            SKALE Ecosystem Integration
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Access the entire SKALE network through one unified API gateway
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass rounded-xl p-6 text-center"
            >
              <div className="inline-flex mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-semibold text-void-100 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* SKALE Hubs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hubs.map((hub, index) => (
            <motion.div
              key={hub.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass rounded-2xl p-8 hover:glass-hover transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${hub.color} text-white`}>
                  {hub.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-void-100 mb-1">{hub.name}</h3>
                  <p className="text-gray-400">{hub.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {hub.integrations.map((integration) => (
                  <div
                    key={integration}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${hub.color}`} />
                    {integration}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-void-500/20">
                <code className="text-xs text-void-300 font-mono">
                  GET {hub.endpoint}
                </code>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 glass rounded-2xl p-8 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-void-100 mb-2">4</div>
              <div className="text-sm text-gray-400">SKALE Hubs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-void-100 mb-2">15+</div>
              <div className="text-sm text-gray-400">dApp Integrations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-void-100 mb-2">0%</div>
              <div className="text-sm text-gray-400">Gas Fees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-void-100 mb-2">&lt;1s</div>
              <div className="text-sm text-gray-400">Transaction Time</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
