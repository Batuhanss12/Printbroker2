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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Star,
  Calendar,
  DollarSign,
  Building2,
  User,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Check
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
  customerId: string;
  customerName: string;
  deadline: string;
  budget: string;
  description: string;
  printerQuotes: PrinterQuote[];
}

interface OrderStatus {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

interface PrinterOrderManagerProps {
  quote: QuoteWithPrinterQuotes;
  onClose: () => void;
}

const orderStatusFormSchema = z.object({
  status: z.string().min(1, "Durum seçimi zorunludur"),
  title: z.string().min(1, "Başlık zorunludur"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
});

type OrderStatusFormData = z.infer<typeof orderStatusFormSchema>;

const statusOptions = [
  { value: 'in_production', label: 'Üretim Başladı', icon: Play, color: 'bg-blue-100 text-blue-700' },
  { value: 'quality_check', label: 'Kalite Kontrolü', icon: CheckCircle, color: 'bg-yellow-100 text-yellow-700' },
  { value: 'printing_complete', label: 'Baskı Tamamlandı', icon: Check, color: 'bg-green-100 text-green-700' },
  { value: 'packaging', label: 'Paketleme', icon: Package, color: 'bg-purple-100 text-purple-700' },
  { value: 'shipping', label: 'Kargo Hazırlığı', icon: Truck, color: 'bg-orange-100 text-orange-700' },
  { value: 'completed', label: 'Teslim Edildi', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
];

function getOrderStatusIcon(status: string) {
  const statusOption = statusOptions.find(opt => opt.value === status);
  if (statusOption) {
    const IconComponent = statusOption.icon;
    return <IconComponent className="h-4 w-4" />;
  }
  return <Package className="h-4 w-4" />;
}

function getOrderStatusColor(status: string) {
  const statusOption = statusOptions.find(opt => opt.value === status);
  return statusOption?.color || 'bg-gray-100 text-gray-700';
}

export function PrinterOrderManager({ quote, onClose }: PrinterOrderManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrderStatusFormData>({
    resolver: zodResolver(orderStatusFormSchema),
    defaultValues: {
      status: '',
      title: '',
      description: '',
    },
  });

  // Get approved printer quote for current user
  const approvedPrinterQuote = quote.printerQuotes.find(
    (pq: PrinterQuote) => pq.printerId === user?.id && pq.status === 'approved'
  );

  // Fetch order statuses for this quote
  const { data: orderStatuses, isLoading: isLoadingStatuses } = useQuery({
    queryKey: ['/api/orders/status', quote.id],
    queryFn: () => apiRequest(`/api/orders/status/${quote.id}`),
    enabled: !!approvedPrinterQuote,
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async (data: OrderStatusFormData) => {
      return apiRequest(`/api/orders/status/${quote.id}`, {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          metadata: { updatedBy: user?.id }
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Sipariş durumu güncellendi ve müşteri bilgilendirildi.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/orders/status', quote.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/printer/quotes'] });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Sipariş durumu güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: OrderStatusFormData) => {
    if (!approvedPrinterQuote) {
      toast({
        title: "Hata",
        description: "Bu sipariş için yetkiniz bulunmamaktadır.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateOrderStatusMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-fill title based on status selection
  const handleStatusChange = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    if (statusOption) {
      form.setValue('title', statusOption.label);
    }
    form.setValue('status', status);
  };

  if (!approvedPrinterQuote) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yetkisiz Erişim</DialogTitle>
            <DialogDescription>
              Bu sipariş için yetkiniz bulunmamaktadır.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose}>Kapat</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Sipariş Yönetimi: {quote.title}
          </DialogTitle>
          <DialogDescription>
            Siparişinizin durumunu güncelleyin ve müşterinizi bilgilendirin
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sipariş Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Müşteri:</span>
                  </div>
                  <p className="text-sm text-gray-600">{quote.customerName}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Teklif:</span>
                  </div>
                  <p className="text-sm font-semibold text-green-600">
                    ₺{parseFloat(approvedPrinterQuote.price).toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Tahmini Süre:</span>
                  </div>
                  <p className="text-sm text-gray-600">{approvedPrinterQuote.estimatedDays} gün</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Son Teslim:</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {quote.deadline ? new Date(quote.deadline).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                  </p>
                </div>
              </div>
              
              {quote.description && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Açıklama:</span>
                  </div>
                  <p className="text-sm text-gray-600">{quote.description}</p>
                </div>
              )}

              {approvedPrinterQuote.notes && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Teklif Notları:</span>
                  </div>
                  <p className="text-sm text-gray-600">{approvedPrinterQuote.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sipariş Durumu</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStatuses ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Yükleniyor...</p>
                </div>
              ) : orderStatuses && orderStatuses.length > 0 ? (
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {orderStatuses.map((status: OrderStatus, index: number) => (
                      <div key={status.id} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? getOrderStatusColor(status.status) : 'bg-gray-100 text-gray-400'
                        }`}>
                          {getOrderStatusIcon(status.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{status.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(status.timestamp).toLocaleString('tr-TR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Henüz durum güncellemesi yok</p>
                  <p className="text-sm text-gray-400 mt-1">
                    İlk durum güncellemesini aşağıdan yapabilirsiniz
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Status Update Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Durum Güncelleme</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sipariş Durumu</FormLabel>
                        <Select onValueChange={handleStatusChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Durum seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((option) => {
                              const IconComponent = option.icon;
                              return (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" />
                                    {option.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlık</FormLabel>
                        <FormControl>
                          <Input placeholder="Durum başlığı" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Müşteriye gönderilecek detaylı açıklama..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || updateOrderStatusMutation.isPending}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Güncelleniyor...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Durumu Güncelle
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}