import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Package, 
  Clock, 
  DollarSign, 
  User, 
  Calendar, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Play,
  Truck,
  Factory
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Order {
  id: string;
  printerQuoteId: string;
  title: string;
  type: string;
  customer: {
    name: string;
    company: string;
  };
  price: string;
  estimatedDays: number;
  deadline?: string;
  currentStatus: string;
  orderStatuses: Array<{
    id: string;
    status: string;
    title: string;
    description: string;
    timestamp: string;
    metadata?: any;
  }>;
  createdAt: string;
  specifications: Record<string, any>;
}

const statusOptions = [
  { value: 'approved', label: 'Onaylandı', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'in_production', label: 'Üretimde', color: 'bg-blue-100 text-blue-700', icon: Factory },
  { value: 'quality_check', label: 'Kalite Kontrol', color: 'bg-purple-100 text-purple-700', icon: AlertCircle },
  { value: 'packaging', label: 'Paketleme', color: 'bg-orange-100 text-orange-700', icon: Package },
  { value: 'ready_for_delivery', label: 'Teslimat Hazır', color: 'bg-yellow-100 text-yellow-700', icon: Truck },
  { value: 'completed', label: 'Tamamlandı', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
];

const predefinedStatuses = [
  {
    status: 'in_production',
    title: 'Üretim Başladı',
    description: 'Siparişinizin üretim süreci başlatılmıştır.'
  },
  {
    status: 'quality_check',
    title: 'Kalite Kontrol',
    description: 'Ürün kalite kontrol aşamasında.'
  },
  {
    status: 'packaging',
    title: 'Paketleme',
    description: 'Ürün paketleme aşamasında.'
  },
  {
    status: 'ready_for_delivery',
    title: 'Teslimat Hazır',
    description: 'Siparişiniz teslimat için hazır.'
  },
  {
    status: 'completed',
    title: 'Sipariş Tamamlandı',
    description: 'Siparişiniz başarıyla tamamlanmıştır.'
  }
];

export function OrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [customStatus, setCustomStatus] = useState({
    status: '',
    title: '',
    description: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/orders/my-orders'],
    queryFn: () => apiRequest('/api/orders/my-orders')
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, statusData }: { orderId: string; statusData: any }) =>
      apiRequest(`/api/orders/status/${orderId}`, {
        method: 'POST',
        body: JSON.stringify(statusData)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders/my-orders'] });
      setStatusUpdateDialog(false);
      setCustomStatus({ status: '', title: '', description: '' });
      toast({
        title: "Başarılı",
        description: "Sipariş durumu güncellendi ve müşteri bilgilendirildi",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Sipariş durumu güncellenemedi",
        variant: "destructive",
      });
    }
  });

  const handleQuickStatusUpdate = (order: Order, statusData: any) => {
    updateStatusMutation.mutate({
      orderId: order.id,
      statusData
    });
  };

  const handleCustomStatusUpdate = () => {
    if (!selectedOrder || !customStatus.status || !customStatus.title || !customStatus.description) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    updateStatusMutation.mutate({
      orderId: selectedOrder.id,
      statusData: customStatus
    });
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Siparişlerim</h2>
        <Badge variant="outline" className="text-sm">
          {orders.length} Aktif Sipariş
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">
              Henüz aktif siparişiniz bulunmamaktadır.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order: Order) => {
            const currentStatusInfo = getStatusInfo(order.currentStatus);
            const StatusIcon = currentStatusInfo.icon;
            const latestStatus = order.orderStatuses[0];

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{order.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {order.customer.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ₺{order.price}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {order.estimatedDays} gün
                        </div>
                      </div>
                    </div>
                    <Badge className={currentStatusInfo.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {currentStatusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Latest Status */}
                  {latestStatus && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{latestStatus.title}</h4>
                        <span className="text-xs text-gray-500">
                          {format(new Date(latestStatus.timestamp), 'dd MMM yyyy HH:mm', { locale: tr })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{latestStatus.description}</p>
                    </div>
                  )}

                  {/* Quick Status Updates */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Hızlı Durum Güncelleme:</Label>
                    <div className="flex flex-wrap gap-2">
                      {predefinedStatuses.map((statusData) => {
                        const statusInfo = getStatusInfo(statusData.status);
                        const StatusIcon = statusInfo.icon;
                        const isCurrentStatus = order.currentStatus === statusData.status;
                        
                        return (
                          <Button
                            key={statusData.status}
                            variant={isCurrentStatus ? "default" : "outline"}
                            size="sm"
                            disabled={isCurrentStatus || updateStatusMutation.isPending}
                            onClick={() => handleQuickStatusUpdate(order, statusData)}
                            className="flex items-center gap-1"
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Status Update */}
                  <Dialog open={statusUpdateDialog && selectedOrder?.id === order.id} onOpenChange={setStatusUpdateDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="w-full border border-dashed border-gray-300 hover:border-gray-400"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Özel Durum Güncelleme
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Sipariş Durumu Güncelle</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="status">Durum</Label>
                          <Select value={customStatus.status} onValueChange={(value) => setCustomStatus(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Durum seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="title">Başlık</Label>
                          <Input
                            id="title"
                            value={customStatus.title}
                            onChange={(e) => setCustomStatus(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Durum başlığı"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Açıklama</Label>
                          <Textarea
                            id="description"
                            value={customStatus.description}
                            onChange={(e) => setCustomStatus(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Müşteriye gönderilecek açıklama"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleCustomStatusUpdate}
                            disabled={updateStatusMutation.isPending}
                            className="flex-1"
                          >
                            {updateStatusMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setStatusUpdateDialog(false)}
                            className="flex-1"
                          >
                            İptal
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Order Timeline */}
                  {order.orderStatuses.length > 1 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sipariş Geçmişi:</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {order.orderStatuses.slice(1).map((status, index) => (
                          <div key={status.id} className="flex items-start gap-2 text-xs text-gray-600">
                            <div className="w-2 h-2 bg-gray-300 rounded-full mt-1 flex-shrink-0"></div>
                            <div>
                              <span className="font-medium">{status.title}</span>
                              <span className="mx-2">-</span>
                              <span>{format(new Date(status.timestamp), 'dd MMM HH:mm', { locale: tr })}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}