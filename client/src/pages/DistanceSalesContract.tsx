
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DistanceSalesContract() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Mesafeli Satış Sözleşmesi</h1>
            <p className="text-lg text-gray-600">MatBixx Profesyonel Baskı Platformu</p>
            <p className="text-sm text-gray-500 mt-2">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Taraflar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Satıcı Bilgileri:</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li><strong>Ünvan:</strong> MatBixx Teknoloji A.Ş.</li>
                    <li><strong>Adres:</strong> [Şirket Adresi]</li>
                    <li><strong>Telefon:</strong> 0850 XXX XX XX</li>
                    <li><strong>E-posta:</strong> info@matbixx.com</li>
                    <li><strong>Mersis No:</strong> [Mersis Numarası]</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Alıcı Bilgileri:</h3>
                  <p className="text-gray-700">
                    Platformumuza kayıt olan ve sipariş veren gerçek/tüzel kişilerdir.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Hizmet Konusu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  MatBixx profesyonel baskı hizmetleri platformu aracılığıyla:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Otomatik tasarım oluşturma hizmetleri (35₺/tasarım)</li>
                  <li>Profesyonel baskı üretimi koordinasyonu</li>
                  <li>500+ üretici firmadan teklif alma hizmeti</li>
                  <li>Kalite kontrol ve teslimat takibi</li>
                  <li>Enterprise seviye proje yönetimi</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Fiyat ve Ödeme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fiyatlandırma:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Tasarım hizmetleri: 35₺ + KDV</li>
                    <li>Üretici firma aylık abonelik: 2999₺ + KDV</li>
                    <li>Baskı maliyetleri: Seçilen üreticiye göre değişken</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ödeme Yöntemleri:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Kredi kartı (güvenli 3D ödeme)</li>
                    <li>Havale/EFT</li>
                    <li>Kurumsal fatura sistemi</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Teslimat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Teslimat süreleri ürün türüne göre değişiklik gösterir:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Kartvizit: 24-48 saat</li>
                  <li>Broşür/Katalog: 3-5 iş günü</li>
                  <li>Ambalaj çözümleri: 5-7 iş günü</li>
                  <li>Özel projeler: Proje bazında belirlenir</li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 text-sm">
                    Teslimat, seçilen üretici firma tarafından gerçekleştirilir ve takip numarası ile izlenebilir.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Cayma Hakkı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Teslim tarihinden itibaren 14 gün içinde cayma hakkı mevcuttur</li>
                  <li>Özel tasarım ürünlerde cayma hakkı uygulanmaz</li>
                  <li>Dijital tasarım hizmetleri için cayma süresi 24 saattir</li>
                  <li>Üretimi başlamış ürünlerde cayma hakkı uygulanmaz</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Önemli:</strong> Cayma bildiriminin yazılı olarak iletilmesi gerekmektedir.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Sorumluluk ve Garanti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">MatBixx Sorumlulukları:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Platform güvenliği ve kesintisiz hizmet</li>
                    <li>Kaliteli tasarım çıktıları</li>
                    <li>Üretici firma kalite kontrolü</li>
                    <li>Müşteri verilerinin güvenliği</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Garanti Kapsamı:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Tasarım kalitesi garantisi</li>
                    <li>Üretici firma ISO 9001 kalite standardı</li>
                    <li>Tam sigorta koruması</li>
                    <li>%100 memnuniyet garantisi</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Uyuşmazlık Çözümü</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Bu sözleşmeden doğan uyuşmazlıklarda:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>İstanbul Mahkemeleri ve İcra Müdürlükleri yetkilidir</li>
                  <li>Tüketici hakem heyetlerine başvuru mümkündür</li>
                  <li>Arabuluculuk yöntemi tercih edilebilir</li>
                </ul>
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
