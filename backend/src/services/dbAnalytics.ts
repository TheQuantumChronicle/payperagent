import { query } from '../config/database';

export interface AnalyticsRecord {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  agentId?: string;
  ipAddress?: string;
  paymentAmount?: number;
  cached?: boolean;
  errorMessage?: string;
}

class DatabaseAnalytics {
  private useDatabase: boolean = true;
  private memoryBuffer: AnalyticsRecord[] = [];
  private maxMemoryBuffer: number = 1000;

  async track(record: AnalyticsRecord): Promise<void> {
    if (this.useDatabase) {
      try {
        await query(
          `INSERT INTO analytics 
           (endpoint, method, status_code, response_time, agent_id, ip_address, payment_amount, cached, error_message)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            record.endpoint,
            record.method,
            record.statusCode,
            record.responseTime,
            record.agentId,
            record.ipAddress,
            record.paymentAmount,
            record.cached || false,
            record.errorMessage,
          ]
        );
      } catch (error) {
        console.warn('⚠️  Database analytics write failed, using memory buffer');
        this.useDatabase = false;
        this.addToMemoryBuffer(record);
      }
    } else {
      this.addToMemoryBuffer(record);
    }
  }

  private addToMemoryBuffer(record: AnalyticsRecord): void {
    this.memoryBuffer.push(record);
    
    // Keep buffer size under control
    if (this.memoryBuffer.length > this.maxMemoryBuffer) {
      this.memoryBuffer.shift(); // Remove oldest
    }
  }

  async getStats(hours: number = 24): Promise<any> {
    if (this.useDatabase) {
      try {
        const result = await query(
          `SELECT 
             COUNT(*) as total_requests,
             COUNT(CASE WHEN status_code < 400 THEN 1 END) as successful_requests,
             COUNT(CASE WHEN status_code >= 400 THEN 1 END) as failed_requests,
             AVG(response_time)::INTEGER as avg_response_time,
             MIN(response_time) as min_response_time,
             MAX(response_time) as max_response_time,
             SUM(payment_amount) as total_revenue,
             COUNT(DISTINCT agent_id) as unique_agents,
             COUNT(CASE WHEN cached = true THEN 1 END) as cached_requests
           FROM analytics 
           WHERE timestamp > NOW() - INTERVAL '${hours} hours'`
        );

        const endpointStats = await query(
          `SELECT 
             endpoint,
             COUNT(*) as requests,
             AVG(response_time)::INTEGER as avg_time,
             SUM(payment_amount) as revenue
           FROM analytics 
           WHERE timestamp > NOW() - INTERVAL '${hours} hours'
           GROUP BY endpoint
           ORDER BY requests DESC`
        );

        return {
          overview: result.rows[0],
          endpoints: endpointStats.rows,
        };
      } catch (error) {
        console.warn('⚠️  Database analytics read failed, using memory buffer');
        this.useDatabase = false;
      }
    }

    // Fallback to memory buffer
    return this.getMemoryStats();
  }

  private getMemoryStats(): any {
    const recentRecords = this.memoryBuffer;

    const totalRequests = recentRecords.length;
    const successfulRequests = recentRecords.filter(r => r.statusCode < 400).length;
    const failedRequests = totalRequests - successfulRequests;
    const avgResponseTime = recentRecords.reduce((sum, r) => sum + r.responseTime, 0) / totalRequests || 0;

    return {
      overview: {
        total_requests: totalRequests,
        successful_requests: successfulRequests,
        failed_requests: failedRequests,
        avg_response_time: Math.round(avgResponseTime),
        total_revenue: recentRecords.reduce((sum, r) => sum + (r.paymentAmount || 0), 0),
        unique_agents: new Set(recentRecords.map(r => r.agentId).filter(Boolean)).size,
        cached_requests: recentRecords.filter(r => r.cached).length,
      },
      endpoints: [],
    };
  }

  async cleanup(daysToKeep: number = 30): Promise<number> {
    if (this.useDatabase) {
      try {
        const result = await query(
          `DELETE FROM analytics WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'`
        );
        const deleted = result.rowCount || 0;
        if (deleted > 0) {
          console.log(`🧹 Cleaned ${deleted} old analytics records`);
        }
        return deleted;
      } catch (error) {
        console.warn('⚠️  Database analytics cleanup failed');
      }
    }
    return 0;
  }
}

export const dbAnalytics = new DatabaseAnalytics();
