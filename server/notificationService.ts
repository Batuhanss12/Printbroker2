import { WebSocket } from 'ws';

interface NotificationClients {
  [userId: string]: Set<WebSocket>;
}

interface EnhancedNotificationMessage {
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  actionRequired: boolean;
  timestamp: string;
  metadata?: {
    amount?: string;
    quantity?: number;
    location?: string;
    deadline?: string;
    customerName?: string;
    printerName?: string;
  };
  quote?: any;
}

class EnterpriseNotificationService {
  private clients: NotificationClients = {};
  private messageQueue: Map<string, EnhancedNotificationMessage[]> = new Map();
  private connectionLog: Map<string, { lastSeen: Date; connectionCount: number }> = new Map();

  addClient(userId: string, ws: WebSocket) {
    if (!this.clients[userId]) {
      this.clients[userId] = new Set();
    }
    this.clients[userId].add(ws);
    
    // Update connection log
    this.connectionLog.set(userId, {
      lastSeen: new Date(),
      connectionCount: this.clients[userId].size
    });

    // Send queued messages
    this.sendQueuedMessages(userId);
    
    console.log(`📱 User ${userId} connected to notifications (${this.clients[userId].size} connections)`);
  }

  removeClient(userId: string, ws: WebSocket) {
    if (this.clients[userId]) {
      this.clients[userId].delete(ws);
      if (this.clients[userId].size === 0) {
        delete this.clients[userId];
        console.log(`📱 User ${userId} disconnected from notifications`);
      } else {
        console.log(`📱 User ${userId} has ${this.clients[userId].size} remaining connections`);
      }
      
      // Update connection log
      this.connectionLog.set(userId, {
        lastSeen: new Date(),
        connectionCount: this.clients[userId]?.size || 0
      });
    }
  }

  broadcastToUser(userId: string, message: EnhancedNotificationMessage) {
    const userClients = this.clients[userId];
    
    if (userClients && userClients.size > 0) {
      const messageStr = JSON.stringify(message);
      let successfulSends = 0;
      
      userClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(messageStr);
            successfulSends++;
          } catch (error) {
            console.error(`Failed to send notification to user ${userId}:`, error);
          }
        }
      });
      
      if (successfulSends > 0) {
        console.log(`📤 Notification sent to user ${userId} (${successfulSends}/${userClients.size} connections)`);
      } else {
        // Queue message if no successful sends
        this.queueMessage(userId, message);
        console.log(`📦 Notification queued for user ${userId} (no active connections)`);
      }
    } else {
      // Queue message for offline users
      this.queueMessage(userId, message);
      console.log(`📦 Notification queued for offline user ${userId}`);
    }
  }

  broadcastToAllPrinters(message: EnhancedNotificationMessage) {
    // This would require access to user roles - simplified for now
    Object.keys(this.clients).forEach(userId => {
      this.broadcastToUser(userId, message);
    });
  }

  private queueMessage(userId: string, message: EnhancedNotificationMessage) {
    if (!this.messageQueue.has(userId)) {
      this.messageQueue.set(userId, []);
    }
    
    const userQueue = this.messageQueue.get(userId)!;
    userQueue.push(message);
    
    // Keep only last 20 messages per user
    if (userQueue.length > 20) {
      userQueue.splice(0, userQueue.length - 20);
    }
  }

  private sendQueuedMessages(userId: string) {
    const queuedMessages = this.messageQueue.get(userId);
    if (queuedMessages && queuedMessages.length > 0) {
      console.log(`📬 Sending ${queuedMessages.length} queued messages to user ${userId}`);
      
      queuedMessages.forEach(message => {
        this.broadcastToUser(userId, message);
      });
      
      // Clear queue after sending
      this.messageQueue.delete(userId);
    }
  }

  getActiveConnectionCount(): number {
    return Object.values(this.clients).reduce((total, clients) => total + clients.size, 0);
  }

  getConnectionStats() {
    return {
      activeConnections: this.getActiveConnectionCount(),
      connectedUsers: Object.keys(this.clients).length,
      queuedMessages: Array.from(this.messageQueue.values()).reduce((total, queue) => total + queue.length, 0),
      connectionLog: Object.fromEntries(this.connectionLog)
    };
  }

  // Enhanced notification methods for different types
  sendQuoteNotification(printerId: string, quote: any) {
    const message: EnhancedNotificationMessage = {
      type: 'new_quote_notification',
      title: 'Yeni Teklif Talebi',
      message: `${quote.category || 'Genel Baskı'} - ${quote.quantity?.toLocaleString() || 'Belirsiz'} adet - ₺${quote.totalPrice || 'TBD'}`,
      priority: 'high',
      category: 'quotes',
      actionRequired: true,
      timestamp: new Date().toISOString(),
      metadata: {
        amount: `₺${quote.totalPrice}`,
        quantity: quote.quantity,
        location: quote.location,
        deadline: quote.deadline,
        customerName: quote.customerName
      },
      quote: {
        id: quote.id,
        title: quote.title,
        category: quote.category,
        quantity: quote.quantity,
        totalPrice: quote.totalPrice,
        location: quote.location,
        deadline: quote.deadline
      }
    };
    
    this.broadcastToUser(printerId, message);
  }

  sendQuoteResponseNotification(customerId: string, quote: any, response: any) {
    const message: EnhancedNotificationMessage = {
      type: 'quote_response_notification',
      title: 'Teklif Yanıtı Alındı',
      message: `${response.printerName} firmasından teklif yanıtı: ₺${response.price}`,
      priority: 'medium',
      category: 'quotes',
      actionRequired: true,
      timestamp: new Date().toISOString(),
      metadata: {
        amount: `₺${response.price}`,
        printerName: response.printerName
      },
      quote: quote
    };
    
    this.broadcastToUser(customerId, message);
  }

  // Cleanup old connections and queued messages
  cleanup() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    // Clean up old queued messages
    this.messageQueue.forEach((messages, userId) => {
      const recentMessages = messages.filter(msg => 
        new Date(msg.timestamp) > oneHourAgo
      );
      
      if (recentMessages.length !== messages.length) {
        if (recentMessages.length > 0) {
          this.messageQueue.set(userId, recentMessages);
        } else {
          this.messageQueue.delete(userId);
        }
      }
    });
  }
}

export const notificationService = new EnterpriseNotificationService();

// Cleanup every 30 minutes
setInterval(() => {
  notificationService.cleanup();
}, 30 * 60 * 1000);