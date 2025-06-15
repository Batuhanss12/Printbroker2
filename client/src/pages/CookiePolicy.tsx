
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Çerez Politikası</h1>
            <p className="text-lg text-gray-600">MatBixx Profesyonel Baskı Platformu</p>
            <p className="text-sm text-gray-500 mt-2">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Çerezler Nedir?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Çerezler, web sitelerinin kullanıcı deneyimini geliştirmek için kullandığı küçük metin dosyalarıdır. 
                  MatBixx olarak, platformumuzun işlevselliğini artırmak ve size daha iyi hizmet sunmak için çerezleri kullanıyoruz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kullandığımız Çerez Türleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Zorunlu Çerezler</h3>
                  <p className="text-gray-700">
                    Platform güvenliği, oturum yönetimi ve temel işlevler için gereklidir. Bu çerezler devre dışı bırakılamaz.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>Kullanıcı oturumu ve kimlik doğrulama</li>
                    <li>Platform güvenlik önlemleri</li>
                    <li>Tercih ayarları saklama</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Performans Çerezleri</h3>
                  <p className="text-gray-700">
                    Platform performansını izlemek ve iyileştirmek için kullanılır.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>Sayfa yükleme süreleri analizi</li>
                    <li>Kullanım istatistikleri</li>
                    <li>Hata raporlama</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">İşlevsellik Çerezleri</h3>
                  <p className="text-gray-700">
                    Kişiselleştirilmiş deneyim sunmak için kullanılır.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>Dil ve bölge tercihleri</li>
                    <li>Tasarım şablonu seçimleri</li>
                    <li>Özelleştirilmiş dashboard görünümleri</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Çerez Yönetimi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Çerez ayarlarınızı tarayıcınızdan yönetebilirsiniz:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                  <li>Firefox: Seçenekler → Gizlilik ve güvenlik → Çerezler</li>
                  <li>Safari: Tercihler → Gizlilik → Çerezler</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Uyarı:</strong> Zorunlu çerezleri devre dışı bırakmak platform işlevselliğini etkileyebilir.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>İletişim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Çerez politikamız hakkında sorularınız için:
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-gray-600">E-posta: privacy@matbixx.com</p>
                  <p className="text-gray-600">Telefon: 0850 XXX XX XX</p>
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
