import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { InkDropletsLoader, StackedPapersLoader } from "@/components/PrintingLoaders";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import {
  Plus,
  FileText,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Settings,
  BarChart3,
  MessageCircle,
  Printer,
  Eye,
  Package,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Wrench,
  Target,
  Layers,
  Bell,
  Edit,
  Trash2,
  Search,
  MessageSquare,
  Star,
  Award,
  Factory,
  Sparkles,
  ArrowRight,
  Globe,
  Shield,
  Truck,
  Calculator,
  Palette,
  Building2,
  Check,
  X,
  File,
  FileImage
} from "lucide-react";
import Chat from "@/components/Chat";
import BusinessIntelligence from "@/components/BusinessIntelligence";
import ReportsAndAnalytics from "@/components/ReportsAndAnalytics";
import AutomationPanel from "@/components/AutomationPanel";
import SystemMonitoring from "@/components/SystemMonitoring";
import ContractManager from "@/components/ContractManager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Shield,
  Activity,
  Database,
  Server,
  Zap,
  BarChart3,
  MessageCircle,
  UserCheck,
  UserX,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Bell
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import Navigation from "@/components/Navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PrinterDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notificationsData } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [quoteForm, setQuoteForm] = useState({
    price: '',
    estimatedDays: '',
    notes: ''
  });
  const [viewingFiles, setViewingFiles] = useState(false);

  // Query for quote files when a quote is selected
  const { data: quoteFiles, isLoading: filesLoading } = useQuery({
    queryKey: ["/api/quotes", selectedQuote?.id, "files"],
    enabled: !!selectedQuote?.id && isAuthenticated,
  });

  // Enhanced authentication handling
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Oturum Sonlandı",
        description: "Lütfen tekrar giriş yapın",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/?login=required";
      }, 1500);
      return;
    }

    // Additional role check
    if (!isLoading && user && user.role !== 'printer') {
      toast({
        title: "Erişim Hatası",
        description: "Bu sayfaya erişim yetkiniz bulunmuyor",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: availableQuotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ["/api/quotes"],
    enabled: isAuthenticated && user?.role === 'printer',
  });

  const { data: myQuotes = [], isLoading: myQuotesLoading } = useQuery({
    queryKey: ["/api/printer-quotes"],
    enabled: isAuthenticated && user?.role === 'printer',
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated && user?.role === 'printer',
  });

  const submitQuoteMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!selectedQuote) throw new Error("No quote selected");

      const response = await fetch(`/api/quotes/${selectedQuote.id}/printer-quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Failed to submit quote');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Başarılı!",
        description: data.message || "Teklifiniz başarıyla gönderildi.",
      });
      setSelectedQuote(null);
      setQuoteForm({ price: '', estimatedDays: '', notes: '' });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
    },
    onError: (error: Error) => {
      console.error("Quote submission error:", error);
      toast({
        title: "Teklif Gönderim Hatası",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitQuote = () => {
    // Enhanced validation
    if (!quoteForm.price || !quoteForm.estimatedDays) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen fiyat ve tahmini süre bilgilerini doldurun.",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(quoteForm.price);
    const estimatedDays = parseInt(quoteForm.estimatedDays);

    if (isNaN(price) || price <= 0) {
      toast({
        title: "Geçersiz Fiyat",
        description: "Lütfen geçerli bir fiyat girin.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(estimatedDays) || estimatedDays <= 0) {
      toast({
        title: "Geçersiz Süre",
        description: "Lütfen geçerli bir tahmini süre girin.",
        variant: "destructive",
      });
      return;
    }

    submitQuoteMutation.mutate({
      price: price.toString(),
      estimatedDays: estimatedDays.toString(),
      notes: quoteForm.notes || ''
    });
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user?.role !== 'printer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Bu sayfaya erişim yetkiniz bulunmamaktadır.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Beklemede", variant: "secondary" },
      received_quotes: { label: "Teklifler Alındı", variant: "outline" },
      approved: { label: "Onaylandı", variant: "default" },
      in_progress: { label: "Üretimde", variant: "outline" },
      completed: { label: "Tamamlandı", variant: "default" },
      cancelled: { label: "İptal", variant: "destructive" }
    };

    const config = statusMap[status] || { label: status, variant: "outline" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const pendingQuotes = Array.isArray(availableQuotes) ? availableQuotes.filter((q: any) => q.status === 'pending') : [];
  const activeOrders = Array.isArray(orders) ? orders.filter((o: any) => ['in_production', 'shipped'].includes(o.status)) : [];
  const completedOrders = Array.isArray(orders) ? orders.filter((o: any) => o.status === 'delivered') : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <Building2 className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user.companyName || `${user.firstName} ${user.lastName}`}</h3>
                <p className="text-orange-100">
                  {user.subscriptionStatus === 'active' ? 'Premium Üyelik' : 'Temel Üyelik'}
                </p>
              </div>
            </div>
            <div className="text-right flex items-center">
              <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 mr-4">
                  <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <DropdownMenuItem>
                      <div className="text-center py-2">
                        <p className="text-sm text-gray-500">Henüz bildiriminiz bulunmamaktadır.</p>
                      </div>
                    </DropdownMenuItem>
                  ) : (
                    notifications.map((notification: any) => (
                      <DropdownMenuItem key={notification.id} onClick={() => markAsRead(notification.id)}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm">{notification.message}</p>
                          {!notification.isRead && (
                            <span className="text-xs text-blue-500">Yeni</span>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="ml-4">
                <p className="text-orange-100">Puanınız</p>
                <p className="text-2xl font-bold">{user.rating || '0.0'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Bekleyen Teklifler"
            value={pendingQuotes.length}
            icon={<Clock className="h-5 w-5 text-yellow-600" />}
            color="bg-yellow-50"
          />
          <StatsCard
            title="Tamamlanan"
            value={completedOrders.length}
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
            color="bg-green-50"
          />
          <StatsCard
            title="Değerlendirme"
            value={user.rating || '0.0'}
            icon={<Star className="h-5 w-5 text-yellow-600" />}
            color="bg-yellow-50"
          />
          <StatsCard
            title="Aktif Projeler"
            value={activeOrders.length}
            icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
            color="bg-blue-50"
          />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="contracts">Sözleşmeler</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
            <TabsTrigger value="orders">Siparişler</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* New Quote Requests */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Yeni Teklif Talepleri</CardTitle>
                  <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-700">
                    Tümünü Gör
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {quotesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                ) : pendingQuotes.length > 0 ? (
                  <div className="space-y-4">
                    {pendingQuotes.map((quote: any) => (
                      <div key={quote.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                              <FileText className="text-gray-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{quote.title}</h5>
                              <p className="text-sm text-gray-600">{quote.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(quote.status)}
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(quote.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>

                        {quote.specifications && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                            {Object.entries(quote.specifications as Record<string, any>).slice(0, 4).map(([key, value]) => (
                              <div key={key}>
                                <p className="text-gray-600 capitalize">{key}</p>
                                <p className="font-medium">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedQuote(quote)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detayları Gör
                          </Button>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-700 hover:bg-gray-100"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reddet
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setSelectedQuote(quote)}
                              className="bg-orange-500 text-white hover:bg-orange-600"
                            >
                              Teklif Ver
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Şu anda bekleyen teklif talebi bulunmuyor.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quote Submission Modal */}
            {selectedQuote && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
                  <CardHeader className="flex-shrink-0 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Teklif Detayları</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedQuote.title} - {selectedQuote.id}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedQuote(null)}
                        className="rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-y-auto flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label htmlFor="price" className="text-sm font-medium">
                            Teklif Fiyatı (₺) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Örn: 1500"
                            value={quoteForm.price}
                            onChange={(e) => setQuoteForm({ ...quoteForm, price: e.target.value })}
                            className={!quoteForm.price ? "border-red-200" : ""}
                          />
                          {!quoteForm.price && (
                            <p className="text-xs text-red-500">Fiyat bilgisi gereklidir</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="estimatedDays" className="text-sm font-medium">
                            Tahmini Süre (Gün) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="estimatedDays"
                            type="number"
                            min="1"
                            max="365"
                            placeholder="Örn: 7"
                            value={quoteForm.estimatedDays}
                            onChange={(e) => setQuoteForm({ ...quoteForm, estimatedDays: e.target.value })}
                            className={!quoteForm.estimatedDays ? "border-red-200" : ""}
                          />
                          {!quoteForm.estimatedDays && (
                            <p className="text-xs text-red-500">Tahmini süre gereklidir</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="notes" className="text-sm font-medium">Notlar ve Açıklamalar</Label>
                          <Textarea
                            id="notes"
                            placeholder="Ek bilgiler, özel şartlar, kalite detayları..."
                            value={quoteForm.notes}
                            onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                            rows={3}
                          />
                          <p className="text-xs text-gray-500">
                            Müşteriye iletmek istediğiniz ek bilgileri buraya yazabilirsiniz
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Quote Details Section */}
                        <div className="border rounded-md p-4 space-y-2">
                          <h4 className="font-medium text-gray-900">Teklif Detayları</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Miktar:</span>
                              <span className="ml-2 font-medium">{selectedQuote.quantity || 'Belirtilmemiş'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Materyal:</span>
                              <span className="ml-2 font-medium">{selectedQuote.material || 'Belirtilmemiş'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Boyut:</span>
                              <span className="ml-2 font-medium">{selectedQuote.size || 'Belirtilmemiş'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Aciliyet:</span>
                              <span className="ml-2 font-medium">{selectedQuote.urgency || 'Normal'}</span>
                            </div>
                          </div>
                          {selectedQuote.description && (
                            <div>
                              <span className="text-gray-600">Açıklama:</span>
                              <p className="mt-1 text-sm text-gray-800">{selectedQuote.description}</p>
                            </div>
                          )}
                        </div>

                        {/* Customer Files Section */}
                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">Müşteri Dosyaları</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingFiles(!viewingFiles)}
                              className="text-sm"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {viewingFiles ? 'Gizle' : 'Dosyaları Gör'}
                            </Button>
                          </div>

                          {viewingFiles && (
                            <div className="space-y-2">
                              {filesLoading ? (
                                <div className="text-center py-4">
                                  <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                                  <p className="text-sm text-gray-600 mt-2">Dosyalar yükleniyor...</p>
                                </div>
                              ) : quoteFiles?.files && quoteFiles.files.length > 0 ? (
                                <div className="grid gap-2">
                                  {quoteFiles.files.map((file: any) => (
                                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                        {file.mimeType?.startsWith('image/') ? (
                                          <FileImage className="h-5 w-5 text-blue-500" />
                                        ) : file.mimeType?.includes('pdf') ? (
                                          <FileText className="h-5 w-5 text-red-500" />
                                        ) : (
                                          <File className="h-5 w-5 text-gray-500" />
                                        )}
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                                          <p className="text-xs text-gray-600">
                                            {file.fileType} • {(file.size / 1024 / 1024).toFixed(2)} MB
                                          </p>
                                          {file.dimensions && (
                                            <p className="text-xs text-gray-500">{file.dimensions}</p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        {file.mimeType?.startsWith('image/') && (
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl">
                                              <DialogHeader>
                                                <DialogTitle>{file.originalName}</DialogTitle>
                                              </DialogHeader>
                                              <div className="flex justify-center">
                                                <img
                                                  src={`/api/files/${file.filename}`}
                                                  alt={file.originalName}
                                                  className="max-h-96 object-contain"
                                                />
                                              </div>
                                            </DialogContent>
                                          </Dialog>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => window.open(`/api/files/${file.filename}`, '_blank')}
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600">Bu teklif için dosya bulunmuyor</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent className="flex-shrink-0 border-t">
                    <div className="flex space-x-2 pt-4 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedQuote(null)}
                        className="flex-1 md:flex-none"
                      >
                        İptal
                      </Button>
                      <Button
                        onClick={handleSubmitQuote}
                        disabled={submitQuoteMutation.isPending}
                        className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        {submitQuoteMutation.isPending ? (
                          "Gönderiliyor..."
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Teklifi Gönder
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="contracts">
            <ContractManager userRole="printer" />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsAndAnalytics />
          </TabsContent>



          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sipariş Takip Sistemi</h3>
                  <p className="text-gray-600">Sipariş durumu, teslimat takibi ve müşteri bildirimleri.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}