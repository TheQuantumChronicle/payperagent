import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Activity, TrendingUp, Database } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://payperagent.xyz';

export default function LiveData() {
  const { data: health, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/health`);
      return res.data;
    },
    refetchInterval: 5000,
  });


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
          <div className="inline-block mb-4">
            <span className="text-xs font-mono text-void-400 tracking-wider uppercase px-4 py-2 rounded-full border border-void-500/20 bg-void-500/5">
              Real-Time Network Data
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-void-300 to-gray-100 bg-clip-text text-transparent">
            Live Network Data
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Real-time blockchain metrics from SKALE Europa Hub
          </p>
        </motion.div>

        {isError && (
          <div className="text-center py-12">
            <div className="inline-block px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              Unable to connect to backend. Please ensure the server is running.
            </div>
          </div>
        )}

        {!isError && (
          <div className="grid md:grid-cols-3 gap-8">
            <DataCard
              icon={<Activity className="w-6 h-6" />}
              title="Chain ID"
              value={isLoading ? '...' : (health?.network?.chainId?.toLocaleString() || '...')}
              subtitle="Europa Hub"
              detail="Gas: Free (SKALE)"
              index={0}
              isLoading={isLoading}
            />
            
            <DataCard
              icon={<Database className="w-6 h-6" />}
              title="Network Status"
              value={isLoading ? '...' : (health?.status || '...')}
              subtitle={isLoading ? 'Loading...' : `Uptime: ${health?.uptime?.formatted || '...'}`}
              detail={`APIs: ${health?.apis || 25} endpoints`}
              index={1}
              isLoading={isLoading}
            />
            
            <DataCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Total APIs"
              value="25"
              subtitle="Live Endpoints"
              detail="25 integrated services"
              index={2}
              isLoading={false}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function DataCard({ icon, title, value, subtitle, detail, index, isLoading }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  detail: string;
  index: number;
  isLoading?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-void-500/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
      
      <div className="relative p-6 rounded-xl bg-black/40 border border-void-500/20 hover:border-void-400/40 transition-all duration-500 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-void-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-void-400 group-hover:text-void-300 transition-colors duration-300">
              {icon}
            </div>
            {!isLoading && <div className="w-2 h-2 rounded-full bg-void-400 animate-pulse" />}
            {isLoading && <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse" />}
          </div>
          
          <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
          {isLoading ? (
            <div className="h-9 bg-void-500/10 rounded animate-pulse mb-2" />
          ) : (
            <p className="text-3xl font-bold text-void-200 mb-2 group-hover:text-void-100 transition-colors duration-300">
              {value}
            </p>
          )}
          <p className="text-xs text-gray-600 mb-1">{subtitle}</p>
          <p className="text-xs text-gray-700">{detail}</p>
        </div>
      </div>
    </motion.div>
  );
}
