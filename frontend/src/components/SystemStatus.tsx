import { useState, useEffect } from 'react';
import { Activity, Zap, Database, Shield, TrendingUp, Wifi } from 'lucide-react';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface HealthData {
  status: string;
  uptime: { formatted: string };
  memory: { usage: string };
  database: { status: string };
  externalServices: {
    status: string;
    openCircuits: number;
    totalCircuits: number;
  };
}

export default function SystemStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isConnected: wsConnected, subscribe, lastMessage } = useWebSocketContext();

  useEffect(() => {
    if (wsConnected) {
      // Small delay to ensure connection is fully established
      const timer = setTimeout(() => {
        subscribe('system');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [wsConnected, subscribe]);

  useEffect(() => {
    if (lastMessage?.type === 'system_metrics' && lastMessage.data) {
      console.log('Received system metrics:', lastMessage.data);
    }
  }, [lastMessage]);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://payperagent.xyz';
        const response = await fetch(`${apiUrl}/health`);
        const data = await response.json();
        setHealth(data);
      } catch (error) {
        console.error('Failed to fetch health:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-8 animate-pulse">
        <div className="h-8 bg-void-500/20 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-void-500/20 rounded"></div>
          <div className="h-4 bg-void-500/20 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!health) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '🟢';
      case 'degraded': return '🟡';
      default: return '🔴';
    }
  };

  return (
    <div className="glass rounded-2xl p-8 hover:glass-hover transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-void-400" />
        <h3 className="text-2xl font-bold text-void-100">System Status</h3>
        {wsConnected && (
          <div className="flex items-center gap-2 ml-4">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">Live</span>
          </div>
        )}
        <span className={`ml-auto text-lg font-semibold ${getStatusColor(health.status)}`}>
          {getStatusIcon(health.status)} {health.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Uptime */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-void-500/5 border border-void-500/10">
          <Zap className="w-5 h-5 text-void-400" />
          <div>
            <p className="text-sm text-gray-400">Uptime</p>
            <p className="text-lg font-semibold text-void-200">{health.uptime.formatted}</p>
          </div>
        </div>

        {/* Memory */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-void-500/5 border border-void-500/10">
          <TrendingUp className="w-5 h-5 text-void-400" />
          <div>
            <p className="text-sm text-gray-400">Memory Usage</p>
            <p className="text-lg font-semibold text-void-200">{health.memory.usage}</p>
          </div>
        </div>

        {/* Database */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-void-500/5 border border-void-500/10">
          <Database className="w-5 h-5 text-void-400" />
          <div>
            <p className="text-sm text-gray-400">Database</p>
            <p className="text-lg font-semibold text-void-200 capitalize">{health.database.status}</p>
          </div>
        </div>

        {/* Circuit Breakers */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-void-500/5 border border-void-500/10">
          <Shield className="w-5 h-5 text-void-400" />
          <div>
            <p className="text-sm text-gray-400">Circuit Breakers</p>
            <p className="text-lg font-semibold text-void-200">
              {health.externalServices.totalCircuits - health.externalServices.openCircuits}/{health.externalServices.totalCircuits} Active
            </p>
          </div>
        </div>
      </div>

      {health.externalServices.openCircuits > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-400">
            ⚠️ {health.externalServices.openCircuits} external service(s) temporarily unavailable
          </p>
        </div>
      )}
    </div>
  );
}
