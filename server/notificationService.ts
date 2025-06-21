import { WebSocket } from 'ws';

interface NotificationClients {
  [userId: string]: Set<WebSocket>;
}

class NotificationService {
  private clients: NotificationClients = {};

  addClient(userId: string, ws: WebSocket) {
    if (!this.clients[userId]) {
      this.clients[userId] = new Set();
    }
    this.clients[userId].add(ws);
  }

  removeClient(userId: string, ws: WebSocket) {
    if (this.clients[userId]) {
      this.clients[userId].delete(ws);
      if (this.clients[userId].size === 0) {
        delete this.clients[userId];
      }
    }
  }

  broadcastToUser(userId: string, message: any) {
    const userClients = this.clients[userId];
    if (userClients) {
      const messageStr = JSON.stringify(message);
      userClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
  }

  getActiveConnectionCount(): number {
    return Object.values(this.clients).reduce((total, clients) => total + clients.size, 0);
  }
}

export const notificationService = new NotificationService();