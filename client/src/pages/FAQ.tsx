
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  ArrowRight,
  CreditCard,
  FileText,
  Truck,
  Shield
} from "lucide-react";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      id: "general",
      title: "Genel Sorular",
      icon: HelpCircle,
      color: "blue",
      questions: [
        {
          question: "MatBixx nedir ve nasıl çalışır?",
          answer: "MatBixx, kurumsal firmaların baskı ihtiyaçlarını karşılayan B2B platformudur. AI destekli otomatik tasarım sistemi ile 500+ üretici firmadan anında teklif alabilir, profesyonel tasarımlar oluşturabilirsiniz."
        },
        {
          question: "Hangi ürün kategorilerinde hizmet veriyorsunuz?",
          answer: "Kartvizit, broşür, katalog, etiket, sticker, ambalaj, banner, tabela, tekstil baskı ve promosyon ürünleri dahil geniş bir yelpazeye sahibiz. Her sektöre özel çözümler sunuyoruz."
        },
        {
          question: "Minimum sipariş miktarları nedir?",
          answer: "Ürün kategorisine göre değişiklik gösterir. Kartvizit için 100 adet, etiket için 500 adet, ambalaj için 250 adet minimum sipariş miktarları mevcuttur."
        },
        {
          question: "Kalite garantiniz var mı?",
          answer: "Evet, ISO 9001:2015 kalite yönetim sistemi ile çalışan üretici firmalarımız bulunmaktadır. Tüm ürünlerimiz kalite kontrol süreçlerinden geçer ve garantili olarak teslim edilir."
        }
      ]
    },
    {
      id: "pricing",
      title: "Fiyatlandırma & Ödeme",
      icon: CreditCard,
      color: "green",
      questions: [
        {
          question: "Kredili tasarım sistemi nasıl çalışır?",
          answer: "Müşterilerimiz tasarım başına 35₺ ödeyerek AI destekli otomatik tasarım sistemi kullanabilir. Aylık 2999₺ paket ile sınırsız tasarım hakkı sunyoruz."
        },
        {
          question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
          answer: "Kredi kartı, banka kartı, havale/EFT ve kurumsal fatura seçenekleri mevcuttur. PayTR güvenli ödeme altyapısı kullanıyoruz."
        },
        {
          question: "Fatura ve muhasebe işlemleri nasıl yürütülür?",
          answer: "Tüm işlemleriniz için yasal fatura kesilir. E-fatura sistemine entegreyiz ve muhasebe departmanınızla uyumlu çalışırız."
        },
        {
          question: "Toplu sipariş indirimleri var mı?",
          answer: "Evet, sipariş miktarına ve süreklilik durumuna göre özel indirimler sunuyoruz. Kurumsal hesap yöneticinizle görüşerek detayları öğrenebilirsiniz."
        }
      ]
    },
    {
      id: "design",
      title: "Tasarım & Dosya Formatları",
      icon: FileText,
      color: "purple",
      questions: [
        {
          question: "Hangi dosya formatlarını kabul ediyorsunuz?",
          answer: "PDF, AI, EPS, PSD, JPG, PNG, TIFF formatlarını kabul ediyoruz. En iyi sonuç için vektörel formatlar (AI, EPS) önerilir."
        },
        {
          question: "Tasarım yapmıyorsanız ne yapmalıyım?",
          answer: "AI destekli otomatik tasarım sistemimiz ile logonuz ve marka bilgilerinizi girerek 30 saniyede profesyonel tasarımlar oluşturabilirsiniz."
        },
        {
          question: "Baskı hazırlık sürecinde nelere dikkat etmeliyim?",
          answer: "300 DPI çözünürlük, CMYK renk modu, taşma payı (bleed) ayarları ve kesim çizgileri önemlidir. Sistem otomatik olarak dosyanızı analiz eder ve öneriler sunar."
        },
        {
          question: "Telif hakkı konusunda sorumluluklarım neler?",
          answer: "Yüklediğiniz tasarımlarda telif hakkı izinlerini almanız gerekmektedir. Ticari kullanım için lisanslı görseller ve fontlar kullanmalısınız."
        }
      ]
    },
    {
      id: "shipping",
      title: "Kargo & Teslimat",
      icon: Truck,
      color: "orange",
      questions: [
        {
          question: "Teslimat süreleri ne kadar?",
          answer: "Ürün kategorisine göre değişir: Kartvizit 24-48 saat, etiket 24-72 saat, broşür 3-5 iş günü, ambalaj 5-7 iş günü, tekstil 7-12 iş günü."
        },
        {
          question: "Hangi kargo firmalarıyla çalışıyorsunuz?",
          answer: "Aras Kargo, MNG Kargo, Yurtiçi Kargo ve PTT Kargo ile anlaşmalıyız. Size en uygun seçeneği sunarız."
        },
        {
          question: "Kargo ücreti ne kadar?",
          answer: "Türkiye genelinde 15₺ sabit kargo ücreti uygulanır. 500₺ ve üzeri siparişlerde kargo ücretsizdir."
        },
        {
          question: "Acil teslimat seçeneği var mı?",
          answer: "Evet, belirli ürünler için express teslimat seçeneği mevcuttur. Ek ücret karşılığında 24 saat içinde teslimat yapılabilir."
        }
      ]
    },
    {
      id: "support",
      title: "Teknik Destek",
      icon: Shield,
      color: "red",
      questions: [
        {
          question: "Teknik destek nasıl alabilirim?",
          answer: "7/24 canlı destek hattımız, e-posta ve WhatsApp üzerinden teknik destek alabilirsiniz. Ayrıca video görüşme desteği de sunuyoruz."
        },
        {
          question: "Sipariş takibi nasıl yapılır?",
          answer: "Müşteri panelinizden siparişlerinizi canlı olarak takip edebilirsiniz. SMS ve e-posta bildirimleri ile durum güncellemeleri alırsınız."
        },
        {
          question: "Sorun yaşadığımda iade/değişim yapabilir miyim?",
          answer: "Kalite sorunu durumunda %100 iade veya yeniden üretim garantisi veriyoruz. 7 gün içinde iade talep edebilirsiniz."
        },
        {
          question: "Eğitim ve dokümantasyon desteği var mı?",
          answer: "Evet, platform kullanımı için video eğitimler, PDF rehberler ve webinar eğitimleri düzenliyoruz."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            MatBixx hakkında merak ettiğiniz tüm soruların cevapları burada
          </p>
          
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Soru arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </header>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aradığınız soru bulunamadı
              </h3>
              <p className="text-gray-600 mb-6">
                Farklı anahtar kelimeler deneyin veya bizimle iletişime geçin
              </p>
              <Button onClick={() => setSearchQuery("")}>
                Tüm Soruları Göster
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.id}>
                    <div className="flex items-center mb-8">
                      <div className={`w-12 h-12 bg-${category.color}-100 rounded-xl flex items-center justify-center mr-4`}>
                        <IconComponent className={`h-6 w-6 text-${category.color}-600`} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {category.title}
                        </h2>
                        <Badge variant="secondary" className="mt-1">
                          {category.questions.length} soru
                        </Badge>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="space-y-4">
                      {category.questions.map((faq, index) => (
                        <AccordionItem 
                          key={index} 
                          value={`${category.id}-${index}`}
                          className="border border-gray-200 rounded-lg px-6"
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-semibold text-gray-900">
                              {faq.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Cevabını Bulamadınız mı?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Uzman ekibimiz size yardımcı olmaya hazır
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Canlı Destek</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">7/24 canlı destek hattımız</p>
                <Button className="w-full">
                  Sohbet Başlat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>E-posta Desteği</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">24 saat içinde yanıt</p>
                <Button variant="outline" className="w-full">
                  E-posta Gönder
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Telefon Desteği</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">0850 XXX XX XX</p>
                <Button variant="outline" className="w-full">
                  Ara
                </Button>
              </CardContent>
            </Card>
          </div>

          <Button 
            size="lg"
            onClick={() => window.location.href = '/'}
          >
            Ana Sayfaya Dön
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
