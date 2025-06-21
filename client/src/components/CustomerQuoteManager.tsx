import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Check,
  X,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  FileText,
  Star,
  Eye,
  MessageCircle,
  Package,
  Truck
} from 'lucide-react';

interface PrinterQuote {
  id: string;
  printerId: string;
  printerName: string;
  companyName: string;
  price: string;
  estimatedDays: number;
  notes: string;
  rating: number;
  totalRatings: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface QuoteWithPrinterQuotes {
  id: string;
  title: string;
  status: string;
  printerQuotes: PrinterQuote[];
}

interface OrderStatus {
  id: string;
  status: 'pending' | 'approved' | 'in_production' | 'quality_check' | 'shipping' | 'completed';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

interface CustomerQuoteManagerProps {
  quote: QuoteWithPrinterQuotes;
  onClose: () => void;
}

export function CustomerQuoteManager({ quote, onClose }: CustomerQuoteManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  // Fetch order status updates for approved quotes
  const { data: orderStatuses } = useQuery({
    queryKey: ['/api/orders/status', quote.id],
    queryFn: () => apiRequest('GET', `/api/orders/status/${quote.id}`),
    enabled: quote.status === 'approved' || quote.status === 'in_progress',
    refetchInterval: 30000, // Real-time updates every 30 seconds
  });

  // Approve quote mutation
  const approveQuoteMutation = useMutation({
    mutationFn: async (printerQuoteId: string) => {
      return apiRequest('POST', `/api/quotes/${quote.id}/approve`, {
        printerQuoteId
      });
    },
    onSuccess: () => {
      toast({
        title: 'Teklif Onaylandı',
        description: 'Seçtiğiniz teklif başarıyla onaylandı. Sipariş aşaması başlatıldı.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Teklif onaylanırken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });

  // Reject quote mutation
  const rejectQuoteMutation = useMutation({
    mutationFn: async (printerQuoteId: string) => {
      return apiRequest('POST', `/api/quotes/${quote.id}/reject`, {
        printerQuoteId
      });
    },
    onSuccess: () => {
      toast({
        title: 'Teklif Reddedildi',
        description: 'Seçtiğiniz teklif reddedildi.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Hata',
        description: error.message || 'Teklif reddedilirken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });

  const handleApproveQuote = (printerQuoteId: string) => {
    setSelectedQuoteId(printerQuoteId);
    approveQuoteMutation.mutate(printerQuoteId);
  };

  const handleRejectQuote = (printerQuoteId: string) => {
    rejectQuoteMutation.mutate(printerQuoteId);
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(parseFloat(price));
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Onaylandı', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
      in_production: { label: 'Üretimde', color: 'bg-blue-100 text-blue-800' },
      quality_check: { label: 'Kalite Kontrolü', color: 'bg-purple-100 text-purple-800' },
      shipping: { label: 'Kargoda', color: 'bg-orange-100 text-orange-800' },
      completed: { label: 'Tamamlandı', color: 'bg-green-100 text-green-800' }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getOrderStatusIcon = (status: string) => {
    const iconMap = {
      pending: <Clock className="h-4 w-4" />,
      approved: <Check className="h-4 w-4" />,
      in_production: <Package className="h-4 w-4" />,
      quality_check: <Eye className="h-4 w-4" />,
      shipping: <Truck className="h-4 w-4" />,
      completed: <Check className="h-4 w-4" />
    };
    return iconMap[status as keyof typeof iconMap] || <Clock className="h-4 w-4" />;
  };

  const sortedQuotes = quote.printerQuotes?.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)) || [];

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Teklif Yönetimi - {quote.title}
          </DialogTitle>
          <DialogDescription>
            Gelen teklifleri değerlendirin ve onaylayın
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Order Status Timeline - Show if approved */}
          {(quote.status === 'approved' || quote.status === 'in_progress') && orderStatuses?.length > 0 && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Sipariş Durumu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderStatuses.map((status: OrderStatus, index: number) => (
                    <div key={status.id} className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        status.status === 'completed' ? 'bg-green-100 text-green-600' :
                        index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {getOrderStatusIcon(status.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{status.title}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(status.timestamp).toLocaleString('tr-TR')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{status.description}</p>
                        {getStatusBadge(status.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Printer Quotes */}
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Gelen Teklifler ({sortedQuotes.length})
              </h3>

              {sortedQuotes.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Henüz teklif alınmadı.</p>
                    <p className="text-sm text-gray-500">Matbaalar tekliflerini gönderdiğinde burada görünecek.</p>
                  </CardContent>
                </Card>
              ) : (
                sortedQuotes.map((printerQuote) => (
                  <Card key={printerQuote.id} className="relative">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{printerQuote.companyName}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">
                                  {printerQuote.rating.toFixed(1)} ({printerQuote.totalRatings} değerlendirme)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(printerQuote.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Fiyat</p>
                            <p className="font-semibold text-lg">{formatPrice(printerQuote.price)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Teslimat Süresi</p>
                            <p className="font-semibold">{printerQuote.estimatedDays} gün</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Teklif Tarihi</p>
                            <p className="font-semibold">
                              {new Date(printerQuote.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {printerQuote.notes && (
                        <div className="mb-4">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Matbaa Notları
                          </h5>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {printerQuote.notes}
                          </p>
                        </div>
                      )}

                      {printerQuote.status === 'pending' && quote.status !== 'approved' && (
                        <div className="flex gap-2 pt-4 border-t">
                          <Button
                            onClick={() => handleApproveQuote(printerQuote.id)}
                            disabled={approveQuoteMutation.isPending && selectedQuoteId === printerQuote.id}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {approveQuoteMutation.isPending && selectedQuoteId === printerQuote.id 
                              ? 'Onaylanıyor...' 
                              : 'Onayla'
                            }
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRejectQuote(printerQuote.id)}
                            disabled={rejectQuoteMutation.isPending}
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reddet
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerQuoteManager;