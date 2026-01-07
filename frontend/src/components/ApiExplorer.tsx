import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code, DollarSign, ChevronRight, ExternalLink, Terminal, Box } from 'lucide-react';

interface API {
  id: string;
  name: string;
  category: string;
  description: string;
  endpoint: string;
  price: string;
  example: string;
  response: string;
}

const apis: API[] = [
  {
    id: 'crypto',
    name: 'Crypto Prices',
    category: 'Finance',
    description: 'Real-time cryptocurrency prices from Binance',
    endpoint: '/api/crypto?symbol=BTCUSDT',
    price: '0.002',
    example: 'curl -H "X-PAYMENT: <sig>" "http://localhost:3000/api/crypto?symbol=BTCUSDT"',
    response: '{"symbol":"BTCUSDT","price":"43250.50","change24h":"+2.5%"}'
  },
  {
    id: 'weather',
    name: 'Weather Data',
    category: 'Data',
    description: 'Current weather conditions for any city',
    endpoint: '/api/weather?city=London',
    price: '0.001',
    example: 'curl -H "X-PAYMENT: <sig>" "http://localhost:3000/api/weather?city=London"',
    response: '{"temp":15,"condition":"Cloudy","humidity":75}'
  },
  {
    id: 'coingecko',
    name: 'CoinGecko',
    category: 'Finance',
    description: 'Top cryptocurrencies by market cap',
    endpoint: '/api/coingecko?per_page=5',
    price: '0.001',
    example: 'curl -H "X-PAYMENT: <sig>" "http://localhost:3000/api/coingecko?per_page=5"',
    response: '{"coins":[{"name":"Bitcoin","price":"$43250"}]}'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    category: 'Knowledge',
    description: 'Search Wikipedia articles and get summaries',
    endpoint: '/api/wikipedia/search?query=blockchain',
    price: '0.002',
    example: 'curl -H "X-PAYMENT: <sig>" "http://localhost:3000/api/wikipedia/search?query=blockchain"',
    response: '{"results":[{"title":"Blockchain","snippet":"..."}]}'
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Developer',
    description: 'Search repositories and get user info',
    endpoint: '/api/github/search?q=react',
    price: '0.003',
    example: 'curl -H "X-PAYMENT: <sig>" "http://localhost:3000/api/github/search?q=react"',
    response: '{"repos":[{"name":"react","stars":200000}]}'
  },
  {
    id: 'news',
    name: 'News Headlines',
    category: 'Media',
    description: 'Latest news headlines by category',
    endpoint: '/api/news?category=technology',
    price: '0.005',
    example: 'curl -H "X-PAYMENT: <sig>" "http://localhost:3000/api/news?category=technology"',
    response: '{"articles":[{"title":"AI Breakthrough","source":"TechCrunch"}]}'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    category: 'Social',
    description: 'Top posts from any subreddit',
    endpoint: '/api/reddit?subreddit=cryptocurrency',
    price: '0.002',
    example: 'curl -H "X-PAYMENT: <sig>" "http://localhost:3000/api/reddit?subreddit=cryptocurrency"',
    response: '{"posts":[{"title":"Bitcoin hits new high","upvotes":5000}]}'
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    category: 'AI',
    description: 'AI-powered web search and answers',
    endpoint: '/api/perplexity',
    price: '0.010',
    example: 'curl -H "X-PAYMENT: <sig>" -d "query=What is SKALE?" "http://localhost:3000/api/perplexity"',
    response: '{"answer":"SKALE is a zero-gas blockchain network..."}'
  }
];

const categories = ['All', 'Finance', 'Data', 'Knowledge', 'Developer', 'Media', 'Social', 'AI'];

export default function ApiExplorer() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApi, setSelectedApi] = useState<API | null>(null);

  const filteredApis = apis.filter(api => {
    const matchesCategory = selectedCategory === 'All' || api.category === selectedCategory;
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-void-500/5 blur-3xl rounded-full translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-glow-500/5 blur-3xl rounded-full -translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-void-500/10 border border-void-500/20 text-void-300 text-xs font-mono uppercase tracking-widest">
              <Terminal className="w-3 h-3" />
              <span>API Command Center</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
              Explore Functionality
            </h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Access 29+ decentralized endpoints. Filter by category, search by utility, and integrate in seconds.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-void-400/50 focus:bg-white/10 transition-all"
            />
          </div>
        </motion.div>

        {/* Custom Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
                selectedCategory === category
                  ? 'bg-void-500 text-white border-void-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Sleek Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {filteredApis.map((api, index) => (
            <motion.div
              key={api.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => setSelectedApi(api)}
              className="group cursor-pointer relative"
            >
              <div className="h-full p-5 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-void-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-void-500/10 flex items-center justify-center border border-void-500/20 group-hover:bg-void-500/20 transition-colors">
                    <Box className="w-5 h-5 text-void-300" />
                  </div>
                  <span className="text-xs font-mono text-void-400 bg-void-500/10 px-2 py-1 rounded border border-void-500/20">
                    {api.price} USDC
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-200 mb-2 group-hover:text-white transition-colors">
                  {api.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 group-hover:text-gray-400">
                  {api.description}
                </p>
                
                <div className="flex items-center text-xs text-gray-600 group-hover:text-void-300 transition-colors mt-auto">
                  <Code className="w-3 h-3 mr-1" />
                  <span>View Schema</span>
                  <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modern Modal */}
        <AnimatePresence>
          {selectedApi && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApi(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0A0A0B] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] md:max-h-[80vh] flex flex-col"
              >
                <div className="flex flex-col md:flex-row md:h-[600px] overflow-y-auto md:overflow-hidden">
                  {/* Left Sidebar */}
                  <div className="w-full md:w-1/3 bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-8 flex flex-col shrink-0">
                    <div className="mb-6">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono text-void-400 uppercase tracking-widest">{selectedApi.category}</span>
                        <button 
                          onClick={() => setSelectedApi(null)} 
                          className="md:hidden text-gray-500 hover:text-white p-1"
                        >
                          ✕
                        </button>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-4">{selectedApi.name}</h3>
                      <p className="text-gray-400 leading-relaxed text-sm">
                        {selectedApi.description}
                      </p>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="p-4 rounded-lg bg-void-500/5 border border-void-500/10">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-void-400" />
                          <span className="text-sm font-semibold text-gray-300">Pricing</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{selectedApi.price} <span className="text-sm font-normal text-gray-500">USDC</span></p>
                        <p className="text-xs text-gray-500 mt-1">Per successful request</p>
                      </div>

                      <a
                        href="/docs"
                        className="hidden md:flex items-center justify-center gap-2 w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                      >
                        Read Documentation
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="w-full md:w-2/3 p-6 md:p-8 md:overflow-y-auto bg-[#0A0A0B]">
                    <div className="hidden md:flex justify-between items-center mb-6">
                      <h4 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-void-400" />
                        Usage Example
                      </h4>
                      <button onClick={() => setSelectedApi(null)} className="text-gray-500 hover:text-white transition-colors">
                        Close
                      </button>
                    </div>

                    <div className="md:hidden mb-4 flex items-center gap-2 text-void-200 font-semibold">
                       <Terminal className="w-4 h-4 text-void-400" />
                       Usage Example
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Endpoint</label>
                        <div className="bg-black border border-white/10 rounded-lg p-3 font-mono text-sm text-void-300 break-all">
                          {selectedApi.endpoint}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">cURL Request</label>
                        <div className="bg-black border border-white/10 rounded-lg p-4 font-mono text-xs text-gray-400 overflow-x-auto relative group">
                          <code className="block whitespace-pre">{selectedApi.example}</code>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">JSON Response</label>
                        <div className="bg-black border border-white/10 rounded-lg p-4 font-mono text-xs text-void-400/90 overflow-x-auto">
                          <pre>{JSON.stringify(JSON.parse(selectedApi.response), null, 2)}</pre>
                        </div>
                      </div>

                      <a
                        href="/docs"
                        className="md:hidden flex items-center justify-center gap-2 w-full py-3 mt-6 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                      >
                        Read Documentation
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
