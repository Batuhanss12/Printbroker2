import {
  users,
  quotes,
  printerQuotes,
  orders,
  ratings,
  files,
  chatRooms,
  chatMessages,
  contracts,
  type User,
  type UpsertUser,
  type InsertQuote,
  type Quote,
  type InsertPrinterQuote,
  type PrinterQuote,
  type InsertOrder,
  type Order,
  type InsertRating,
  type Rating,
  type InsertFile,
  type File,
  type InsertChatRoom,
  type ChatRoom,
  type InsertChatMessage,
  type ChatMessage,
  type InsertContract,
  type Contract,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string): Promise<void>;
  updateUserCreditBalance(id: string, newBalance: string): Promise<void>;
  updateUserSubscription(id: string, status: string): Promise<void>;

  // Quote operations
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuote(id: string): Promise<Quote | undefined>;
  getQuotesByCustomer(customerId: string): Promise<Quote[]>;
  getQuotesForPrinter(): Promise<Quote[]>;
  updateQuoteStatus(id: string, status: string): Promise<void>;

  // Printer quote operations
  createPrinterQuote(printerQuote: InsertPrinterQuote): Promise<PrinterQuote>;
  getPrinterQuote(id: string): Promise<PrinterQuote | undefined>;
  getPrinterQuotesByQuote(quoteId: string): Promise<PrinterQuote[]>;
  getPrinterQuotesByPrinter(printerId: string): Promise<PrinterQuote[]>;
  updatePrinterQuoteStatus(id: string, status: string): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  getOrdersByPrinter(printerId: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<void>;

  // Order status operations
  createOrderStatus(orderStatus: {
    quoteId: string;
    status: string;
    title: string;
    description: string;
    timestamp: Date;
    metadata?: any;
  }): Promise<any>;
  getOrderStatusesByQuote(quoteId: string): Promise<any[]>;

  // Rating operations
  createRating(rating: InsertRating): Promise<Rating>;
  updatePrinterRating(printerId: string): Promise<void>;

  // File operations
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: string, data: Partial<File>): Promise<File>;
  getFilesByQuote(quoteId: string): Promise<File[]>;
  getFilesByUser(userId: string): Promise<File[]>;
  getDesign(id: string): Promise<File | undefined>;
  getFileById(id: string): Promise<File | undefined>;
  getFileByFilename(filename: string): Promise<File | undefined>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  getUserStats(): Promise<any>;
  getRecentActivity(): Promise<any[]>;

  // Design operations
  saveDesignGeneration(data: {
    userId: string;
    prompt: string;
    options: any;
    result: any;
    createdAt: Date;
  }): Promise<any>;

  getDesignHistory(userId: string, options: { page: number; limit: number }): Promise<{
    designs: any[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  getDesignTemplates(): Promise<any[]>;

  // Chat operations
  createChatRoom(chatRoom: InsertChatRoom): Promise<ChatRoom>;
  getChatRoom(id: string): Promise<ChatRoom | undefined>;
  getChatRoomByQuote(quoteId: string, customerId: string, printerId: string): Promise<ChatRoom | undefined>;
  getChatRoomsByUser(userId: string): Promise<ChatRoom[]>;

  sendMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getMessages(roomId: string, limit?: number): Promise<ChatMessage[]>;
  markMessagesAsRead(roomId: string, userId: string): Promise<void>;
  getUnreadMessageCount(userId: string): Promise<number>;

  // Contract operations
  createContract(contract: InsertContract): Promise<Contract>;
  getContract(id: string): Promise<Contract | undefined>;
  getContractsByCustomer(customerId: string): Promise<Contract[]>;
  getContractsByPrinter(printerId: string): Promise<Contract[]>;
  updateContractStatus(id: string, status: string): Promise<void>;
  signContract(id: string, userId: string, signature: string): Promise<void>;

  // Notification operations
  createNotification(notification: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data: any;
    isRead: boolean;
    createdAt: Date;
  }): Promise<any>;

  updateQuote(id: string, updateData: Partial<Quote>): Promise<Quote | null>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: any): Promise<User> {
    const [newUser] = await db.insert(users).values(userData).returning();
    return newUser;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = await this.getUserByEmail(userData.email);
    
    if (existingUser) {
      const [updatedUser] = await db
        .update(users)
        .set(userData)
        .where(eq(users.id, existingUser.id))
        .returning();
      return updatedUser;
    } else {
      const [newUser] = await db.insert(users).values(userData).returning();
      return newUser;
    }
  }

  async updateUserRole(id: string, role: string): Promise<void> {
    await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id));
  }

  async updateUserCreditBalance(userId: string, newBalance: string): Promise<void> {
    await db
      .update(users)
      .set({ creditBalance: newBalance })
      .where(eq(users.id, userId));
  }

  async updateUserSubscription(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> {
    await db
      .update(users)
      .set({ subscriptionStatus: status })
      .where(eq(users.id, userId));
  }

  // Quote operations
  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [newQuote] = await db.insert(quotes).values(quote).returning();
    return newQuote;
  }

  async getQuote(id: string): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote;
  }

  async getQuotesByCustomer(customerId: string): Promise<Quote[]> {
    return await db
      .select()
      .from(quotes)
      .where(eq(quotes.customerId, customerId))
      .orderBy(desc(quotes.createdAt));
  }

  async getQuotesForPrinter(): Promise<Quote[]> {
    return await db
      .select()
      .from(quotes)
      .where(eq(quotes.status, "pending"))
      .orderBy(desc(quotes.createdAt));
  }

  async updateQuoteStatus(id: string, status: string): Promise<void> {
    await db
      .update(quotes)
      .set({ status })
      .where(eq(quotes.id, id));
  }

  async updateQuote(id: string, updateData: Partial<Quote>): Promise<Quote | null> {
    const [updatedQuote] = await db
      .update(quotes)
      .set(updateData)
      .where(eq(quotes.id, id))
      .returning();
    return updatedQuote || null;
  }

  // Printer quote operations
  async createPrinterQuote(printerQuote: InsertPrinterQuote): Promise<PrinterQuote> {
    const [newPrinterQuote] = await db.insert(printerQuotes).values(printerQuote).returning();
    return newPrinterQuote;
  }

  async getPrinterQuotesByQuote(quoteId: string): Promise<PrinterQuote[]> {
    return await db
      .select()
      .from(printerQuotes)
      .where(eq(printerQuotes.quoteId, quoteId));
  }

  async getPrinterQuotesByPrinter(printerId: string): Promise<PrinterQuote[]> {
    return await db
      .select()
      .from(printerQuotes)
      .where(eq(printerQuotes.printerId, printerId));
  }

  async getPrinterQuote(id: string): Promise<PrinterQuote | undefined> {
    const [printerQuote] = await db.select().from(printerQuotes).where(eq(printerQuotes.id, id));
    return printerQuote;
  }

  async updatePrinterQuoteStatus(id: string, status: string): Promise<void> {
    await db
      .update(printerQuotes)
      .set({ status })
      .where(eq(printerQuotes.id, id));
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId));
  }

  async getOrdersByPrinter(printerId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.printerId, printerId));
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id));
  }

  // Rating operations
  async createRating(rating: InsertRating): Promise<Rating> {
    const [newRating] = await db.insert(ratings).values(rating).returning();
    return newRating;
  }

  async updatePrinterRating(printerId: string): Promise<void> {
    const printerRatings = await db
      .select()
      .from(ratings)
      .where(eq(ratings.printerId, printerId));

    const totalRatings = printerRatings.length;
    const averageRating = totalRatings > 0 
      ? printerRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings
      : 0;

    await db
      .update(users)
      .set({
        rating: averageRating.toFixed(2),
        totalRatings: totalRatings
      })
      .where(eq(users.id, printerId));
  }

  // File operations
  async createFile(file: InsertFile): Promise<File> {
    const [newFile] = await db.insert(files).values(file).returning();
    return newFile;
  }

  async updateFile(id: string, data: Partial<File>): Promise<File> {
    const [updatedFile] = await db
      .update(files)
      .set(data)
      .where(eq(files.id, id))
      .returning();
    return updatedFile;
  }

  async getFilesByQuote(quoteId: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.quoteId, quoteId));
  }

  async getFilesByUser(userId: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.uploadedBy, userId));
  }

  async getDesign(id: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async getFileById(id: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async getFileByFilename(filename: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.filename, filename));
    return file;
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserStats(): Promise<any> {
    const [totalUsers] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const [activeUsers] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.subscriptionStatus, 'active'));

    return {
      totalUsers: totalUsers?.count || 0,
      activeUsers: activeUsers?.count || 0
    };
  }

  async getRecentActivity(): Promise<any[]> {
    return [];
  }

  // Chat operations
  async createChatRoom(chatRoom: InsertChatRoom): Promise<ChatRoom> {
    const [newChatRoom] = await db.insert(chatRooms).values(chatRoom).returning();
    return newChatRoom;
  }

  async getChatRoom(id: string): Promise<ChatRoom | undefined> {
    const [chatRoom] = await db.select().from(chatRooms).where(eq(chatRooms.id, id));
    return chatRoom;
  }

  async getChatRoomByQuote(quoteId: string, customerId: string, printerId: string): Promise<ChatRoom | undefined> {
    const [chatRoom] = await db
      .select()
      .from(chatRooms)
      .where(
        and(
          eq(chatRooms.quoteId, quoteId),
          eq(chatRooms.customerId, customerId),
          eq(chatRooms.printerId, printerId)
        )
      );
    return chatRoom;
  }

  async getChatRoomsByUser(userId: string): Promise<ChatRoom[]> {
    return await db
      .select()
      .from(chatRooms)
      .where(
        or(
          eq(chatRooms.customerId, userId),
          eq(chatRooms.printerId, userId)
        )
      );
  }

  async sendMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    
    await db
      .update(chatRooms)
      .set({ lastMessageAt: new Date() })
      .where(eq(chatRooms.id, message.roomId));

    return newMessage;
  }

  async getMessages(roomId: string, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.roomId, roomId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async markMessagesAsRead(roomId: string, userId: string): Promise<void> {
    await db
      .update(chatMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(chatMessages.roomId, roomId),
          sql`sender_id != ${userId}`,
          eq(chatMessages.isRead, false)
        )
      );
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    const userRooms = await db
      .select({ id: chatRooms.id })
      .from(chatRooms)
      .where(
        or(
          eq(chatRooms.customerId, userId),
          eq(chatRooms.printerId, userId)
        )
      );

    if (userRooms.length === 0) return 0;

    const roomIds = userRooms.map(room => room.id);
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(chatMessages)
      .where(
        and(
          sql`room_id = ANY(${roomIds})`,
          sql`sender_id != ${userId}`,
          eq(chatMessages.isRead, false)
        )
      );

    return result?.count || 0;
  }

  // Contract operations
  async createContract(contract: InsertContract): Promise<Contract> {
    const [newContract] = await db.insert(contracts).values(contract).returning();
    return newContract;
  }

  async getContract(id: string): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract;
  }

  async getContractsByCustomer(customerId: string): Promise<Contract[]> {
    return await db
      .select()
      .from(contracts)
      .where(eq(contracts.customerId, customerId));
  }

  async getContractsByPrinter(printerId: string): Promise<Contract[]> {
    return await db
      .select()
      .from(contracts)
      .where(eq(contracts.printerId, printerId));
  }

  async updateContractStatus(id: string, status: string): Promise<void> {
    await db
      .update(contracts)
      .set({ status })
      .where(eq(contracts.id, id));
  }

  async signContract(id: string, userId: string, signature: string): Promise<void> {
    const contract = await this.getContract(id);
    if (!contract) return;

    const updateData: any = {};
    
    if (contract.customerId === userId) {
      updateData.customerSignature = signature;
      updateData.customerSignedAt = new Date();
    } else if (contract.printerId === userId) {
      updateData.printerSignature = signature;
      updateData.printerSignedAt = new Date();
    }

    await db
      .update(contracts)
      .set(updateData)
      .where(eq(contracts.id, id));
  }

  // Notification operations
  async createNotification(notification: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data: any;
    isRead: boolean;
    createdAt: Date;
  }): Promise<any> {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const { randomUUID } = await import('crypto');
      
      const newNotification = {
        id: randomUUID(),
        ...notification
      };
      
      const filePath = path.join(process.cwd(), 'notifications.json');
      let notifications = [];
      
      if (fs.existsSync(filePath)) {
        notifications = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      
      notifications.push(newNotification);
      fs.writeFileSync(filePath, JSON.stringify(notifications, null, 2));
      
      console.log('✅ Notification created:', newNotification.id);
      return newNotification;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      const { randomUUID } = await import('crypto');
      return { id: randomUUID(), ...notification };
    }
  }

  async getNotifications(userId: string): Promise<any[]> {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'notifications.json');
      
      console.log('📂 Getting notifications for user:', userId);
      
      if (fs.existsSync(filePath)) {
        const notifications = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const userNotifications = notifications
          .filter((notification: any) => notification.userId === userId)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 50); // Last 50 notifications
          
        console.log('📂 Found notifications for user:', userId, userNotifications.length);
        return userNotifications;
      }
      
      console.log('📂 No notifications file found, returning empty array');
      return [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    // Placeholder implementation
  }

  // Design operations
  async saveDesignGeneration(data: {
    userId: string;
    prompt: string;
    options: any;
    result: any;
    createdAt: Date;
  }): Promise<any> {
    return data;
  }

  async getDesignHistory(userId: string, options: { page: number; limit: number }): Promise<{
    designs: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return {
      designs: [],
      total: 0,
      page: options.page,
      totalPages: 0
    };
  }

  async getDesignTemplates(): Promise<any[]> {
    return [];
  }

  // Additional helper methods
  async getRecentQuotes(limit: number = 10): Promise<any[]> {
    const recentQuotes = await db
      .select()
      .from(quotes)
      .orderBy(desc(quotes.createdAt))
      .limit(limit);
    return recentQuotes;
  }

  async getAllFiles(userId?: string): Promise<any[]> {
    let query = db.select().from(files);
    if (userId) {
      query = query.where(eq(files.uploadedBy, userId));
    }
    return await query.orderBy(desc(files.createdAt));
  }

  async createAutomaticQuote(data: any): Promise<any> {
    const [quote] = await db
      .insert(quotes)
      .values({
        ...data,
        id: data.id || (await import('crypto')).randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return quote;
  }

  async getAllQuotes(): Promise<any[]> {
    return await db
      .select()
      .from(quotes)
      .orderBy(desc(quotes.createdAt));
  }

  async getAllOrders(): Promise<any[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
  }

  async deleteUser(userId: string): Promise<void> {
    await db
      .delete(users)
      .where(eq(users.id, userId));
  }

  async deleteFile(id: string): Promise<void> {
    await db
      .delete(files)
      .where(eq(files.id, id));
  }

  async getDesignById(id: string): Promise<any> {
    const [design] = await db
      .select()
      .from(files)
      .where(eq(files.id, id));
    return design;
  }

  async deleteDesign(id: string): Promise<void> {
    await db
      .delete(files)
      .where(eq(files.id, id));
  }

  async bookmarkDesign(designId: string, userId: string): Promise<void> {
    console.log(`Bookmarking design ${designId} for user ${userId}`);
  }

  async getActiveUserCount(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.subscriptionStatus, 'active'));
    return result?.count || 0;
  }

  async getTotalUploadsCount(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(files);
    return result?.count || 0;
  }

  async getProcessedJobsCount(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(files)
      .where(eq(files.status, 'ready'));
    return result?.count || 0;
  }

  async storeFile(fileData: any): Promise<any> {
    const [file] = await db
      .insert(files)
      .values({
        ...fileData,
        id: fileData.id || (await import('crypto')).randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return file;
  }

  async getNotifications(userId: string): Promise<any[]> {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'notifications.json');
      if (fs.existsSync(filePath)) {
        const notifications = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return notifications
          .filter((notification: any) => notification.userId === userId)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 50);
      }
      return [];
    } catch {
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'notifications.json');
      if (fs.existsSync(filePath)) {
        const notifications = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const notification = notifications.find((n: any) => n.id === notificationId && n.userId === userId);
        if (notification) {
          notification.isRead = true;
          fs.writeFileSync(filePath, JSON.stringify(notifications, null, 2));
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'notifications.json');
      if (fs.existsSync(filePath)) {
        let notifications = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        notifications = notifications.filter((n: any) => !(n.id === notificationId && n.userId === userId));
        fs.writeFileSync(filePath, JSON.stringify(notifications, null, 2));
        console.log('✅ Notification deleted:', notificationId);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }
}

export const storage = new DatabaseStorage();