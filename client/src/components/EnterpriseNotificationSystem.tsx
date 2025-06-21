import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clock, MapPin, Building2, Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MockQuote {
  id: string;
  title: string;
  type: string;
  location: string;
  amount: string;
  status: string;
  time: string;
  estimatedBudget: number;
  quantity?: number;
  isGenerated: boolean;
  category?: string;
  companyName: string;
  description: string;
  deadline: string;
  urgency: 'normal' | 'urgent' | 'express';
  specifications: Record<string, any>;
  createdAt: Date;
}

interface MockQuoteResponse {
  id: string;
  quoteId: string;
  printerName: string;
  companyName: string;
  price: string;
  estimatedDays: number;
  notes: string;
  rating: number;
  totalRatings: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

interface EnterpriseNotificationSystemProps {
  userRole: 'customer' | 'printer' | 'admin';
  userId: string;
}

export function EnterpriseNotificationSystem({ userRole, userId }: EnterpriseNotificationSystemProps) {
  const [mockQuotes, setMockQuotes] = useState<MockQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<MockQuote | null>(null);
  const [quoteResponses, setQuoteResponses] = useState<Record<string, MockQuoteResponse[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseForm, setResponseForm] = useState({
    price: '',
    estimatedDays: '',
    notes: ''
  });
  const { toast } = useToast();

  // Load mock quotes on component mount
  useEffect(() => {
    fetchMockQuotes();
    
    // Set up WebSocket connection for real-time updates
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'mock_quotes_update') {
          setMockQuotes(prev => [...data.quotes, ...prev].slice(0, 50)); // Keep last 50 quotes
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const fetchMockQuotes = async () => {
    try {
      const response = await fetch('/api/quotes/mock');
      const data = await response.json();
      
      if (data.success) {
        setMockQuotes(data.quotes || []);
      }
    } catch (error) {
      console.error('Failed to fetch mock quotes:', error);
    }
  };

  const fetchQuoteResponses = async (quoteId: string) => {
    try {
      const response = await fetch(`/api/quotes/mock/${quoteId}/responses`);
      const data = await response.json();
      
      if (data.success) {
        setQuoteResponses(prev => ({
          ...prev,
          [quoteId]: data.responses || []
        }));
      }
    } catch (error) {
      console.error('Failed to fetch quote responses:', error);
    }
  };

  const handleQuoteClick = async (quote: MockQuote) => {
    setSelectedQuote(quote);
    await fetchQuoteResponses(quote.id);
  };

  const handleSubmitResponse = async () => {
    if (!selectedQuote) return;

    if (!responseForm.price || !responseForm.estimatedDays) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen fiyat ve tahmini süre bilgilerini girin.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/quotes/mock/${selectedQuote.id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(responseForm)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Teklif Gönderildi",
          description: "Mock teklife başarıyla yanıt verdiniz.",
          variant: "default"
        });

        // Reset form
        setResponseForm({
          price: '',
          estimatedDays: '',
          notes: ''
        });

        // Refresh responses
        await fetchQuoteResponses(selectedQuote.id);
      } else {
        throw new Error(data.message || 'Teklif gönderilemedi');
      }
    } catch (error) {
      console.error('Submit response error:', error);
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Teklif gönderilirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'express': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'teklif aşamasında': return 'bg-yellow-100 text-yellow-800';
      case 'değerlendirmede': return 'bg-blue-100 text-blue-800';
      case 'üretim hazırlık': return 'bg-purple-100 text-purple-800';
      case 'onay bekliyor': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (mockQuotes.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Canlı İş Takibi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Henüz aktif teklif bulunmuyor.</p>
            <p className="text-sm mt-2">Yeni teklifler otomatik olarak burada görünecek.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Canlı İş Takibi
            <Badge variant="secondary" className="ml-auto">
              {mockQuotes.length} Aktif Teklif
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mockQuotes.map((quote) => (
              <Card 
                key={quote.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                onClick={() => handleQuoteClick(quote)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{quote.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {quote.companyName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {quote.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {quote.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getUrgencyColor(quote.urgency)}>
                        {quote.urgency === 'express' ? 'Acil' : 
                         quote.urgency === 'urgent' ? 'Öncelikli' : 'Normal'}
                      </Badge>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Kategori:</span>
                      <p className="font-medium">{quote.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Miktar:</span>
                      <p className="font-medium">{quote.quantity?.toLocaleString('tr-TR')} adet</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Bütçe:</span>
                      <p className="font-medium text-green-600">{quote.amount}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {quote.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quote Detail Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedQuote(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {selectedQuote.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Company Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-gray-500">Şirket</Label>
                        <p className="font-medium">{selectedQuote.companyName}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Konum</Label>
                        <p className="font-medium">{selectedQuote.location}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Miktar</Label>
                        <p className="font-medium">{selectedQuote.quantity?.toLocaleString('tr-TR')} adet</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Bütçe</Label>
                        <p className="font-medium text-green-600">{selectedQuote.amount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardContent className="p-4">
                    <Label className="text-gray-500">Proje Açıklaması</Label>
                    <p className="mt-2">{selectedQuote.description}</p>
                  </CardContent>
                </Card>

                {/* Specifications */}
                {selectedQuote.specifications && Object.keys(selectedQuote.specifications).length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <Label className="text-gray-500">Teknik Özellikler</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {Object.entries(selectedQuote.specifications).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-sm text-gray-500 capitalize">{key}:</span>
                            <p className="font-medium">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Response Form for Printers */}
                {userRole === 'printer' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Teklif Ver</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Teklif Fiyatı (₺)</Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder="15000"
                            value={responseForm.price}
                            onChange={(e) => setResponseForm(prev => ({ ...prev, price: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="estimatedDays">Tahmini Süre (gün)</Label>
                          <Input
                            id="estimatedDays"
                            type="number"
                            placeholder="15"
                            value={responseForm.estimatedDays}
                            onChange={(e) => setResponseForm(prev => ({ ...prev, estimatedDays: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="notes">Notlar</Label>
                        <Textarea
                          id="notes"
                          placeholder="Kaliteli ve zamanında teslimat garantisi..."
                          value={responseForm.notes}
                          onChange={(e) => setResponseForm(prev => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                      <Button 
                        onClick={handleSubmitResponse}
                        disabled={isSubmitting || !responseForm.price || !responseForm.estimatedDays}
                        className="w-full"
                      >
                        {isSubmitting ? 'Gönderiliyor...' : 'Teklif Gönder'}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Existing Responses */}
                {quoteResponses[selectedQuote.id] && quoteResponses[selectedQuote.id].length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Alınan Teklifler</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {quoteResponses[selectedQuote.id].map((response) => (
                          <Card key={response.id} className="border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">{response.companyName}</h4>
                                  <p className="text-sm text-gray-600">{response.printerName}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-yellow-500">★</span>
                                    <span className="text-sm">{response.rating.toFixed(1)} ({response.totalRatings} değerlendirme)</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-green-600">{response.price}</p>
                                  <p className="text-sm text-gray-600">{response.estimatedDays} gün</p>
                                </div>
                              </div>
                              {response.notes && (
                                <p className="text-sm text-gray-600 mt-3 p-2 bg-gray-50 rounded">
                                  {response.notes}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}