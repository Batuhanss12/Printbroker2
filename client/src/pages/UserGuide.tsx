
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  ArrowRight, 
  User, 
  FileText, 
  ShoppingCart, 
  CreditCard,
  Truck,
  Settings,
  BarChart3,
  Users,
  Building2
} from "lucide-react";

export default function UserGuide() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Hesap Oluşturma",
      description: "MatBixx platformuna kayıt olun",
      icon: User,
      duration: "2 dakika",
      completed: true
    },
    {
      title: "Profil Tamamlama",
      description: "Şirket bilgilerinizi ekleyin",
      icon: Building2,
      duration: "3 dakika",
      completed: true
    },
    {
      title: "İlk Tasarım",
      description: "Otomatik tasarım sistemi ile başlayın",
      icon: FileText,
      duration: "5 dakika",
      completed: false
    },
    {
      title: "Teklif Alma",
      description: "500+ üretici firmadan teklif alın",
      icon: ShoppingCart,
      duration: "2 dakika",
      completed: false
    },
    {
      title: "Ödeme ve Sipariş",
      description: "Güvenli ödeme ile siparişinizi verin",
      icon: CreditCard,
      duration: "3 dakika",
      completed: false
    },
    {
      title: "Takip ve Teslimat",
      description: "Siparişinizi takip edin",
      icon: Truck,
      duration: "Otomatik",
      completed: false
    }
  ];

  const guides = [
    {
      category: "Başlangıç",
      title: "Platform Tanıtımı",
      description: "MatBixx platformunu tanıyın ve temel özelliklerini öğrenin",
      duration: "5 dakika",
      level: "Başlangıç",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600"
    },
    {
      category: "Tasarım",
      title: "Otomatik Tasarım Sistemi",
      description: "AI destekli tasarım sistemini kullanarak profesyonel tasarımlar oluşturun",
      duration: "10 dakika",
      level: "Başlangıç",
      icon: FileText,
      color: "bg-purple-100 text-purple-600"
    },
    {
      category: "Sipariş",
      title: "Sipariş Yönetimi",
      description: "Sipariş verme, takip etme ve yönetme süreçlerini öğrenin",
      duration: "8 dakika",
      level: "Orta",
      icon: ShoppingCart,
      color: "bg-green-100 text-green-600"
    },
    {
      category: "Kurumsal",
      title: "Kurumsal Özellikler",
      description: "Kurumsal müşteriler için gelişmiş özellikler ve avantajlar",
      duration: "12 dakika",
      level: "İleri",
      icon: Building2,
      color: "bg-orange-100 text-orange-600"
    },
    {
      category: "Analiz",
      title: "Raporlama ve Analiz",
      description: "Sipariş geçmişinizi analiz edin ve raporlar oluşturun",
      duration: "15 dakika",
      level: "İleri",
      icon: BarChart3,
      color: "bg-red-100 text-red-600"
    },
    {
      category: "Ayarlar",
      title: "Hesap Ayarları",
      description: "Hesap ayarlarınızı optimize edin ve güvenlik önlemlerini alın",
      duration: "6 dakika",
      level: "Orta",
      icon: Settings,
      color: "bg-gray-100 text-gray-600"
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">İşlem Rehberi</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            MatBixx platformunu etkili kullanmanız için adım adım rehberler ve 
            detaylı açıklamalar.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>İlerleme Durumunuz</span>
              <Badge className="bg-blue-100 text-blue-800">
                {completedSteps}/{steps.length} Tamamlandı
              </Badge>
            </CardTitle>
            <CardDescription>
              Platform kullanımında nerede olduğunuzu takip edin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Genel İlerleme</span>
                <span className="font-semibold">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {steps.slice(0, 6).map((step, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    step.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <step.icon className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step by Step Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Adım Adım Rehber</h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <Card key={index} className={`cursor-pointer transition-all ${
                  activeStep === index ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                }`} onClick={() => setActiveStep(index)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          step.completed ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <step.icon className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {index + 1}. {step.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-xs">
                          {step.duration}
                        </Badge>
                        {step.completed ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Tamamlandı
                          </Badge>
                        ) : (
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Current Step Details */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(steps[activeStep].icon, { className: "h-5 w-5 text-blue-600" })}
                  {steps[activeStep].title}
                </CardTitle>
                <CardDescription>
                  {steps[activeStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Bu Adımda:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    {activeStep === 0 && (
                      <>
                        <li>• E-posta ile kayıt olun</li>
                        <li>• E-posta doğrulaması yapın</li>
                        <li>• Şifrenizi belirleyin</li>
                      </>
                    )}
                    {activeStep === 1 && (
                      <>
                        <li>• Şirket bilgilerini girin</li>
                        <li>• İletişim bilgilerini ekleyin</li>
                        <li>• Hesap türünü seçin</li>
                      </>
                    )}
                    {activeStep === 2 && (
                      <>
                        <li>• Tasarım kategorisi seçin</li>
                        <li>• Ürün bilgilerini girin</li>
                        <li>• AI sisteminin tasarımını inceleyin</li>
                      </>
                    )}
                    {activeStep === 3 && (
                      <>
                        <li>• Teklifleri karşılaştırın</li>
                        <li>• Üretici firma seçin</li>
                        <li>• Kalite değerlendirmesi yapın</li>
                      </>
                    )}
                    {activeStep === 4 && (
                      <>
                        <li>• Ödeme yöntemini seçin</li>
                        <li>• Güvenli ödeme yapın</li>
                        <li>• Sipariş onayını alın</li>
                      </>
                    )}
                    {activeStep === 5 && (
                      <>
                        <li>• Üretim durumunu takip edin</li>
                        <li>• Kargo takibini yapın</li>
                        <li>• Teslimatı teyit edin</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Video İzle
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Detaylı Açıklama
                  </Button>
                  {!steps[activeStep].completed && (
                    <Button variant="ghost" className="w-full" size="sm">
                      Bu Adımı Tamamla
                    </Button>
                  )}
                </div>

                <div className="text-xs text-gray-500 text-center">
                  Tahmini süre: {steps[activeStep].duration}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Guides */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detaylı Rehberler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 ${guide.color} rounded-lg flex items-center justify-center`}>
                      <guide.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {guide.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {guide.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Süre: {guide.duration}</span>
                    <Badge variant="outline" className="text-xs">
                      {guide.category}
                    </Badge>
                  </div>
                  <Button variant="ghost" className="w-full mt-4" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Başlat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Hızlı İpuçları</CardTitle>
            <CardDescription>
              Platform kullanımını kolaylaştıracak faydalı ipuçları
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Tasarım Önerileri</h4>
                    <p className="text-gray-600 text-xs">
                      Yüksek çözünürlüklü görseller kullanın ve renk profillerini kontrol edin.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Maliyet Optimizasyonu</h4>
                    <p className="text-gray-600 text-xs">
                      Toplu siparişlerle birim maliyetleri düşürün ve ücretsiz kargo kazanın.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Kalite Kontrolü</h4>
                    <p className="text-gray-600 text-xs">
                      Üretim öncesi dijital proof'u mutlaka inceleyin ve onaylayın.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-600 text-xs font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Teslimat Planlama</h4>
                    <p className="text-gray-600 text-xs">
                      Önemli etkinlikler için en az 1 hafta önceden sipariş verin.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Müşteri Desteği</h4>
                    <p className="text-gray-600 text-xs">
                      Her türlü sorunuz için 7/24 canlı destek hattımızı kullanın.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gray-600 text-xs font-bold">6</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Kurumsal Avantajlar</h4>
                    <p className="text-gray-600 text-xs">
                      Kurumsal hesap açarak özel fiyatlandırma ve öncelikli destek alın.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="text-center">
          <Button onClick={() => window.history.back()}>
            Geri Dön
          </Button>
        </div>
      </div>
    </div>
  );
}
