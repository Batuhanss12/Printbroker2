
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, CreditCard, Truck, Award, CheckCircle } from "lucide-react";

export default function SecureShopping() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Güvenli Alışveriş</h1>
            <p className="text-lg text-gray-600">MatBixx Profesyonel Baskı Platformu</p>
            <Badge className="bg-green-100 text-green-800 mt-2">%100 Güvenli Platform</Badge>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Veri Güvenliği
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">SSL 256-bit Şifreleme</h3>
                      <p className="text-gray-600 text-sm">Tüm veri transferleri güvenli şifreleme ile korunur</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">KVKK Uyumluluğu</h3>
                      <p className="text-gray-600 text-sm">Kişisel veriler mevzuata uygun işlenir</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">ISO 27001 Sertifikası</h3>
                      <p className="text-gray-600 text-sm">Uluslararası güvenlik standartları</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">7/24 Güvenlik İzleme</h3>
                      <p className="text-gray-600 text-sm">Sürekli sistem güvenlik kontrolü</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Ödeme Güvenliği
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">3D Secure Ödeme Sistemi</h3>
                  <p className="text-blue-800 text-sm">
                    Tüm kredi kartı ödemeleri 3D Secure teknolojisi ile güvence altındadır.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Visa</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Mastercard</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">American Express</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Troy</p>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <h4 className="font-semibold text-gray-900">Alternatif Ödeme Yöntemleri:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Havale/EFT (Güvenli banka transferi)</li>
                    <li>Kurumsal fatura (B2B müşteriler için)</li>
                    <li>Kredili sistem (Onaylanmış firmalar için)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Teslimat Güvenliği
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Güvenli Paketleme</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Özel koruyucu ambalajlar</li>
                      <li>Su geçirmez koruma</li>
                      <li>Darbe emici malzemeler</li>
                      <li>Güvenlik bantları</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Takip ve İzleme</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Gerçek zamanlı takip</li>
                      <li>SMS/E-posta bildirimleri</li>
                      <li>Teslimat fotoğrafları</li>
                      <li>İmza teyidi</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-green-800 text-sm">
                    <strong>Güvence:</strong> Tüm sevkiyatlar sigortalıdır ve hasarlı teslimat durumunda yenisi ücretsiz gönderilir.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Kalite Güvenceleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">ISO 9001</h3>
                    <p className="text-sm text-gray-600">Kalite yönetim sistemi</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">%100 Memnuniyet</h3>
                    <p className="text-sm text-gray-600">Garantili hizmet kalitesi</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Tam Sigorta</h3>
                    <p className="text-sm text-gray-600">Kapsamlı koruma</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Güvenlik İpuçları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-900 mb-2">Güvenli Alışveriş İçin Öneriler:</h3>
                  <ul className="list-disc list-inside text-amber-800 space-y-1 text-sm">
                    <li>Sadece güvenilir ağlarda (kendi wi-fi'niz) işlem yapın</li>
                    <li>Şifrelerinizi düzenli olarak güncelleyin</li>
                    <li>Hesap aktivitelerinizi düzenli kontrol edin</li>
                    <li>Şüpheli durumları derhal bildirin</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7/24 Güvenlik Desteği</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Güvenlikle ilgili herhangi bir endişeniz olduğunda bizimle iletişime geçin:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600">🔒 Güvenlik E-posta: security@matbixx.com</p>
                  <p className="text-gray-600">📞 Acil Güvenlik Hattı: 0850 XXX XX XX</p>
                  <p className="text-gray-600">💬 Canlı Destek: Platform içi chat sistemi</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          <div className="text-center">
            <Button onClick={() => window.history.back()}>
              Geri Dön
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
