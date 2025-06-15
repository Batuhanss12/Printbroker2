
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Building2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    contactType: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Mesajınız İletildi",
      description: "En kısa sürede size dönüş yapacağız.",
    });
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
      contactType: ""
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bize Ulaşın</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            MatBixx Profesyonel Baskı Platformu ile ilgili her türlü soru, öneri ve 
            işbirliği teklifleriniz için bizimle iletişime geçin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Telefon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-900">Genel Destek</p>
                      <p className="text-gray-600">0850 XXX XX XX</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Kurumsal Satış</p>
                      <p className="text-gray-600">0850 XXX XX XX</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Teknik Destek</p>
                      <p className="text-gray-600">0850 XXX XX XX</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    E-posta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-900">Genel</p>
                      <p className="text-gray-600">info@matbixx.com</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Satış</p>
                      <p className="text-gray-600">sales@matbixx.com</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Destek</p>
                      <p className="text-gray-600">support@matbixx.com</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Güvenlik</p>
                      <p className="text-gray-600">security@matbixx.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Adres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">MatBixx Teknoloji A.Ş.</p>
                    <p className="text-gray-600">
                      Maslak Mahallesi<br />
                      Eski Büyükdere Caddesi No: 269<br />
                      Sarıyer / İstanbul<br />
                      34485 Türkiye
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Çalışma Saatleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pazartesi - Cuma</span>
                      <span className="font-semibold">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cumartesi</span>
                      <span className="font-semibold">10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pazar</span>
                      <span className="text-red-600">Kapalı</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-green-800 text-sm font-medium">
                        🟢 7/24 Online Destek Aktif
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  İletişim Formu
                </CardTitle>
                <CardDescription>
                  Aşağıdaki formu doldurarak bizimle doğrudan iletişime geçebilirsiniz. 
                  24 saat içinde size dönüş yapacağız.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Ad Soyad *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-posta *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Şirket</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleChange("company", e.target.value)}
                        placeholder="Şirket adınız"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="0XXX XXX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contactType">İletişim Konusu *</Label>
                    <Select value={formData.contactType} onValueChange={(value) => handleChange("contactType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Konu seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Genel Bilgi</SelectItem>
                        <SelectItem value="sales">Satış ve Fiyatlandırma</SelectItem>
                        <SelectItem value="support">Teknik Destek</SelectItem>
                        <SelectItem value="partnership">İş Ortaklığı</SelectItem>
                        <SelectItem value="complaint">Şikayet</SelectItem>
                        <SelectItem value="suggestion">Öneri</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Konu Başlığı *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      placeholder="Mesajınızın konusu"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mesajınız *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Detaylı mesajınızı buraya yazın..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Kurumsal Müşteriler İçin</h3>
                        <p className="text-blue-800 text-sm">
                          Özel fiyatlandırma, dedike hesap yöneticisi ve öncelikli destek için 
                          kurumsal satış ekibimizle iletişime geçin.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Mesajı Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Canlı Destek</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Platform üzerinden anında yardım alın
                </p>
                <Button variant="outline" size="sm">
                  Chat Başlat
                </Button>
              </Card>

              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Telefon Desteği</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Uzman ekibimizle doğrudan konuşun
                </p>
                <Button variant="outline" size="sm">
                  Hemen Ara
                </Button>
              </Card>

              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">E-posta Desteği</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Detaylı sorularınız için yazın
                </p>
                <Button variant="outline" size="sm">
                  E-posta Gönder
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
