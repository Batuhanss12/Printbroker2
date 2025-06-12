
import { memoryCache } from './cacheService';

interface SystemMetrics {
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: number;
  activeConnections: number;
  cacheSize: number;
  timestamp: number;
}

class SystemMonitor {
  private metrics: SystemMetrics[] = [];
  private maxMetrics = 100;

  collectMetrics(activeConnections: number): SystemMetrics {
    const metrics: SystemMetrics = {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage().user / 1000000, // Convert to seconds
      activeConnections,
      cacheSize: memoryCache.size(),
      timestamp: Date.now()
    };

    this.metrics.push(metrics);
    
    // Keep only last 100 metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    return metrics;
  }

  getMetrics(): SystemMetrics[] {
    return this.metrics;
  }

  getCurrentMetrics(): SystemMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  isSystemHealthy(): boolean {
    const current = this.getCurrentMetrics();
    if (!current) return true;

    const memoryMB = current.memoryUsage.heapUsed / 1024 / 1024;
    return memoryMB < 6000 && current.activeConnections < 1000; // Conservative limits
  }
}

export const systemMonitor = new SystemMonitor();

// Collect metrics every 30 seconds
setInterval(() => {
  // This will be called from routes.ts with actual connection count
}, 30000);
