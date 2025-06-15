
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Search, Book, MessageSquare, Phone, Mail, Video, FileText, HelpCircle, Users, Zap } from "lucide-react";
import { useState } from "react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: Book,
      title: "Başlangıç Rehberi",
      description: "MatBixx platformunu kullanmaya başlamanız için adım adım rehber",
      articles: 12,
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: FileText,
      title: "Tasarım Sistemi",
      description: "Otomatik tasarım oluşturma ve düzenleme rehberleri",
      articles: 8,
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Users,
      title: "Sipariş Yönetimi",
      description: "Sipariş verme, takip etme ve yönetme süreçleri",
      articles: 15,
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Zap,
      title: "Teknik Destek",
      description: "Platform kullanımı ve teknik sorunlar için çözümler",
      articles: 20,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  const popularArticles = [
    {
      title: "MatBixx'e nasıl kayıt olurum?",
      views: "2.5k görüntüleme",
      category: "Başlangıç"
    },
    {
      title: "Otomatik tasarım sistemi nasıl çalışır?",
      views: "1.8k görüntüleme",
      category: "Tasarım"
    },
    {
      title: "Sipariş durumumu nasıl takip ederim?",
      views: "1.6k görüntüleme",
      category: "Sipariş"
    },
    {
      title: "Ödeme yöntemleri nelerdir?",
      views: "1.4k görüntüleme",
      category: "Ödeme"
    },
    {
      title: "Kurumsal hesap avantajları nelerdir?",
      views: "1.2k görüntüleme",
      category: "Kurumsal"
    }
  ];

  const faqItems = [
    {
      question: "MatBixx nedir ve nasıl çalışır?",
      answer: "MatBixx, profesyonel baskı ihtiyaçlarınız için geliştirilen B2B platformudur. AI destekli otomatik tasarım sistemi ile 30 saniyede profesyonel tasarımlar oluşturabilir, 500+ üretici firmadan anında teklif alabilirsiniz."
    },
    {
      question: "Kredili tasarım sistemi nedir?",
      answer: "Kredili tasarım sistemi, her tasarım için 35₺ ödeme yapabileceğiniz esnek bir modeldir. Bu sistem ile ihtiyaç duyduğunuz kadar tasarım oluşturabilir, sadece kullandığınız tasarımlar için ödeme yaparsınız."
    },
    {
      question: "Minimum sipariş miktarı var mı?",
      answer: "Ürün tipine göre minimum sipariş miktarları değişir. Kartvizit için 100 adet, etiket için 500 adet, ambalaj için 250 adet minimum sipariş gereklidir. Kurumsal müşteriler için özel koşullar uygulanabilir."
    },
    {
      question: "Teslimat süreleri nedir?",
      answer: "Express ürünler 24-48 saat, standart ürünler 3-7 iş günü içinde teslim edilir. Özel tasarım ürünlerde ek 1-2 iş günü süre eklenebilir. Teslimat süreleri üretici firma onayından sonra başlar."
    },
    {
      question: "Kalite garantiniz var mı?",
      answer: "Evet! %100 memnuniyet garantisi sunuyoruz. Tüm üretici firmalarımız ISO 9001 kalite standardına sahiptir. Ürününüzden memnun kalmazsanız, yenisini ücretsiz üretiyoruz."
    },
    {
      question: "Kurumsal müşteri olmak için ne gerekir?",
      answer: "Kurumsal müşteri olmak için şirket bilgileriniz, vergi levhanız ve yetkilendirme belgeleriniz gereklidir. Kurumsal müşteriler özel fiyatlandırma, dedike hesap yöneticisi ve öncelikli destek hizmetlerinden yararlanır."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Yardım Merkezi</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            MatBixx platformunu daha iyi kullanmanız için rehberler, 
            sık sorulan sorular ve detaylı açıklamalar.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Aradığınızı yazın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3"
            />
          </div>
        </div>

        {/* Quick Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Canlı Destek</h3>
            <p className="text-gray-600 text-sm mb-4">
              7/24 canlı destek ile anında yardım alın
            </p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Chat Başlat
            </Button>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Telefon Desteği</h3>
            <p className="text-gray-600 text-sm mb-4">
              Uzman ekibimizle doğrudan konuşun
            </p>
            <Button size="sm" variant="outline">
              0850 XXX XX XX
            </Button>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">E-posta Desteği</h3>
            <p className="text-gray-600 text-sm mb-4">
              Detaylı sorularınız için yazın
            </p>
            <Button size="sm" variant="outline">
              support@matbixx.com
            </Button>
          </Card>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Yardım Kategorileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="outline">{category.articles} makale</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Articles */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popüler Makaleler</h2>
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{article.views}</span>
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                        </div>
                      </div>
                      <Video className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sık Sorulan Sorular</h2>
              <Card>
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Hızlı Bağlantılar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Kullanım Kılavuzu
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Video Eğitimleri
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  API Dokümantasyonu
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Topluluk Forumu
                </Button>
              </CardContent>
            </Card>

            {/* Latest Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Son Güncellemeler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-900">
                    Yeni Tasarım Şablonları
                  </h4>
                  <p className="text-xs text-gray-600">
                    50+ yeni profesyonel şablon eklendi
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs">Yeni</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-900">
                    Gelişmiş Takip Sistemi
                  </h4>
                  <p className="text-xs text-gray-600">
                    Gerçek zamanlı sipariş takibi aktif
                  </p>
                  <Badge variant="outline" className="text-xs">Güncelleme</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-900">
                    Mobil Uygulama
                  </h4>
                  <p className="text-xs text-gray-600">
                    iOS ve Android uygulamaları yakında
                  </p>
                  <Badge variant="outline" className="text-xs">Yakında</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Aradığınızı Bulamadınız mı?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Uzman destek ekibimiz size yardımcı olmak için hazır.
                </p>
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Destek Talebi Oluştur
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
