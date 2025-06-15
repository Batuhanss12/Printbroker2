
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Truck, Clock, MapPin, Package, Shield, Star } from "lucide-react";

export default function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Kargo ve Teslimat</h1>
            <p className="text-lg text-gray-600">MatBixx Profesyonel Baskı Platformu</p>
            <Badge className="bg-blue-100 text-blue-800 mt-2">Hızlı ve Güvenli Teslimat</Badge>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Teslimat Süreleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Express Ürünler</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Kartvizit</span>
                        <Badge variant="outline">24-48 saat</Badge>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Etiket & Sticker</span>
                        <Badge variant="outline">24-72 saat</Badge>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Antetli Kağıt</span>
                        <Badge variant="outline">2-3 iş günü</Badge>
                      </li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Standart Ürünler</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Broşür & Katalog</span>
                        <Badge variant="outline">3-5 iş günü</Badge>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Ambalaj Kutu</span>
                        <Badge variant="outline">5-7 iş günü</Badge>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Banner & Tabela</span>
                        <Badge variant="outline">2-5 iş günü</Badge>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Not:</strong> Teslimat süreleri üretici firma onayından sonra başlar. 
                    Özel tasarım ürünlerde ek 1-2 iş günü süre eklenebilir.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Teslimat Bölgeleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Türkiye Geneli</h3>
                    <p className="text-sm text-gray-600">Tüm il ve ilçelere teslimat</p>
                    <Badge className="bg-green-100 text-green-800 mt-2">Ücretsiz Kargo</Badge>
                  </div>
                  <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Avrupa</h3>
                    <p className="text-sm text-gray-600">AB ülkeleri</p>
                    <Badge variant="outline" className="mt-2">Özel Fiyat</Badge>
                  </div>
                  <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Dünya Geneli</h3>
                    <p className="text-sm text-gray-600">Express teslimat</p>
                    <Badge variant="outline" className="mt-2">Talep Üzerine</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Kargo Firmaları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  MatBixx güvenilir kargo ortakları ile çalışarak ürünlerinizin güvenli teslimatını sağlar:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-sm font-medium">Yurtiçi Kargo</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">MNG Kargo</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium">Aras Kargo</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="h-6 w-6 text-yellow-600" />
                    </div>
                    <p className="text-sm font-medium">UPS</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Kargo Seçim Kriterleri:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    <li>En hızlı teslimat süresi</li>
                    <li>Ürün türüne uygun paketleme</li>
                    <li>Güvenli takip sistemi</li>
                    <li>En uygun maliyet</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Paketleme ve Koruma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Koruyucu Paketleme</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Özel kalınlıkta karton kutular</li>
                      <li>Bubble wrap koruma</li>
                      <li>Su geçirmez plastik kılıf</li>
                      <li>Köşe koruyucular</li>
                      <li>Darbe emici malzemeler</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Özel Ürün Paketleme</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Banner ve tabelalar için rulo koruma</li>
                      <li>Kartvizitler için özel kutular</li>
                      <li>Kataloglar için sert karton</li>
                      <li>Hassas ürünler için özel köpük</li>
                      <li>Çevre dostu ambalaj malzemeleri</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Takip ve Bilgilendirme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Otomatik Bilgilendirme Sistemi</h3>
                  <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                    <li>Sipariş onayı (E-posta + SMS)</li>
                    <li>Üretim başlangıcı bildirimi</li>
                    <li>Kargo çıkış bildirimi</li>
                    <li>Teslimat öncesi hatırlatma</li>
                    <li>Teslimat teyidi</li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Gerçek Zamanlı Takip</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Platform üzerinden anlık olarak siparişinizin durumunu takip edebilirsiniz.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs">
                      <li>Hazırlanıyor</li>
                      <li>Üretimde</li>
                      <li>Kalite kontrolde</li>
                      <li>Kargoya verildi</li>
                      <li>Teslim edildi</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Kargo Takip Numarası</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Kargo çıkışı ile birlikte takip numaranız iletilir.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs">
                      <li>SMS ile anında bildirim</li>
                      <li>E-posta ile detaylı bilgi</li>
                      <li>Platform üzerinde görüntüleme</li>
                      <li>Kargo firması sitesinde takip</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kargo Ücretleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">🎉 Ücretsiz Kargo Koşulları</h3>
                  <ul className="list-disc list-inside text-green-800 space-y-1 text-sm">
                    <li>499₺ ve üzeri siparişlerde Türkiye geneli ücretsiz</li>
                    <li>Kurumsal müşteriler için tüm siparişlerde ücretsiz</li>
                    <li>Express ürünlerde 100₺ ve üzeri ücretsiz</li>
                  </ul>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 border-b">Bölge</th>
                        <th className="text-left p-3 border-b">Süre</th>
                        <th className="text-left p-3 border-b">Ücret</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border-b">İstanbul</td>
                        <td className="p-3 border-b">1-2 iş günü</td>
                        <td className="p-3 border-b">15₺</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-b">Marmara Bölgesi</td>
                        <td className="p-3 border-b">1-3 iş günü</td>
                        <td className="p-3 border-b">18₺</td>
                      </tr>
                      <tr>
                        <td className="p-3 border-b">Diğer İller</td>
                        <td className="p-3 border-b">2-4 iş günü</td>
                        <td className="p-3 border-b">25₺</td>
                      </tr>
                      <tr>
                        <td className="p-3">Express Teslimat</td>
                        <td className="p-3">Ertesi gün</td>
                        <td className="p-3">45₺</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sorun Çözümleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Hasarlı Teslimat</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Ürününüz hasarlı ulaştıysa hemen bildirin:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs">
                      <li>48 saat içinde fotoğraflı bildirim</li>
                      <li>Yeni ürün ücretsiz gönderilir</li>
                      <li>Hasarlı ürün iade edilir</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Kayıp Kargo</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Kargonuz kayboldu mu? Endişelenmeyin:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs">
                      <li>7 gün araştırma süreci</li>
                      <li>Bulunamayan ürün yeniden üretilir</li>
                      <li>Tüm masraflar MatBixx'e aittir</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    <strong>7/24 Kargo Destek:</strong> kargo@matbixx.com veya 0850 XXX XX XX
                  </p>
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
