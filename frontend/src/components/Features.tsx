import { motion } from 'framer-motion';
import { Zap, Shield, Coins, Layers, TrendingUp, Users } from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Circuit Breakers',
    description: 'Automatic failure detection & recovery. 8 external services protected.',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Real-time Updates',
    description: 'WebSocket support for live crypto prices & system metrics.',
  },
  {
    icon: <Coins className="w-8 h-8" />,
    title: 'Multi-Token Support',
    description: 'Pay with USDC, USDT, SKL, or WETH. Your choice.',
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: 'Volume Discounts',
    description: 'Batch requests save up to 30%. Scale efficiently.',
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Performance Monitoring',
    description: 'P50/P95/P99 latency tracking. Sub-10ms average response time.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Enhanced Reliability',
    description: 'Custom error handling, request validation, comprehensive health checks.',
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="inline-block mb-4">
            <span className="text-xs font-mono text-void-400 tracking-wider uppercase px-4 py-2 rounded-full border border-void-500/20 bg-void-500/5">
              Core Features
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-void-300 to-gray-100 bg-clip-text text-transparent">
            Built for Privacy
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Enterprise-grade infrastructure. Zero compromises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-void-500/5 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              
              <div className="relative glass p-6 md:p-8 rounded-2xl border border-void-500/10 hover:border-void-500/20 transition-all duration-500 h-full">
                <div className="text-void-400 mb-6 group-hover:text-void-300 group-hover:scale-110 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-200">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
