
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Heart,
  Coffee,
  Laptop,
  GraduationCap,
  Building2,
  Zap,
  Target,
  Star,
  Send,
  CheckCircle
} from "lucide-react";

export default function Career() {
  const benefits = [
    {
      icon: Heart,
      title: "Sağlık Sigortası",
      description: "Kapsamlı özel sağlık sigortası"
    },
    {
      icon: Coffee,
      title: "Esnek Çalışma",
      description: "Hibrit ve remote çalışma seçenekleri"
    },
    {
      icon: Laptop,
      title: "Teknoloji Desteği",
      description: "Son model laptop ve ekipman"
    },
    {
      icon: GraduationCap,
      title: "Eğitim Bütçesi",
      description: "Yıllık 5.000₺ kişisel gelişim bütçesi"
    },
    {
      icon: TrendingUp,
      title: "Kariyer Gelişimi",
      description: "Hızlı terfi ve büyüme fırsatları"
    },
    {
      icon: Users,
      title: "Takım Ruhu",
      description: "Güçlü şirket kültürü ve etkinlikler"
    }
  ];

  const openPositions = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Teknoloji",
      location: "İstanbul / Remote",
      type: "Tam Zamanlı",
      experience: "5+ yıl",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
      description: "AI destekli baskı platformumuzun geliştirilmesinde rol alacak deneyimli geliştirici arıyoruz."
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Ürün",
      location: "İstanbul",
      type: "Tam Zamanlı",
      experience: "3+ yıl",
      skills: ["Product Strategy", "User Research", "Analytics", "Agile"],
      description: "B2B platformumuzun ürün stratejisini yönlendirecek product manager pozisyonu."
    },
    {
      id: 3,
      title: "Business Development Executive",
      department: "Satış",
      location: "İstanbul / Ankara",
      type: "Tam Zamanlı",
      experience: "2+ yıl",
      skills: ["B2B Sales", "CRM", "Negotiation", "Presentation"],
      description: "Kurumsal müşteri portföyümüzü genişletecek iş geliştirme uzmanı."
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Teknoloji",
      location: "İstanbul / Remote",
      type: "Tam Zamanlı",
      experience: "3+ yıl",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Monitoring"],
      description: "Platformumuzun altyapısını scale edilebilir hale getirecek DevOps uzmanı."
    },
    {
      id: 5,
      title: "UI/UX Designer",
      department: "Tasarım",
      location: "İstanbul",
      type: "Tam Zamanlı",
      experience: "2+ yıl",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      description: "Kullanıcı deneyimini optimize edecek kreatif tasarımcı arıyoruz."
    },
    {
      id: 6,
      title: "Customer Success Manager",
      department: "Müşteri İlişkileri",
      location: "İstanbul",
      type: "Tam Zamanlı",
      experience: "2+ yıl",
      skills: ["Customer Support", "CRM", "Data Analysis", "Communication"],
      description: "Müşteri memnuniyetini artıracak müşteri başarı uzmanı."
    }
  ];

  const companyValues = [
    {
      icon: Target,
      title: "Misyon Odaklılık",
      description: "Her kararımızda şirket misyonumuz rehberimizdir"
    },
    {
      icon: Zap,
      title: "İnovasyon",
      description: "Sürekli öğrenme ve gelişim ile yenilikçi çözümler"
    },
    {
      icon: Users,
      title: "Takım Çalışması",
      description: "Birlikte başardığımız her proje daha güçlü"
    },
    {
      icon: Star,
      title: "Mükemmellik",
      description: "Her detayda kalite ve mükemmellik arayışı"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              MatBixx'te Kariyer
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Türkiye'nin önde gelen B2B baskı platformunda yetenekli ekibimize katılın. 
              İnovatif projeler, büyüme fırsatları ve güçlü şirket kültürü sizi bekliyor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Takım Üyesi</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">12</div>
              <div className="text-gray-600">Açık Pozisyon</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">%95</div>
              <div className="text-gray-600">Çalışan Memnuniyeti</div>
            </div>
          </div>
        </div>
      </header>

      {/* Company Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Şirket Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600">
              MatBixx kültürünü oluşturan temel değerler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Çalışan Avantajları
            </h2>
            <p className="text-xl text-gray-600">
              Ekibimizin mutluluğu ve gelişimi önceliğimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <benefit.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Açık Pozisyonlar
            </h2>
            <p className="text-xl text-gray-600">
              Yetenekli ekibimize katılın, fark yaratın
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position) => (
              <Card key={position.id} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                        <CardTitle className="text-xl">{position.title}</CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {position.department}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {position.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {position.type}
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          {position.experience}
                        </div>
                      </div>
                    </div>
                    <Button className="mt-4 lg:mt-0">
                      Başvur
                      <Send className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{position.description}</p>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Aranan Beceriler:</h4>
                    <div className="flex flex-wrap gap-2">
                      {position.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Başvuru Süreci
            </h2>
            <p className="text-xl text-gray-600">
              Basit ve şeffaf işe alım sürecimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Başvuru</h3>
              <p className="text-gray-600 text-sm">CV ve ön yazınızı gönderin</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. İlk Görüşme</h3>
              <p className="text-gray-600 text-sm">HR ekibi ile tanışma görüşmesi</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Laptop className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Teknik Görüşme</h3>
              <p className="text-gray-600 text-sm">Ekip lideri ile teknik değerlendirme</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Karar</h3>
              <p className="text-gray-600 text-sm">Sonuç bildirimi ve işe başlangıç</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Aramızda Yer Almak İster misiniz?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Yeteneklerinizi MatBixx'te keşfetme zamanı
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Açık Pozisyonları İncele
              <Briefcase className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = 'mailto:kariyer@matbixx.com'}
            >
              CV Gönder
              <Send className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
