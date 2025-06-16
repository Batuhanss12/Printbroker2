import React, { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  MapPin, 
  Package, 
  DollarSign,
  Download,
  Eye,
  User,
  Building2,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function QuoteDetail() {
  const [match, params] = useRoute("/quote/:id");
  const quoteId = params?.id;

  console.log('QuoteDetail params:', params);
  console.log('Quote ID:', quoteId);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [quote, setQuote] = useState<any>(null);
  const [printerQuotes, setPrinterQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !params?.id) {
      return;
    }

    fetchQuoteDetails();
  }, [isAuthenticated, params?.id]);

  const fetchQuoteDetails = async () => {
    try {
      setLoading(true);

      // Ana teklifi getir
      const quoteResponse = await apiRequest('GET', `/api/quotes/${params.id}`);
      setQuote(quoteResponse);

      // Matbaa tekliflerini getir
      const printerQuotesResponse = await apiRequest('GET', `/api/quotes/${params.id}/printer-quotes`);
      setPrinterQuotes(printerQuotesResponse || []);

    } catch (error) {
      console.error("Error fetching quote details:", error);
      toast({
        title: "Hata",
        description: "Teklif detayları yüklenirken hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'received_quotes': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'received_quotes': return 'Teklifler Alındı';
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      case 'completed': return 'Tamamlandı';
      default: return status;
    }
  };

  const handleAcceptQuote = async (printerQuoteId: string) => {
    try {
      await apiRequest('POST', `/api/quotes/${params.id}/accept`, {
        printerQuoteId
      });

      toast({
        title: "Başarılı",
        description: "Teklif kabul edildi",
      });

      fetchQuoteDetails();
    } catch (error) {
      console.error("Error accepting quote:", error);
      toast({
        title: "Hata",
        description: "Teklif kabul edilirken hata oluştu",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              Bu sayfayı görüntülemek için giriş yapmalısınız.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Teklif bulunamadı.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quote.title}</h1>
            <p className="text-gray-600">Teklif ID: {quote.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ana Teklif Detayları */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Teklif Detayları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Durum:</span>
                  <Badge className={getStatusColor(quote.status)}>
                    {getStatusText(quote.status)}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Oluşturulma Tarihi</p>
                      <p className="text-sm text-gray-600">
                        {new Date(quote.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>

                  {quote.deadline && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Son Tarih</p>
                        <p className="text-sm text-gray-600">
                          {new Date(quote.deadline).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {quote.description && (
                  <div>
                    <p className="text-sm font-medium mb-2">Açıklama</p>
                    <p className="text-sm text-gray-600">{quote.description}</p>
                  </div>
                )}

                {quote.specifications && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(quote.specifications).map(([key, value]) => {
                          if (!value || key === 'uploadedFiles') return null;

                          // Türkçe alan adları eşleştirmesi
                          const fieldNames: Record<string, string> = {
                            'size': 'Boyut',
                            'cutting': 'Kesim',
                            'material': 'Materyal',
                            'quantity': 'Miktar',
                            'packaging': 'Paketleme',
                            'paperType': 'Kağıt Türü',
                            'description': 'Açıklama',
                            'cellophaneType': 'Selofan Türü',
                            'width': 'Genişlik',
                            'height': 'Yükseklik',
                            'color': 'Renk',
                            'finish': 'Bitirme',
                            'coating': 'Kaplama',
                            'lamination': 'Laminasyon',
                            'binding': 'Ciltleme',
                            'pages': 'Sayfa Sayısı',
                            'copies': 'Kopya Sayısı',
                            'paperWeight': 'Kağıt Gramajı',
                            'printType': 'Baskı Türü',
                            'colorType': 'Renk Türü',
                            'urgency': 'Aciliyet',
                            'deadline': 'Termin',
                            'specialInstructions': 'Özel Talimatlar',
                            'notes': 'Notlar'
                          };

                          const displayName = fieldNames[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                          return (
                            <div key={key}>
                              <span className="font-medium capitalize">{displayName}:</span>
                              <span className="ml-2 text-gray-600">{String(value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
              </CardContent>
            </Card>

            {/* Matbaa Teklifleri */}
            <Card>
              <CardHeader>
                <CardTitle>Gelen Teklifler ({printerQuotes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {printerQuotes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Henüz teklif gelmedi</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {printerQuotes.map((printerQuote) => (
                      <Card key={printerQuote.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold">{printerQuote.printerName || 'Matbaa Firması'}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(printerQuote.createdAt).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                ₺{printerQuote.price?.toLocaleString('tr-TR')}
                              </p>
                              {printerQuote.estimatedDays && (
                                <p className="text-sm text-gray-600">
                                  {printerQuote.estimatedDays} gün
                                </p>
                              )}
                            </div>
                          </div>

                          {printerQuote.notes && (
                            <p className="text-sm text-gray-700 mb-4">{printerQuote.notes}</p>
                          )}

                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => handleAcceptQuote(printerQuote.id)}
                              disabled={quote.status !== 'received_quotes'}
                            >
                              Kabul Et
                            </Button>
                            <Button variant="outline" size="sm">
                              İletişime Geç
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Yan Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Özet Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Tür</p>
                    <p className="text-sm text-gray-600">{quote.type}</p>
                  </div>
                </div>

                {quote.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Bütçe</p>
                      <p className="text-sm text-gray-600">₺{quote.budget}</p>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Toplam {printerQuotes.length} teklif alındı
                  </p>
                  {printerQuotes.length > 0 && (
                    <p className="text-xs text-gray-500">
                      En düşük: ₺{Math.min(...printerQuotes.map(pq => pq.price || 0)).toLocaleString('tr-TR')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}