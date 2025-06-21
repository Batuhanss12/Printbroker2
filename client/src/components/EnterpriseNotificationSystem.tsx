import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Bell, X, Check, AlertCircle, Package, DollarSign, Clock, MapPin, Filter, Settings, Volume2, VolumeX, CheckCircle, XCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface EnterpriseNotification {
  id: string;
  type: 'new_quote_notification' | 'quote_response_notification' | 'quote_approved' | 'quote_rejected' | 'payment_received' | 'order_update' | 'system_alert';
  title: string;
  message: string;
  quote?: any;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  isRead: boolean;
  actionRequired: boolean;
  metadata?: {
    amount?: string;
    quantity?: number;
    location?: string;
    deadline?: string;
    customerName?: string;
    printerName?: string;
  };
}

export function EnterpriseNotificationSystem() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<EnterpriseNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  // Initialize audio for notifications
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBz2L0fPTgjMGHnq+8NGUQwwTUqPi7qxZEQdMotn4sVocc1fDzOLNgzMEIHDF7duIOQhTn+XtoVgTAzi1zOa8ciUDJHHH7d2QQAspYLfv5Z1PCgkwd9v6rVsec2zd5KxYGQhGn+HxrVkbBjqQ1fDajUsKIHBA6tCGOgcXdcD1oVgeTQ4wfT3x2I1LCSEkf9bFdSdCGjSU0vC4ciMFKHLJ5GmNOhBGq4fRvZs1Eh43e8fgj0gSC0am2u6tYR0GNH7P3YY/CjJpp+zrUQoZcb3n3YJJDBa+jWEUBAJY');
    audioRef.current.volume = 0.3;
  }, []);

  // Fetch existing notifications from server
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          console.log('📬 Fetched notifications for user:', user.id, data);
          
          // Handle both array response and object with notifications property
          const notificationsList = Array.isArray(data) ? data : (data.notifications || []);
          
          const serverNotifications = notificationsList.map((notif: any) => ({
            id: notif.id,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            quote: notif.data?.quote || notif.quote,
            timestamp: notif.createdAt || notif.timestamp || new Date().toISOString(),
            priority: notif.priority || 'medium',
            category: notif.category || 'general',
            isRead: notif.isRead || false,
            actionRequired: notif.actionRequired || false,
            metadata: notif.metadata || notif.data || {}
          }));
          
          console.log('📬 Processed notifications:', serverNotifications.length);
          setNotifications(serverNotifications);
          setUnreadCount(serverNotifications.filter((n: any) => !n.isRead).length);
        } else {
          console.error('Failed to fetch notifications:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  // WebSocket connection with auto-reconnect
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const connectWebSocket = () => {
      setConnectionStatus('connecting');
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('Enterprise NotificationSystem WebSocket connected');
        setConnectionStatus('connected');
        
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }

        // Authenticate user for notifications
        websocket.send(JSON.stringify({
          type: 'authenticate',
          userId: user.id,
          role: user.role,
          email: user.email,
          preferences: {
            soundEnabled,
            autoRefresh
          }
        }));
        
        console.log('🔌 WebSocket authenticated for user:', user.id, user.role);
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'authenticated') {
            console.log('User authenticated for notifications:', data.userId);
          } else if (data.type && data.title && data.message) {
            // Enhanced notification handling
            const notification: EnterpriseNotification = {
              id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: data.type,
              title: data.title,
              message: data.message,
              quote: data.quote,
              timestamp: data.timestamp || new Date().toISOString(),
              priority: data.priority || 'medium',
              category: data.category || 'general',
              isRead: false,
              actionRequired: data.actionRequired || false,
              metadata: data.metadata || {}
            };
            
            setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep max 50 notifications
            setUnreadCount(prev => prev + 1);
            
            // Play sound if enabled
            if (soundEnabled && audioRef.current) {
              audioRef.current.play().catch(e => console.log('Audio play failed:', e));
            }
            
            // Show toast notification with priority styling
            const toastVariant = notification.priority === 'urgent' ? 'destructive' : 'default';
            toast({
              title: data.title,
              description: data.message,
              duration: notification.priority === 'urgent' ? 10000 : 5000,
              variant: toastVariant
            });
          }
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('Enterprise NotificationSystem WebSocket error:', error);
        setConnectionStatus('disconnected');
      };

      websocket.onclose = () => {
        console.log('Enterprise NotificationSystem WebSocket disconnected');
        setConnectionStatus('disconnected');
        
        // Auto-reconnect after 3 seconds
        if (autoRefresh) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      };

      setWs(websocket);
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [isAuthenticated, user, soundEnabled, autoRefresh, toast]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Still update UI even if server call fails
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      // Mark all unread notifications as read on server
      await Promise.all(
        unreadNotifications.map(notif => 
          fetch(`/api/notifications/${notif.id}/read`, { method: 'POST' })
        )
      );
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Still update UI even if server call fails
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Still update UI even if server call fails
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const clearAllNotifications = async () => {
    try {
      // Delete all notifications on server
      await Promise.all(
        notifications.map(notif => 
          fetch(`/api/notifications/${notif.id}`, { method: 'DELETE' })
        )
      );
      
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      // Still update UI even if server call fails
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Info className="h-4 w-4 text-blue-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-500 dark:bg-red-900/20';
      case 'high': return 'bg-orange-100 border-orange-500 dark:bg-orange-900/20';
      case 'medium': return 'bg-blue-100 border-blue-500 dark:bg-blue-900/20';
      case 'low': return 'bg-green-100 border-green-500 dark:bg-green-900/20';
      default: return 'bg-gray-100 border-gray-500 dark:bg-gray-900/20';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const priorityMatch = filterPriority === 'all' || notification.priority === filterPriority;
    const categoryMatch = filterCategory === 'all' || notification.category === filterCategory;
    return priorityMatch && categoryMatch;
  });

  if (!isAuthenticated || !user) return null;

  return (
    <div className="relative">
      {/* Notification Bell with Enhanced Status */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setShowPanel(!showPanel)}
      >
        <Bell className={`h-5 w-5 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-gray-400'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {connectionStatus === 'connecting' && (
          <span className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full h-2 w-2 animate-bounce"></span>
        )}
      </Button>

      {/* Enterprise Notification Panel */}
      {showPanel && (
        <Card className="absolute right-0 top-12 w-96 shadow-2xl z-50 max-h-[32rem] border-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Bildirim Merkezi
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPanel(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`h-2 w-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span className="text-muted-foreground">
                {connectionStatus === 'connected' ? 'Bağlı' : 
                 connectionStatus === 'connecting' ? 'Bağlanıyor...' : 'Bağlantı Kesildi'}
              </span>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mt-3">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Öncelik" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Öncelikler</SelectItem>
                  <SelectItem value="urgent">Acil</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="low">Düşük</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  <SelectItem value="quotes">Teklifler</SelectItem>
                  <SelectItem value="orders">Siparişler</SelectItem>
                  <SelectItem value="payments">Ödemeler</SelectItem>
                  <SelectItem value="system">Sistem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            {notifications.length > 0 && (
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Tümünü Okundu İşaretle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-1" />
                  Tümünü Sil
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Henüz bildirim yok</p>
                  {connectionStatus === 'disconnected' && (
                    <p className="text-xs mt-2 text-red-500">Bağlantı kesildi</p>
                  )}
                  <p className="text-xs mt-2 text-gray-400">
                    Toplam: {notifications.length}, Filtrelenmiş: {filteredNotifications.length}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div className={`p-4 hover:bg-muted/50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      } ${getPriorityColor(notification.priority)} border-l-4`}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getPriorityIcon(notification.priority)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm truncate">
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1 ml-2">
                                {notification.actionRequired && (
                                  <Badge variant="destructive" className="text-xs">
                                    Aksiyon Gerekli
                                  </Badge>
                                )}
                                {!notification.isRead && (
                                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            {/* Metadata */}
                            {notification.metadata && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {notification.metadata.amount && (
                                  <Badge variant="secondary" className="text-xs">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {notification.metadata.amount}
                                  </Badge>
                                )}
                                {notification.metadata.quantity && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Package className="h-3 w-3 mr-1" />
                                    {notification.metadata.quantity} adet
                                  </Badge>
                                )}
                                {notification.metadata.location && (
                                  <Badge variant="secondary" className="text-xs">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {notification.metadata.location}
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                {new Date(notification.timestamp).toLocaleString('tr-TR')}
                              </p>
                              <div className="flex items-center gap-1">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-7 px-2"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-7 px-2"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < filteredNotifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}