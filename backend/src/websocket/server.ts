/**
 * WebSocket Server for Real-time Updates
 * Provides live crypto prices, system metrics, and event notifications
 */

import { Server as HTTPServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import axios from 'axios';

interface WSClient {
  ws: WebSocket;
  subscriptions: Set<string>;
  agentId?: string;
}

export class RealtimeServer {
  private wss: WebSocketServer;
  private clients: Map<WebSocket, WSClient> = new Map();
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(server: HTTPServer) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws',
      verifyClient: (info: { origin: string; secure: boolean; req: any }) => {
        // Allow all connections in development
        console.log('WebSocket connection attempt from:', info.origin);
        return true;
      }
    });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('🔌 New WebSocket connection');
      
      const client: WSClient = {
        ws,
        subscriptions: new Set(),
      };
      
      this.clients.set(ws, client);

      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        console.log('🔌 WebSocket connection closed');
        this.clients.delete(ws);
      });

      ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to PayPerAgent WebSocket',
        timestamp: new Date().toISOString(),
      }));
    });

    // Start system metrics broadcast
    this.startSystemMetricsBroadcast();
  }

  private handleMessage(ws: WebSocket, message: any) {
    const client = this.clients.get(ws);
    if (!client) return;

    switch (message.type) {
      case 'subscribe':
        this.handleSubscribe(client, message.channel, message.params);
        break;
      
      case 'unsubscribe':
        this.handleUnsubscribe(client, message.channel);
        break;
      
      case 'identify':
        client.agentId = message.agentId;
        ws.send(JSON.stringify({
          type: 'identified',
          agentId: message.agentId,
          timestamp: new Date().toISOString(),
        }));
        break;
      
      default:
        ws.send(JSON.stringify({ error: 'Unknown message type' }));
    }
  }

  private handleSubscribe(client: WSClient, channel: string, params?: any) {
    client.subscriptions.add(channel);
    
    client.ws.send(JSON.stringify({
      type: 'subscribed',
      channel,
      timestamp: new Date().toISOString(),
    }));

    // Start channel-specific updates
    switch (channel) {
      case 'crypto':
        this.startCryptoUpdates(params?.symbols || 'BTCUSDT,ETHUSDT');
        break;
      
      case 'system':
        // System metrics are already broadcasting
        break;
      
      case 'events':
        // Event notifications
        break;
    }
  }

  private handleUnsubscribe(client: WSClient, channel: string) {
    client.subscriptions.delete(channel);
    
    client.ws.send(JSON.stringify({
      type: 'unsubscribed',
      channel,
      timestamp: new Date().toISOString(),
    }));
  }

  private startCryptoUpdates(symbols: string) {
    const intervalKey = `crypto:${symbols}`;
    
    if (this.updateIntervals.has(intervalKey)) {
      return; // Already running
    }

    // Fetch immediately on start
    this.fetchAndBroadcastCrypto(symbols);

    const interval = setInterval(async () => {
      // Only fetch if there are active subscribers
      const hasSubscribers = Array.from(this.clients.values()).some(
        client => client.subscriptions.has('crypto')
      );
      if (hasSubscribers) {
        await this.fetchAndBroadcastCrypto(symbols);
      }
    }, 5000); // Update every 5 seconds

    this.updateIntervals.set(intervalKey, interval);
  }

  private async fetchAndBroadcastCrypto(symbols: string) {
    try {
      // Fetch directly from Binance API (no payment required for WebSocket internal use)
      const symbolList = symbols.toUpperCase().split(',').map(s => s.trim());
      const baseUrl = 'https://api.binance.com/api/v3';
      
      const pricePromises = symbolList.map(async (symbol) => {
        const [tickerResponse, statsResponse] = await Promise.all([
          axios.get(`${baseUrl}/ticker/price`, { params: { symbol }, timeout: 5000 }),
          axios.get(`${baseUrl}/ticker/24hr`, { params: { symbol }, timeout: 5000 }),
        ]);

        return {
          symbol,
          price: parseFloat(tickerResponse.data.price),
          priceChangePercent: parseFloat(statsResponse.data.priceChangePercent),
        };
      });

      const results = await Promise.all(pricePromises);
      
      // Format data
      const formattedData: any = {};
      results.forEach((result) => {
        const baseCurrency = result.symbol.replace('USDT', '').toLowerCase();
        formattedData[baseCurrency] = {
          usd: result.price,
          usd_24h_change: result.priceChangePercent,
        };
      });

      this.broadcast('crypto', {
        type: 'crypto_update',
        data: formattedData,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error fetching crypto prices:', error.message);
      // Don't broadcast errors, just log them
    }
  }

  private startSystemMetricsBroadcast() {
    const interval = setInterval(() => {
      // Only broadcast if there are active subscribers
      const hasSubscribers = Array.from(this.clients.values()).some(
        client => client.subscriptions.has('system')
      );
      
      if (hasSubscribers) {
        const metrics = {
          uptime: process.uptime(),
          memory: {
            heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
          },
          connections: this.clients.size,
        };

        this.broadcast('system', {
          type: 'system_metrics',
          data: metrics,
          timestamp: new Date().toISOString(),
        });
      }
    }, 10000); // Update every 10 seconds

    this.updateIntervals.set('system', interval);
  }

  private broadcast(channel: string, message: any) {
    this.clients.forEach((client) => {
      if (client.subscriptions.has(channel) && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  public broadcastEvent(event: string, data: any) {
    this.broadcast('events', {
      type: 'event',
      event,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  public getStats() {
    return {
      connections: this.clients.size,
      channels: Array.from(this.updateIntervals.keys()),
    };
  }

  public close() {
    this.updateIntervals.forEach((interval) => clearInterval(interval));
    this.updateIntervals.clear();
    this.wss.close();
  }
}
