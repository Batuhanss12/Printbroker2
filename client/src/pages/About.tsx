
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Building2,
  Users,
  Target,
  Award,
  TrendingUp,
  Globe,
  Shield,
  CheckCircle,
  ArrowRight,
  Factory,
  Zap,
  Heart
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            MatBixx Hakkında
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Türkiye'nin önde gelen B2B baskı platformu olarak, kurumsal firmaların 
            baskı ihtiyaçlarını teknoloji ile buluşturuyoruz.
          </p>
        </div>
      </header>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Misyonumuz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-center">
                  Kurumsal firmaların baskı süreçlerini dijitalleştirerek, 
                  zaman ve maliyet tasarrufu sağlamak. AI destekli otomatik tasarım 
                  sistemi ile profesyonel sonuçları herkes için erişilebilir kılmak.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Vizyonumuz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-center">
                  Dünya çapında tanınan, teknoloji odaklı baskı platformu olmak. 
                  Sürdürülebilir üretim modelleri ile çevre dostu çözümler sunarak 
                  sektörde liderliği sürdürmek.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Rakamlarla MatBixx
            </h2>
            <p className="text-xl text-gray-600">
              Güvenilir partneriniz olmanın gururunu yaşıyoruz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Üretici Firma</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-gray-600">Aktif Müşteri</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">%98</div>
              <div className="text-gray-600">Müşteri Memnuniyeti</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">7/24</div>
              <div className="text-gray-600">Teknik Destek</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600">
              Her kararımızda rehber olan temel değerlerimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Güvenilirlik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ISO 9001 kalite standartları ile her projede 
                  güvenilir sonuçlar garantisi.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>İnovasyon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI destekli otomatik tasarım sistemi ile 
                  sektöre öncülük ediyoruz.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Müşteri Odaklılık</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Her müşterimizin benzersiz ihtiyaçlarına 
                  özel çözümler geliştiriyoruz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Uzman Ekibimiz
            </h2>
            <p className="text-xl text-gray-600">
              Alanında uzman profesyonellerle güçlü bir ekip
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Geliştirme Ekibi</h3>
              <p className="text-gray-600">
                AI ve makine öğrenmesi uzmanları ile 
                sürekli platform geliştirme
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">İş Geliştirme</h3>
              <p className="text-gray-600">
                Kurumsal müşteri ilişkileri ve 
                stratejik ortaklık yönetimi
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kalite Kontrol</h3>
              <p className="text-gray-600">
                Her projede mükemmel sonuç için 
                titiz kalite kontrol süreci
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            MatBixx Ailesine Katılın
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Baskı ihtiyaçlarınız için güvenilir çözümler keşfedin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = '/customer-register'}
            >
              Ücretsiz Hesap Aç
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
