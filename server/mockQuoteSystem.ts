import { WebSocketServer } from 'ws';

interface MockQuote {
  id: string;
  title: string;
  type: string;
  location: string;
  amount: string;
  status: string;
  time: string;
  estimatedBudget: number;
  quantity?: number;
  isGenerated: boolean;
  category?: string;
  companyName: string;
  description: string;
  deadline: string;
  urgency: 'normal' | 'urgent' | 'express';
  specifications: Record<string, any>;
  createdAt: Date;
}

interface MockPrinterResponse {
  id: string;
  quoteId: string;
  printerName: string;
  companyName: string;
  price: string;
  estimatedDays: number;
  notes: string;
  rating: number;
  totalRatings: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

class MockQuoteSystem {
  private activeQuotes: MockQuote[] = [];
  private printerResponses: MockPrinterResponse[] = [];
  private broadcastInterval: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private wss: WebSocketServer | null = null;

  private mockCompanies = [
    'Anadolu Pazarlama A.Ş.',
    'Metro Gıda Sanayi',
    'Elite Kozmetik A.Ş.',
    'Türk Telekom A.Ş.',
    'Garanti BBVA Bankası',
    'Akbank T.A.Ş.',
    'Migros Ticaret A.Ş.',
    'CarrefourSA',
    'Teknosa İç ve Dış Ticaret A.Ş.',
    'Vatan Bilgisayar',
    'MediaMarkt Satış Mağazacılığı A.Ş.',
    'LC Waikiki Mağazacılık Hizmetleri Ticaret A.Ş.',
    'Koton Mağazacılık Tekstil Sanayi ve Ticaret A.Ş.',
    'Defacto Perakende A.Ş.',
    'Boyner Büyük Mağazacılık A.Ş.',
    'Mavi Giyim Sanayi ve Ticaret A.Ş.',
    'Eczacıbaşı Holding A.Ş.',
    'Borusan Holding',
    'Sabancı Holding',
    'Koç Holding A.Ş.',
    'Arçelik A.Ş.',
    'Vestel Elektronik',
    'Beko Global',
    'Ford Otosan',
    'Tofaş Türk Otomobil Fabrikası A.Ş.',
    'Renault Turkey',
    'Hyundai Assan Otomotiv',
    'MNG Kargo',
    'Yurtiçi Kargo',
    'PTT Kargo',
    'Aras Kargo',
    'Sürat Kargo',
    'UPS Turkey',
    'DHL Express Turkey',
    'FedEx Turkey',
    'Coca-Cola İçecek A.Ş.',
    'Efes Beverage Group',
    'Ülker Bisküvi Sanayi A.Ş.',
    'ETİ Gıda Sanayi ve Ticaret A.Ş.',
    'Nestlé Türkiye',
    'Unilever Türkiye',
    'P&G Turkey',
    'L\'Oréal Türkiye',
    'Henkel Türkiye',
    'Johnson & Johnson Turkey',
    'Roche Türkiye',
    'Pfizer Türkiye',
    'Novartis Türkiye',
    'Bayer Türkiye',
    'Siemens Turkey',
    'General Electric Turkey',
    'Schneider Electric Turkey',
    'ABB Turkey',
    'Honeywell Turkey'
  ];

  private mockPrinters = [
    { name: 'Premium Print House', company: 'Premium Matbaa Ltd.', rating: 4.8 },
    { name: 'Digital Print Pro', company: 'Digital Pro Basım', rating: 4.6 },
    { name: 'Offset Master', company: 'Master Ofset Matbaacılık', rating: 4.7 },
    { name: 'Quality Print', company: 'Kalite Baskı Merkezi', rating: 4.5 },
    { name: 'Express Print', company: 'Hızlı Baskı Hizmetleri', rating: 4.4 },
    { name: 'Professional Print', company: 'Profesyonel Matbaa', rating: 4.9 },
    { name: 'Modern Print Tech', company: 'Modern Baskı Teknolojileri', rating: 4.3 },
    { name: 'Elite Printing', company: 'Elite Matbaacılık A.Ş.', rating: 4.8 },
    { name: 'Creative Print Solutions', company: 'Kreatif Baskı Çözümleri', rating: 4.6 },
    { name: 'Industrial Print Group', company: 'Endüstriyel Baskı Grubu', rating: 4.7 }
  ];

  private cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 
    'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır',
    'Kayseri', 'Eskişehir', 'Urfa', 'Malatya', 'Erzurum',
    'Van', 'Batman', 'Elazığ', 'Tekirdağ', 'Sakarya'
  ];

  private quoteTypes = [
    {
      type: 'Kurumsal Kimlik Projesi',
      categories: ['Kartvizit', 'Antetli Kağıt', 'Zarf', 'Dosya', 'Katalog'],
      budgetRange: [15000, 75000],
      quantityRange: [1000, 50000]
    },
    {
      type: 'Ambalaj Baskısı',
      categories: ['Gıda Ambalajı', 'Kozmetik Kutusu', 'İlaç Ambalajı', 'Elektronik Kutusu'],
      budgetRange: [25000, 150000],
      quantityRange: [5000, 200000]
    },
    {
      type: 'Etiket Üretimi',
      categories: ['Ürün Etiketi', 'Barkod Etiketi', 'Güvenlik Etiketi', 'Şeffaf Etiket'],
      budgetRange: [8000, 85000],
      quantityRange: [10000, 500000]
    },
    {
      type: 'Promosyon Malzemeleri',
      categories: ['Broşür', 'Katalog', 'Poster', 'Banner', 'Roll-up'],
      budgetRange: [5000, 45000],
      quantityRange: [500, 25000]
    },
    {
      type: 'Medikal Baskı',
      categories: ['Reçete Bloğu', 'Hasta Dosyası', 'Medikal Etiket', 'Sterilizasyon Çantası'],
      budgetRange: [12000, 95000],
      quantityRange: [2000, 100000]
    },
    {
      type: 'Güvenlik Baskısı',
      categories: ['Sertifika', 'Diploma', 'Bilet', 'Hologram Etiket'],
      budgetRange: [20000, 120000],
      quantityRange: [1000, 75000]
    },
    {
      type: 'Tekstil Baskısı',
      categories: ['T-shirt', 'Sweatshirt', 'Çanta', 'Şapka', 'Forma'],
      budgetRange: [10000, 60000],
      quantityRange: [500, 15000]
    },
    {
      type: 'Dijital Baskı',
      categories: ['Fotoğraf Baskısı', 'Canvas', 'PVC Banner', 'Vinil Çıkartma'],
      budgetRange: [3000, 35000],
      quantityRange: [100, 10000]
    }
  ];

  initialize(wss: WebSocketServer) {
    this.wss = wss;
    this.startBroadcastCycle();
    this.startCleanupCycle();
    console.log('✅ Mock Quote System initialized');
  }

  private startBroadcastCycle() {
    // Broadcast 5 new quotes every 5 minutes
    this.broadcastInterval = setInterval(() => {
      this.generateAndBroadcastQuotes();
    }, 5 * 60 * 1000); // 5 minutes

    // Initial broadcast
    this.generateAndBroadcastQuotes();
  }

  private startCleanupCycle() {
    // Clean up old quotes every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldQuotes();
    }, 60 * 60 * 1000); // 1 hour
  }

  private generateAndBroadcastQuotes() {
    const newQuotes: MockQuote[] = [];
    
    for (let i = 0; i < 5; i++) {
      const quote = this.generateMockQuote();
      newQuotes.push(quote);
      this.activeQuotes.push(quote);
    }

    // Broadcast to all connected clients
    if (this.wss) {
      this.wss.clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify({
            type: 'mock_quotes_update',
            quotes: newQuotes,
            totalActive: this.activeQuotes.length
          }));
        }
      });
    }

    console.log(`📢 Broadcasting ${newQuotes.length} new mock quotes. Total active: ${this.activeQuotes.length}`);
  }

  private generateMockQuote(): MockQuote {
    const quoteType = this.quoteTypes[Math.floor(Math.random() * this.quoteTypes.length)];
    const category = quoteType.categories[Math.floor(Math.random() * quoteType.categories.length)];
    const company = this.mockCompanies[Math.floor(Math.random() * this.mockCompanies.length)];
    const city = this.cities[Math.floor(Math.random() * this.cities.length)];
    
    const quantity = Math.floor(Math.random() * (quoteType.quantityRange[1] - quoteType.quantityRange[0])) + quoteType.quantityRange[0];
    const budget = Math.floor(Math.random() * (quoteType.budgetRange[1] - quoteType.budgetRange[0])) + quoteType.budgetRange[0];
    
    const urgency = Math.random() > 0.8 ? 'urgent' : Math.random() > 0.9 ? 'express' : 'normal';
    
    const statuses = ['Teklif Aşamasında', 'Değerlendirmede', 'Üretim Hazırlık', 'Onay Bekliyor'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const id = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create realistic deadline (3-30 days from now)
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + Math.floor(Math.random() * 28) + 3);

    return {
      id,
      title: `${category} - ${company}`,
      type: quoteType.type,
      location: city,
      amount: `₺${budget.toLocaleString('tr-TR')}`,
      status,
      time: `${Math.floor(Math.random() * 60) + 1} dk önce`,
      estimatedBudget: budget,
      quantity,
      isGenerated: true,
      category: category.toLowerCase(),
      companyName: company,
      description: this.generateQuoteDescription(category, quantity, company),
      deadline: deadline.toISOString(),
      urgency,
      specifications: this.generateSpecifications(category, quantity),
      createdAt: new Date()
    };
  }

  private generateQuoteDescription(category: string, quantity: number, company: string): string {
    const descriptions = {
      'Kartvizit': `${company} için ${quantity.toLocaleString('tr-TR')} adet premium kartvizit baskısı. Mat/parlak seçenekleri ile özel tasarım.`,
      'Antetli Kağıt': `${company} kurumsal kimliği için ${quantity.toLocaleString('tr-TR')} adet antetli kağıt üretimi.`,
      'Gıda Ambalajı': `${company} ürün serisi için ${quantity.toLocaleString('tr-TR')} adet food-grade ambalaj baskısı.`,
      'Kozmetik Kutusu': `${company} kozmetik ürünleri için ${quantity.toLocaleString('tr-TR')} adet özel tasarım kutu üretimi.`,
      'Ürün Etiketi': `${company} ürün gamı için ${quantity.toLocaleString('tr-TR')} adet çok renkli etiket baskısı.`,
      'Broşür': `${company} tanıtım kampanyası için ${quantity.toLocaleString('tr-TR')} adet çift taraflı broşür.`,
      'T-shirt': `${company} kurumsal etkinliği için ${quantity.toLocaleString('tr-TR')} adet %100 pamuk t-shirt baskısı.`
    };
    
    return descriptions[category as keyof typeof descriptions] || 
           `${company} için ${quantity.toLocaleString('tr-TR')} adet ${category} üretimi.`;
  }

  private generateSpecifications(category: string, quantity: number): Record<string, any> {
    const baseSpecs = {
      quantity,
      deadline: '15-30 gün',
      printType: 'Offset/Dijital',
      quality: 'Premium'
    };

    const categorySpecs: Record<string, any> = {
      'Kartvizit': {
        ...baseSpecs,
        size: '90x50mm',
        material: '350gr kuşe kağıt',
        finishing: 'Mat/Parlak selofan',
        colors: '4+4 renkli'
      },
      'Gıda Ambalajı': {
        ...baseSpecs,
        material: 'Food-grade karton',
        certification: 'CE, FDA onaylı',
        colors: '6+2 renkli',
        finishing: 'UV varnish'
      },
      'Ürün Etiketi': {
        ...baseSpecs,
        material: 'Yapışkanlı vinil',
        waterproof: true,
        colors: '4+0 renkli',
        cutting: 'Kontur kesim'
      }
    };

    return categorySpecs[category] || baseSpecs;
  }

  private cleanupOldQuotes() {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const beforeCount = this.activeQuotes.length;
    this.activeQuotes = this.activeQuotes.filter(quote => quote.createdAt > oneHourAgo);
    const afterCount = this.activeQuotes.length;
    
    console.log(`🧹 Cleaned up ${beforeCount - afterCount} old mock quotes. Remaining: ${afterCount}`);
  }

  // Method for printers to submit quotes to mock requests
  submitMockQuote(mockQuoteId: string, printerData: {
    printerId: string;
    printerName: string;
    companyName: string;
    price: number;
    estimatedDays: number;
    notes: string;
    rating: number;
    totalRatings: number;
  }): MockPrinterResponse {
    const mockQuote = this.activeQuotes.find(q => q.id === mockQuoteId);
    if (!mockQuote) {
      throw new Error('Mock quote not found');
    }

    const response: MockPrinterResponse = {
      id: `mock_resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      quoteId: mockQuoteId,
      printerName: printerData.printerName,
      companyName: printerData.companyName,
      price: `₺${printerData.price.toLocaleString('tr-TR')}`,
      estimatedDays: printerData.estimatedDays,
      notes: printerData.notes,
      rating: printerData.rating,
      totalRatings: printerData.totalRatings,
      status: 'pending',
      createdAt: new Date()
    };

    this.printerResponses.push(response);
    
    console.log(`📋 Mock quote response submitted: ${printerData.companyName} -> ${mockQuoteId}`);
    return response;
  }

  getMockQuotes(): MockQuote[] {
    return [...this.activeQuotes].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getMockQuoteById(id: string): MockQuote | undefined {
    return this.activeQuotes.find(q => q.id === id);
  }

  getMockQuoteResponses(mockQuoteId: string): MockPrinterResponse[] {
    return this.printerResponses.filter(r => r.quoteId === mockQuoteId);
  }

  generatePrinterQuotesForMock(mockQuoteId: string): MockPrinterResponse[] {
    const mockQuote = this.activeQuotes.find(q => q.id === mockQuoteId);
    if (!mockQuote) return [];

    // Generate 2-4 mock printer responses
    const responseCount = Math.floor(Math.random() * 3) + 2;
    const responses: MockPrinterResponse[] = [];

    for (let i = 0; i < responseCount; i++) {
      const printer = this.mockPrinters[Math.floor(Math.random() * this.mockPrinters.length)];
      const basePrice = mockQuote.estimatedBudget;
      const priceVariation = 0.7 + (Math.random() * 0.6); // 70% to 130% of estimated
      const finalPrice = Math.floor(basePrice * priceVariation);
      
      const response: MockPrinterResponse = {
        id: `mock_resp_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 6)}`,
        quoteId: mockQuoteId,
        printerName: printer.name,
        companyName: printer.company,
        price: `₺${finalPrice.toLocaleString('tr-TR')}`,
        estimatedDays: Math.floor(Math.random() * 15) + 5, // 5-20 days
        notes: this.generatePrinterNotes(mockQuote.type),
        rating: printer.rating,
        totalRatings: Math.floor(Math.random() * 200) + 50,
        status: 'pending',
        createdAt: new Date()
      };

      responses.push(response);
      this.printerResponses.push(response);
    }

    return responses;
  }

  private generatePrinterNotes(quoteType: string): string {
    const notes = [
      'Premium kalitede üretim garantisi. Sertifikalı malzemeler kullanılacaktır.',
      'Hızlı teslimat imkanı mevcut. Kalite kontrolden geçmiş ürünler.',
      'Toplu sipariş indirimi uygulanacaktır. Numune öncesi hazırlanabilir.',
      'Özel tasarım desteği dahil. Revizyon hakkı bulunmaktadır.',
      'Kurumsal referanslarımız mevcuttur. Garanti süresi dahilinde.',
      'Eco-friendly malzemeler tercih edilmektedir. Çevre dostu üretim.',
      'Express üretim imkanı mevcut. 7/24 müşteri desteği.',
      'Özel ambalajlama seçenekleri sunulabilir. Kargo dahil fiyat.'
    ];
    
    return notes[Math.floor(Math.random() * notes.length)];
  }

  stop() {
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
      this.broadcastInterval = null;
    }
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    console.log('🛑 Mock Quote System stopped');
  }
}

export const mockQuoteSystem = new MockQuoteSystem();