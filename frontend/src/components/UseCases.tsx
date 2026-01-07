import { motion } from 'framer-motion';
import { Bot, TrendingUp, Search, MessageSquare, Sparkles, Code } from 'lucide-react';

const useCases = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Trading Bots',
    description: 'Autonomous agents that monitor crypto prices and execute trades.',
    apis: ['Crypto Prices', 'CoinGecko'],
    cost: '$0.15/day',
    gradient: 'from-void-500 to-indigo-400'
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Research Agents',
    description: 'Gather intel from Wikipedia, News, and Web Search instantly.',
    apis: ['Wikipedia', 'Perplexity AI'],
    cost: '$0.25/day',
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Social Monitors',
    description: 'Track viral trends and sentiment across Reddit and social media.',
    apis: ['Reddit', 'HackerNews'],
    cost: '$0.10/day',
    gradient: 'from-purple-500 to-pink-400'
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: 'Personal Assistants',
    description: 'Daily briefings, weather updates, and calendar management.',
    apis: ['Weather', 'News'],
    cost: '$0.08/day',
    gradient: 'from-orange-500 to-red-400'
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Dev Tools',
    description: 'Automate GitHub issue tracking and repository management.',
    apis: ['GitHub', 'IP Lookup'],
    cost: '$0.12/day',
    gradient: 'from-indigo-500 to-violet-400'
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Custom Agents',
    description: 'Mix and match 29+ APIs to build anything you can imagine.',
    apis: ['Any Combination'],
    cost: 'Flexible',
    gradient: 'from-white to-gray-400'
  }
];

export default function UseCases() {
  return (
    <section className="py-20 md:py-32 px-4 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Real-World <span className="text-transparent bg-clip-text bg-gradient-to-r from-void-300 to-purple-400">Applications</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From automated trading to intelligent research, see what's possible when agents have zero-friction access to the world's data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl blur-xl"
                   style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
              
              <div className="relative h-full p-8 rounded-2xl bg-[#0A0A0B] border border-white/5 hover:border-white/10 transition-all duration-300 group-hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${useCase.gradient} p-0.5 mb-6`}>
                  <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center">
                    <div className={`text-transparent bg-clip-text bg-gradient-to-br ${useCase.gradient}`}>
                      {useCase.icon}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                  {useCase.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {useCase.description}
                </p>
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Est. Cost</span>
                    <span className="text-sm font-mono text-gray-300">{useCase.cost}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Key APIs</span>
                    <div className="flex -space-x-2">
                       {useCase.apis.slice(0, 3).map((api, i) => (
                         <div key={i} className="w-6 h-6 rounded-full bg-void-500/20 border border-black flex items-center justify-center text-[10px] text-gray-300" title={api}>
                           {api[0]}
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
