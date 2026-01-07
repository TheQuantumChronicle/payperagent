import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalRequests: number;
    successfulRequests: number;
    successRate: string;
    averageResponseTime: string;
    totalRevenue: string;
    uniqueAgents: number;
  };
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:3000/analytics/usage');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);

  if (loading || !analytics) {
    return null;
  }

  const stats = [
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Total Requests',
      value: analytics.overview.totalRequests.toLocaleString(),
      color: 'text-blue-400',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Active Agents',
      value: analytics.overview.uniqueAgents.toLocaleString(),
      color: 'text-green-400',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Success Rate',
      value: analytics.overview.successRate,
      color: 'text-purple-400',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: 'Volume (24h)',
      value: analytics.overview.totalRevenue,
      color: 'text-yellow-400',
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-100 via-void-300 to-gray-100 bg-clip-text text-transparent">
            Network Activity
          </h2>
          <p className="text-gray-400 text-lg">
            Real-time metrics from the PayPerAgent ecosystem
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass rounded-2xl p-6 hover:glass-hover transition-all duration-300"
            >
              <div className={`${stat.color} mb-3`}>{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-void-100 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 glass rounded-2xl p-6 text-center"
        >
          <p className="text-gray-400">
            <span className="text-void-200 font-semibold">
              {analytics.overview.averageResponseTime}
            </span>{' '}
            average response time • Powered by SKALE Network
          </p>
        </motion.div>
      </div>
    </section>
  );
}
