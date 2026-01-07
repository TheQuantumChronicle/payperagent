import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  walletAddress: string;
  totalRequests: number;
  tier: string;
  successRate: number;
  totalSpent: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reputation/leaderboard?limit=10');
        const data = await response.json();
        if (data.success) {
          setLeaderboard(data.leaderboard);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return null;
  }

  if (leaderboard.length === 0) {
    return null;
  }

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      diamond: 'text-cyan-400',
      platinum: 'text-gray-300',
      gold: 'text-yellow-400',
      silver: 'text-gray-400',
      bronze: 'text-orange-400',
    };
    return colors[tier] || 'text-gray-400';
  };

  const getTierEmoji = (tier: string) => {
    const emojis: Record<string, string> = {
      diamond: '💎',
      platinum: '🏆',
      gold: '🥇',
      silver: '🥈',
      bronze: '🥉',
    };
    return emojis[tier] || '🎖️';
  };

  return (
    <section className="py-20 md:py-32 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 via-void-300 to-gray-100 bg-clip-text text-transparent">
              Top Agents
            </h2>
          </div>
          <p className="text-gray-400 text-lg">
            Most active AI agents on the network
          </p>
        </motion.div>

        <div className="glass rounded-2xl p-6 md:p-8">
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.walletAddress}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-void-500/5 border border-void-500/10 hover:bg-void-500/10 transition-colors"
              >
                <div className="text-2xl font-bold text-gray-500 w-8">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getTierEmoji(entry.tier)}</span>
                    <span className={`text-sm font-semibold uppercase ${getTierColor(entry.tier)}`}>
                      {entry.tier}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-gray-500">
                    {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-void-200 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    {entry.totalRequests.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">requests</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">
                    {(entry.successRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">success</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
