import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, Zap, Plus, Trash2 } from 'lucide-react';

interface ApiUsage {
  name: string;
  price: number;
  count: number;
}

const apiOptions = [
  { name: 'Crypto Prices', price: 0.002 },
  { name: 'Weather Data', price: 0.001 },
  { name: 'News Headlines', price: 0.005 },
  { name: 'CoinGecko', price: 0.001 },
  { name: 'Wikipedia', price: 0.002 },
  { name: 'GitHub', price: 0.003 },
  { name: 'Reddit', price: 0.002 },
  { name: 'Perplexity AI', price: 0.010 },
];

export default function PricingCalculator() {
  const [usage, setUsage] = useState<ApiUsage[]>([
    { name: 'Crypto Prices', price: 0.002, count: 100 },
    { name: 'Weather Data', price: 0.001, count: 50 },
  ]);

  const calculateTotal = () => {
    return usage.reduce((sum, api) => sum + (api.price * api.count), 0);
  };

  const calculateBatchDiscount = (requestCount: number) => {
    if (requestCount >= 100) return 0.30;
    if (requestCount >= 50) return 0.20;
    if (requestCount >= 20) return 0.10;
    return 0;
  };

  const totalRequests = usage.reduce((sum, api) => sum + api.count, 0);
  const subtotal = calculateTotal();
  const batchDiscount = calculateBatchDiscount(totalRequests);
  const batchSavings = subtotal * batchDiscount;
  const totalCost = subtotal - batchSavings;

  const updateCount = (index: number, count: number) => {
    const newUsage = [...usage];
    newUsage[index].count = Math.max(0, count);
    setUsage(newUsage);
  };

  const addApi = (apiName: string) => {
    const api = apiOptions.find(a => a.name === apiName);
    if (api && !usage.find(u => u.name === apiName)) {
      setUsage([...usage, { ...api, count: 10 }]);
    }
  };

  const removeApi = (index: number) => {
    setUsage(usage.filter((_, i) => i !== index));
  };

  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden bg-black">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Predictable <span className="text-void-300">Costs</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Scale from prototype to production. Pay only for valid requests.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: API Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-void-300" />
                  Configure Workload
                </h3>
                
                <div className="relative group">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addApi(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="appearance-none bg-void-500/10 border border-void-500/20 text-void-300 text-sm font-medium rounded-lg px-4 py-2 pr-8 focus:outline-none hover:bg-void-500/20 transition-colors cursor-pointer"
                  >
                    <option value="">+ Add Service</option>
                    {apiOptions
                      .filter(api => !usage.find(u => u.name === api.name))
                      .map(api => (
                        <option key={api.name} value={api.name}>
                          {api.name} (${api.price})
                        </option>
                      ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Plus className="w-3 h-3 text-void-300" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {usage.map((api, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={index} 
                    className="group bg-white/5 border border-white/5 rounded-xl p-5 hover:border-void-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center border border-white/10 text-gray-400 font-mono text-xs">
                          0{index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-200">{api.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{api.price} USDC / req</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeApi(index)}
                        className="text-gray-600 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative h-6 flex items-center">
                         <input
                          type="range"
                          min="0"
                          max="2000"
                          step="10"
                          value={api.count}
                          onChange={(e) => updateCount(index, parseInt(e.target.value))}
                          className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-void-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                        />
                      </div>
                      <div className="w-24 bg-black border border-white/10 rounded-lg flex items-center justify-center px-2 py-1">
                        <input
                          type="number"
                          value={api.count}
                          onChange={(e) => updateCount(index, parseInt(e.target.value) || 0)}
                          className="w-full bg-transparent text-right text-sm font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {usage.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl text-gray-500">
                    <p>No services selected. Add one to start estimating.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Cost Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 sticky top-24"
          >
            <div className="bg-gradient-to-br from-void-950 to-black border border-void-500/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-void-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

              <h3 className="text-lg font-semibold text-gray-300 mb-8 border-b border-white/10 pb-4">Estimated Monthly</h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Total Requests</span>
                  <span className="text-white font-mono">{totalRequests.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-300 font-mono">${subtotal.toFixed(4)}</span>
                </div>
                
                {batchDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm text-void-400">
                    <span className="flex items-center gap-1.5">
                      <TrendingDown className="w-3 h-3" />
                      Batch Savings ({(batchDiscount * 100).toFixed(0)}%)
                    </span>
                    <span className="font-mono">-${batchSavings.toFixed(4)}</span>
                  </div>
                )}
              </div>

              <div className="mb-8 p-4 bg-void-500/5 rounded-xl border border-void-500/10">
                <div className="text-xs text-void-400 uppercase tracking-wider font-semibold mb-1">Total Cost</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white tracking-tight">${totalCost.toFixed(4)}</span>
                  <span className="text-gray-500 font-medium">USDC</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-xs text-gray-500 bg-white/5 p-3 rounded-lg">
                  <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                  <p>SKALE Network covers all gas fees. You only pay for the API computation.</p>
                </div>
                
                <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/5">
                  Start Building Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
