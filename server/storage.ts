import { db } from './db';
import { 
  users, quotes, printerQuotes, orders, ratings, 
  files, chatMessages, notifications
} from '../shared/schema';
import { eq, and, or, desc, sql } from 'drizzle-orm';

type InsertUser = typeof users.$inferInsert;
type InsertQuote = typeof quotes.$inferInsert;
type InsertPrinterQuote = typeof printerQuotes.$inferInsert;
type InsertOrder = typeof orders.$inferInsert;
type InsertRating = typeof ratings.$inferInsert;
type InsertFile = typeof files.$inferInsert;
type InsertChatMessage = typeof chatMessages.$inferInsert;
type InsertNotification = typeof notifications.$inferInsert;

export interface IStorage {
  // User methods
  createUser(user: InsertUser): Promise<any>;
  getUserByEmail(email: string): Promise<any | null>;
  getUserById(id: string): Promise<any | null>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<void>;
  updateUserByEmail(email: string, updates: Partial<InsertUser>): Promise<void>;

  // Quote methods
  createQuote(quote: InsertQuote): Promise<any>;
  getQuoteById(id: string): Promise<any | null>;
  getQuotesByUserId(userId: string): Promise<any[]>;
  updateQuote(id: string, updates: Partial<InsertQuote>): Promise<void>;

  // Printer quote methods
  createPrinterQuote(printerQuote: InsertPrinterQuote): Promise<any>;
  getPrinterQuotesByQuoteId(quoteId: string): Promise<any[]>;
  getPrinterQuotesByPrinterId(printerId: string): Promise<any[]>;
  updatePrinterQuote(id: string, updates: Partial<InsertPrinterQuote>): Promise<void>;

  // Order methods
  createOrder(order: InsertOrder): Promise<any>;
  getOrderById(id: string): Promise<any | null>;
  getOrdersByUserId(userId: string): Promise<any[]>;
  updateOrder(id: string, updates: Partial<InsertOrder>): Promise<void>;

  // Rating methods
  createReview(review: InsertRating): Promise<any>;
  getReviewsByPrinterId(printerId: string): Promise<any[]>;
  updateReview(id: string, updates: Partial<InsertRating>): Promise<void>;

  // File methods
  createUpload(upload: InsertFile): Promise<any>;
  getUploadsByUserId(userId: string): Promise<any[]>;

  // Message methods
  createMessage(message: InsertChatMessage): Promise<any>;
  getMessagesByRoomId(roomId: string): Promise<any[]>;

  // Notification methods
  createNotification(notification: InsertNotification): Promise<any>;
  getNotifications(userId: string): Promise<any[]>;
  markNotificationAsRead(notificationId: string, userId: string): Promise<void>;
  deleteNotification(notificationId: string, userId: string): Promise<void>;

  // Admin methods
  getAllUsers(): Promise<any[]>;
  getAllQuotes(): Promise<any[]>;
  getAllOrders(): Promise<any[]>;
  getActiveUserCount(): Promise<number>;
  getTotalUploads(): Promise<number>;
  getProcessedJobs(): Promise<number>;
  deleteUser(userId: string): Promise<void>;
  verifyCompany(companyId: string, status: string, notes: string): Promise<void>;
  getPendingVerifications(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async createUser(user: InsertUser): Promise<any> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getUserByEmail(email: string): Promise<any | null> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  }

  async getUserById(id: string): Promise<any | null> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<void> {
    await db.update(users).set(updates).where(eq(users.id, id));
  }

  async updateUserByEmail(email: string, updates: Partial<InsertUser>): Promise<void> {
    await db.update(users).set(updates).where(eq(users.email, email));
  }

  // Quote methods
  async createQuote(quote: InsertQuote): Promise<any> {
    const result = await db.insert(quotes).values(quote).returning();
    return result[0];
  }

  async getQuoteById(id: string): Promise<any | null> {
    const result = await db.select().from(quotes).where(eq(quotes.id, id));
    return result[0] || null;
  }

  async getQuotesByUserId(userId: string): Promise<any[]> {
    return await db.select().from(quotes).where(eq(quotes.customerId, userId));
  }

  async updateQuote(id: string, updates: Partial<InsertQuote>): Promise<void> {
    await db.update(quotes).set(updates).where(eq(quotes.id, id));
  }

  // Printer quote methods
  async createPrinterQuote(printerQuote: InsertPrinterQuote): Promise<any> {
    const result = await db.insert(printerQuotes).values(printerQuote).returning();
    return result[0];
  }

  async getPrinterQuotesByQuoteId(quoteId: string): Promise<any[]> {
    return await db.select().from(printerQuotes).where(eq(printerQuotes.quoteId, quoteId));
  }

  async getPrinterQuotesByPrinterId(printerId: string): Promise<any[]> {
    return await db.select().from(printerQuotes).where(eq(printerQuotes.printerId, printerId));
  }

  async updatePrinterQuote(id: string, updates: Partial<InsertPrinterQuote>): Promise<void> {
    await db.update(printerQuotes).set(updates).where(eq(printerQuotes.id, id));
  }

  // Order methods
  async createOrder(order: InsertOrder): Promise<any> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOrderById(id: string): Promise<any | null> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0] || null;
  }

  async getOrdersByUserId(userId: string): Promise<any[]> {
    return await db.select().from(orders).where(eq(orders.customerId, userId));
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<void> {
    await db.update(orders).set(updates).where(eq(orders.id, id));
  }

  // Rating methods
  async createReview(review: InsertRating): Promise<any> {
    const result = await db.insert(ratings).values(review).returning();
    return result[0];
  }

  async getReviewsByPrinterId(printerId: string): Promise<any[]> {
    return await db.select().from(ratings).where(eq(ratings.printerId, printerId));
  }

  async updateReview(id: string, updates: Partial<InsertRating>): Promise<void> {
    await db.update(ratings).set(updates).where(eq(ratings.id, id));
  }

  // File methods
  async createUpload(upload: InsertFile): Promise<any> {
    const result = await db.insert(files).values(upload).returning();
    return result[0];
  }

  async getUploadsByUserId(userId: string): Promise<any[]> {
    return await db.select().from(files).where(eq(files.uploadedBy, userId));
  }

  // Message methods
  async createMessage(message: InsertChatMessage): Promise<any> {
    const result = await db.insert(chatMessages).values(message).returning();
    return result[0];
  }

  async getMessagesByRoomId(roomId: string): Promise<any[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.roomId, roomId));
  }

  // Notification methods
  async createNotification(notification: InsertNotification): Promise<any> {
    const result = await db.insert(notifications).values(notification).returning();
    return result[0];
  }

  async getNotifications(userId: string): Promise<any[]> {
    return await db.select().from(notifications).where(eq(notifications.recipientId, userId));
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    await db.update(notifications).set({ 
      readAt: new Date() 
    }).where(and(
      eq(notifications.id, notificationId),
      eq(notifications.recipientId, userId)
    ));
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await db.delete(notifications).where(and(
      eq(notifications.id, notificationId),
      eq(notifications.recipientId, userId)
    ));
  }

  // Admin methods
  async getAllUsers(): Promise<any[]> {
    return await db.select().from(users);
  }

  async getAllQuotes(): Promise<any[]> {
    return await db.select().from(quotes);
  }

  async getAllOrders(): Promise<any[]> {
    return await db.select().from(orders);
  }

  async getActiveUserCount(): Promise<number> {
    const result = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.isActive, true));
    return Number(result[0]?.count || 0);
  }

  async getTotalUploads(): Promise<number> {
    const result = await db.select({ count: sql`count(*)` }).from(files);
    return Number(result[0]?.count || 0);
  }

  async getProcessedJobs(): Promise<number> {
    const result = await db.select({ count: sql`count(*)` }).from(orders).where(eq(orders.status, 'delivered'));
    return Number(result[0]?.count || 0);
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }

  async verifyCompany(companyId: string, status: string, notes: string): Promise<void> {
    await db.update(users).set({ 
      subscriptionStatus: status === 'approved' ? 'active' : 'inactive'
    }).where(eq(users.id, companyId));
  }

  async getPendingVerifications(): Promise<any[]> {
    return await db.select().from(users).where(and(
      eq(users.role, 'printer'),
      eq(users.subscriptionStatus, 'inactive')
    ));
  }
}

export const storage = new DatabaseStorage();