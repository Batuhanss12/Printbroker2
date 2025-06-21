import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/Navigation";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  LayoutGrid, 
  Disc, 
  Printer,
  AlertCircle,
  ArrowLeft,
  Send,
  Upload,
  Calculator,
  Palette,
  CheckCircle,
  Target,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { Loader2, FileText, Package } from "lucide-react";

// Form field configurations
const getFormFieldsByType = (type: string) => {
  const commonFields = {
    quantity: { type: 'number', required: true, label: 'Miktar (Adet)' },
    description: { type: 'textarea', required: false, label: 'Açıklama' },
    deadline: { type: 'date', required: false, label: 'Termin Tarihi' },
    budget: { type: 'number', required: false, label: 'Bütçe (₺)' }
  };

  const typeSpecificFields = {
    sheet_label: {
      paperType: { 
        type: 'select', 
        options: [
          { value: 'kuse', label: 'Kuşe Kağıt' },
          { value: 'mat', label: 'Mat Kuşe' },
          { value: 'parlak', label: 'Parlak Kuşe' },
          { value: 'bristol', label: 'Bristol' }
        ], 
        label: 'Kağıt Türü' 
      },
      size: { 
        type: 'select', 
        options: [
          { value: 'a4', label: 'A4 (210x297mm)' },
          { value: 'a3', label: 'A3 (297x420mm)' },
          { value: 'custom', label: 'Özel Boyut' }
        ], 
        label: 'Boyut' 
      },
      customWidth: { type: 'number', label: 'Genişlik (mm)', condition: 'size', conditionValue: 'custom' },
      customHeight: { type: 'number', label: 'Yükseklik (mm)', condition: 'size', conditionValue: 'custom' },
      adhesiveType: { 
        type: 'select', 
        options: [
          { value: 'permanent', label: 'Kalıcı Yapışkan' },
          { value: 'removable', label: 'Çıkarılabilir' },
          { value: 'freezer', label: 'Dondurucu Yapışkan' }
        ], 
        label: 'Yapışkan Türü' 
      },
      printType: { 
        type: 'select', 
        options: [
          { value: 'digital', label: 'Dijital Baskı' },
          { value: 'offset', label: 'Offset Baskı' }
        ], 
        label: 'Baskı Türü' 
      },
      finishType: { 
        type: 'select', 
        options: [
          { value: 'matte', label: 'Mat Selefon' },
          { value: 'glossy', label: 'Parlak Selefon' },
          { value: 'none', label: 'Yüzey İşlemi Yok' }
        ], 
        label: 'Yüzey İşlemi' 
      }
    },
    roll_label: {
      material: { 
        type: 'select', 
        options: [
          { value: 'pp-white', label: 'PP Beyaz' },
          { value: 'pp-transparent', label: 'PP Şeffaf' },
          { value: 'pe-white', label: 'PE Beyaz' },
          { value: 'thermal', label: 'Termal Kağıt' }
        ], 
        label: 'Malzeme' 
      },
      rollWidth: { type: 'number', label: 'Rulo Genişlik (mm)' },
      rollLength: { type: 'number', label: 'Rulo Uzunluk (m)' },
      coreSize: { 
        type: 'select', 
        options: [
          { value: '25', label: '25mm Makara' },
          { value: '40', label: '40mm Makara' },
          { value: '76', label: '76mm Makara' }
        ], 
        label: 'Makara Çapı' 
      },
      labelType: { 
        type: 'select', 
        options: [
          { value: 'thermal-direct', label: 'Termal Direkt' },
          { value: 'thermal-transfer', label: 'Termal Transfer' },
          { value: 'inkjet', label: 'Inkjet' }
        ], 
        label: 'Etiket Türü' 
      },
      adhesiveType: { 
        type: 'select', 
        options: [
          { value: 'permanent', label: 'Kalıcı Yapışkan' },
          { value: 'removable', label: 'Çıkarılabilir' },
          { value: 'freezer', label: 'Dondurucu Yapışkan' }
        ], 
        label: 'Yapışkan Türü' 
      },
      windingDirection: { 
        type: 'select', 
        options: [
          { value: 'in', label: 'İçe Sarım' },
          { value: 'out', label: 'Dışa Sarım' }
        ], 
        label: 'Sarım Yönü' 
      },
      perforationGap: { 
        type: 'select', 
        options: [
          { value: '3', label: '3mm Perfore' },
          { value: '5', label: '5mm Perfore' },
          { value: 'custom', label: 'Özel Perfore' }
        ], 
        label: 'Perfore Aralığı' 
      }
    },
    general_printing: {
      printType: { 
        type: 'select', 
        options: [
          { value: 'poster', label: 'Poster' },
          { value: 'banner', label: 'Banner' },
          { value: 'brochure', label: 'Broşür' },
          { value: 'business_card', label: 'Kartvizit' },
          { value: 'catalog', label: 'Katalog' },
          { value: 'magazine', label: 'Dergi' },
          { value: 'book', label: 'Kitap' }
        ], 
        label: 'Baskı Türü' 
      },
      printSize: { 
        type: 'select', 
        options: [
          { value: 'a4', label: 'A4' },
          { value: 'a3', label: 'A3' },
          { value: 'a2', label: 'A2' },
          { value: 'a1', label: 'A1' },
          { value: 'custom', label: 'Özel Boyut' }
        ], 
        label: 'Boyut' 
      },
      printPaper: { 
        type: 'select', 
        options: [
          { value: 'kuse', label: 'Kuşe Kağıt' },
          { value: 'bristol', label: 'Bristol' },
          { value: 'kraft', label: 'Kraft Kağıt' },
          { value: 'vinyl', label: 'Vinil' }
        ], 
        label: 'Kağıt Türü' 
      },
      printColor: { 
        type: 'select', 
        options: [
          { value: 'cmyk', label: 'CMYK (4 Renk)' },
          { value: 'pantone', label: 'Pantone Renk' },
          { value: 'black', label: 'Siyah Beyaz' }
        ], 
        label: 'Renk Seçeneği' 
      },
      printQuantity: { 
        type: 'select', 
        options: [
          { value: '100', label: '100 Adet' },
          { value: '500', label: '500 Adet' },
          { value: '1000', label: '1000 Adet' },
          { value: '5000', label: '5000 Adet' },
          { value: 'custom', label: 'Özel Miktar' }
        ], 
        label: 'Miktar' 
      },
      foilType: { 
        type: 'select', 
        options: [
          { value: 'none', label: 'Yaldız Yok' },
          { value: 'gold', label: 'Altın Yaldız' },
          { value: 'silver', label: 'Gümüş Yaldız' }
        ], 
        label: 'Yaldız Türü' 
      }
    }
  };

  return {
    ...commonFields,
    ...(typeSpecificFields[type as keyof typeof typeSpecificFields] || {})
  };
};

const quoteSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  type: z.enum(["sheet_label", "roll_label", "general_printing"]),
  specifications: z.object({
    quantity: z.number().min(1, "Miktar en az 1 olmalı"),
    material: z.string().min(1, "Malzeme seçimi gerekli"),
    size: z.string().min(1, "Boyut bilgisi gerekli"),
    color: z.string().optional(),
    description: z.string().min(10, "En az 10 karakter açıklama gerekli")
  }),
  contactInfo: z.object({
    companyName: z.string().min(1, "Firma adı gerekli"),
    contactName: z.string().min(1, "Yetkili kişi adı gerekli"),
    email: z.string().email("Geçerli e-posta adresi gerekli"),
    phone: z.string().optional()
  }),
  description: z.string().optional(),
  deadline: z.string().optional(),
  budget: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

function getQuoteTypeDisplay(type: string): string {
  switch (type) {
    case 'sheet_label':
      return 'Tabaka Etiket';
    case 'roll_label':
      return 'Rulo Etiket';
    case 'general_printing':
      return 'Genel Baskı';
    default:
      return 'Teklif';
  }
}

export default function QuoteForm() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { type } = useParams();
  const queryClient = useQueryClient();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("details");
  const [designPrompt, setDesignPrompt] = useState("");
  const [generatedDesigns, setGeneratedDesigns] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      title: "",
      type: (type as any) || "sheet_label",
      specifications: {
        quantity: 1000,
        material: "",
        size: "",
        color: "",
        description: ""
      },
      contactInfo: {
        companyName: "",
        contactName: "",
        email: "",
        phone: ""
      },
      description: "",
      deadline: "",
      budget: "",
    },
    mode: "onChange", // Only validate on change, don't submit
  });

  const mutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      console.log("📤 Submitting quote with data:", data);

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      console.log("📡 Response status:", response.status);
      const result = await response.json();
      console.log("📋 Response data:", result);

      if (!response.ok) {
        const errorMessage = result.message || `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      if (result.success === false) {
        throw new Error(result.message || "Teklif oluşturulamadı");
      }

      return result;
    },
    onMutate: () => {
      // Set submitting state when mutation starts
      setIsSubmitting(true);
    },
    onSuccess: (result) => {
      console.log("Quote creation successful:", result);
      setIsSubmitting(false);

      toast({
        title: "Başarılı!",
        description: "Teklif talebiniz başarıyla gönderildi. Matbaa firmalarından yanıt bekleniyor.",
      });

      // Reset form state
      form.reset();
      setUploadedFiles([]);
      setGeneratedDesigns([]);
      setCurrentTab("details");

      // Refresh quotes data
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });

      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = "/customer-dashboard";
      }, 2000);
    },
    onError: (error) => {
      console.error("Quote submission error:", error);
      setIsSubmitting(false);

      if (isUnauthorizedError(error)) {
        toast({
          title: "Oturum Süresi Doldu",
          description: "Lütfen tekrar giriş yapın",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/?login=true";
        }, 1000);
      } else {
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Teklif gönderilirken hata oluştu",
          variant: "destructive",
        });
      }
    },
  });

const onSubmit = async (data: QuoteFormData, isExplicitSubmit: boolean = false) => {
    console.log("Form submitted with data:", data, "Explicit submit:", isExplicitSubmit);

    // Prevent automatic submissions - only allow explicit button clicks
    if (!isExplicitSubmit) {
      console.log("🚫 Blocking automatic form submission");
      return;
    }

    // Prevent duplicate submissions
    if (isSubmitting || mutation.isPending) {
      console.log("🚫 Preventing duplicate submission");
      return;
    }

    // Allow submission from any tab for explicit submissions
    console.log("✅ Proceeding with explicit form submission from tab:", currentTab);

    // Additional check to ensure this is an intentional submission
    if (!data.title || !data.contactInfo?.companyName || !data.contactInfo?.email) {
      console.log("🚫 Form not ready for submission - missing required fields");
      toast({
        title: "Form Eksik",
        description: "Lütfen tüm gerekli alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    console.log("✅ Form validation passed, proceeding with submission");
    setIsSubmitting(true);

    try {
      // Enhanced validation
      if (!data.title?.trim()) {
        throw new Error("Başlık alanı boş olamaz");
      }

      if (!data.contactInfo?.companyName?.trim()) {
        throw new Error("Firma adı boş olamaz");
      }

      if (!data.contactInfo?.contactName?.trim()) {
        throw new Error("İletişim kişisi adı boş olamaz");
      }

      if (!data.contactInfo?.email?.trim()) {
        throw new Error("E-posta adresi boş olamaz");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.contactInfo.email.trim())) {
        throw new Error("Geçerli bir e-posta adresi girin");
      }

      // Enhanced quote data structure for backend compatibility - ensure numeric values
      const quantityValue = data.specifications?.quantity || 1000;
      const quantity = typeof quantityValue === 'number' ? Math.max(1, quantityValue) : Math.max(1, parseInt(quantityValue?.toString() || '1000') || 1000);

      // Process budget safely - send null if empty or invalid
      let estimatedBudget = null;
      if (data.budget && data.budget.toString().trim() !== '' && data.budget.toString().trim() !== 'undefined') {
        const budgetNum = parseFloat(data.budget.toString().trim());
        if (!isNaN(budgetNum) && budgetNum > 0) {
          estimatedBudget = budgetNum;
        }
      }

      // Ensure quantity is always a valid number
      const safeQuantity = isNaN(quantity) ? 1000 : Math.max(1, quantity);

      const submissionData = {
        title: data.title.trim(),
        type: data.type || 'general_printing',
        quantity: safeQuantity,
        estimatedBudget: estimatedBudget,
        specifications: {
          quantity: safeQuantity,
          material: data.specifications?.material?.trim() || 'Standart',
          size: data.specifications?.size?.trim() || 'A4',
          color: data.specifications?.color?.trim() || 'CMYK',
          description: data.specifications?.description?.trim() || '',
          uploadedFiles: uploadedFiles || []
        },
        description: data.description?.trim() || '',
        deadline: data.deadline || null,
        contactInfo: {
          companyName: data.contactInfo.companyName.trim(),
          contactName: data.contactInfo.contactName.trim(),
          email: data.contactInfo.email.trim().toLowerCase(),
          phone: data.contactInfo?.phone?.trim() || ""
        },
        files: uploadedFiles || [],
        generatedDesigns: (generatedDesigns || []).map(design => ({
          id: design.id || crypto.randomUUID(),
          url: design.url || design.result?.url || design.result?.[0]?.url || '',
          prompt: design.prompt || ''
        }))
      };

      console.log("Processed quote data for submission:", submissionData);
      mutation.mutate(submissionData);

    } catch (error) {
      console.error("Form validation error:", error);
      setIsSubmitting(false);
      toast({
        title: "Form Hatası",
        description: error instanceof Error ? error.message : "Form verilerinde hata var",
        variant: "destructive",
      });
    }
  };



  // AI Design Functions
  const handleGenerateDesign = async () => {
    if (!designPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await apiRequest(`/api/design/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: designPrompt,
          options: {
            aspectRatio: "ASPECT_1_1",
            model: "V_2",
            styleType: "AUTO"
          }
        }),
      });

      if (response.data) {
        setGeneratedDesigns(prev => [...prev, ...response.data]);
        toast({
          title: "Tasarım Oluşturuldu",
          description: "AI tasarımınız başarıyla oluşturuldu!",
        });
      }
    } catch (error: any) {
      if (error.message.includes("401") || error.message.includes("403")) {
        setHasApiKey(false);
        toast({
          title: "API Anahtarı Gerekli",
          description: "AI tasarım özelliği için API anahtarı yapılandırılmalıdır.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Hata",
          description: "Tasarım oluşturulurken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseDesign = (design: any) => {
    // Add design to uploaded files as a design file
    const designFile = `design_${Date.now()}.png`;
    setUploadedFiles(prev => [...prev, designFile]);

    toast({
      title: "Tasarım Eklendi",
      description: "Tasarım dosyalara eklendi ve teklif ile birlikte gönderilecek.",
    });
  };

  const handleFileUpload = (fileId: string) => {
    setUploadedFiles(prev => [...prev, fileId]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Üyelik Gerekli</h2>
              <p className="text-gray-600 mb-4">
                Teklif almak için önce üye olmanız gerekiyor. Müşteri kaydı sadece 35₺/tasarım ile başlayın!
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = "/customer-register"}
                >
                  Müşteri Kaydı (35₺/tasarım)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = "/printer-register"}
                >
                  Üretici Kaydı (2999₺/ay)
                </Button>
                <div className="text-center text-sm text-gray-500">
                  Zaten üye misiniz?{" "}
                  <button 
                    className="text-blue-600 hover:underline"
                    onClick={() => window.location.href = "/customer-dashboard"}
                  >
                    Giriş yapın
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTypeConfig = () => {
    switch (type) {
      case 'sheet_label':
        return {
          title: 'Tabaka Etiket Teklifi',
          description: 'A3/A4 tabaka halinde profesyonel etiket baskısı',
          icon: <LayoutGrid className="h-8 w-8 text-white" />,
          color: 'blue',
          bgGradient: 'from-blue-500 to-indigo-600'
        };
      case 'roll_label':
        return {
          title: 'Rulo Etiket Teklifi',
          description: 'Termal ve yapışkanlı rulo etiket çözümleri',
          icon: <Disc className="h-8 w-8 text-white" />,
          color: 'orange',
          bgGradient: 'from-orange-500 to-red-600'
        };
      case 'general_printing':
        return {
          title: 'Genel Baskı Teklifi',
          description: 'Katalog, broşür ve özel baskı projeleri',
          icon: <Printer className="h-8 w-8 text-white" />,
          color: 'green',
          bgGradient: 'from-green-500 to-emerald-600'
        };
      default:
        return {
          title: 'Teklif Talebi',
          description: 'Matbaa hizmetleri için teklif talebi',
          icon: <Printer className="h-8 w-8 text-white" />,
          color: 'blue',
          bgGradient: 'from-blue-500 to-indigo-600'
        };
    }
  };

  const typeConfig = getTypeConfig();

  // Get form type from URL
  const pathParts = window.location.pathname.split('/');
  const quoteType = pathParts[pathParts.length - 1] as 'sheet_label' | 'roll_label' | 'general_printing';

  // Get form fields configuration
  const formFields = getFormFieldsByType(quoteType);

  const [formData, setFormData] = useState(() => {
    const initialData: any = {
      title: '',
      description: '',
      quantity: '',
      deadline: '',
      budget: '',
    };

    // Initialize all form fields
    Object.keys(formFields).forEach(key => {
      initialData[key] = '';
    });

    return initialData;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="mb-6 shadow-md hover:shadow-lg transition-all duration-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard'a Dön
            </Button>
          </Link>

          {/* Header Card */}
          <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-white to-blue-50">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${typeConfig.bgGradient} rounded-full flex items-center justify-center shadow-lg`}>
                  {typeConfig.icon}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {typeConfig.title}
                  </h1>
                  <p className="text-xl text-gray-600">
                    {typeConfig.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Hızlı Teklif</div>
                  <div className="text-2xl font-bold text-blue-600">5 Dakika</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Matbaa Sayısı</div>
                  <div className="text-2xl font-bold text-green-600">50+</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Ortalama Tasarruf</div>
                  <div className="text-2xl font-bold text-orange-600">%25</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="details" className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Detaylar</span>
                </TabsTrigger>
                <TabsTrigger value="specifications" className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4" />
                  <span>Özellikler</span>
                </TabsTrigger>
                <TabsTrigger value="design" className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span>AI Tasarım</span>
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Dosyalar</span>
                </TabsTrigger>
                <TabsTrigger value="submit" className="flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Gönder</span>
                </TabsTrigger>
              </TabsList>

              <div className="space-y-6">
                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Proje Başlığı *</Label>
                      <Input
                        id="title"
                        placeholder="Örn: Ürün Etiketleri"
                        {...form.register("title")}
                        className="border-gray-300 focus:border-blue-500"
                      />
                      {form.formState.errors.title && (
                        <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Bütçe (TL)</Label>
                      <Input
                        id="budget"
                        placeholder="Örn: 1000-5000"
                        {...form.register("budget")}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Teslim Tarihi</Label>
                      <Input
                        id="deadline"
                        type="date"
                        {...form.register("deadline")}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Proje Açıklaması</Label>
                    <Textarea
                      id="description"
                      placeholder="Projeniz hakkında detaylı bilgi verin..."
                      rows={4}
                      {...form.register("description")}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setCurrentTab("specifications")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Devam Et
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="specifications" className="space-y-6">
                  {/* Seçilen Özellikler Özeti */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-4 text-lg">📋 Seçilen Ürün Özellikleri</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <span className="text-xs text-blue-600 font-medium block mb-1">Malzeme:</span>
                        <div className="text-sm font-bold text-blue-900">
                          {form.watch('specifications.material') || '❌ Seçilmedi'}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <span className="text-xs text-blue-600 font-medium block mb-1">Boyut:</span>
                        <div className="text-sm font-bold text-blue-900">
                          {form.watch('specifications.size') || '❌ Seçilmedi'}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <span className="text-xs text-blue-600 font-medium block mb-1">Adet:</span>
                        <div className="text-sm font-bold text-blue-900">
                          {form.watch('specifications.quantity') || 0}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <span className="text-xs text-blue-600 font-medium block mb-1">Renk:</span>
                        <div className="text-sm font-bold text-blue-900">
                          {form.watch('specifications.color') || '❌ Seçilmedi'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {type === 'sheet_label' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Kağıt Tipi</Label>
                        <Select 
                          value={form.watch('specifications.material')} 
                          onValueChange={(value) => form.setValue('specifications.material', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Kağıt tipini seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="transparent">Şeffaf Etiket</SelectItem>
                            <SelectItem value="opaque">Opak Etiket</SelectItem>
                            <SelectItem value="kraft">Kraft Etiket</SelectItem>
                            <SelectItem value="metalize">Metalize Etiket</SelectItem>
                            <SelectItem value="textured">Dokulu Etiket</SelectItem>
                            <SelectItem value="sticker">Sticker Kağıt</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Boyut</Label>
                        <Select 
                          value={form.watch('specifications.size')} 
                          onValueChange={(value) => form.setValue('specifications.size', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Boyut seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a3">A3 (297 x 420 mm)</SelectItem>
                            <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
                            <SelectItem value="custom">Özel Boyut</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Adet</Label>
                        <Input 
                          type="number"
                          placeholder="Örn: 1000"
                          value={form.watch('specifications.quantity')}
                          onChange={(e) => form.setValue('specifications.quantity', parseInt(e.target.value) || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Renk</Label>
                        <Select 
                          value={form.watch('specifications.color')} 
                          onValueChange={(value) => form.setValue('specifications.color', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Renk seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4-0">4+0 (Tek Yüz Renkli)</SelectItem>
                            <SelectItem value="4-4">4+4 (Çift Yüz Renkli)</SelectItem>
                            <SelectItem value="1-0">1+0 (Tek Yüz Siyah)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {type === 'roll_label' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Etiket Tipi</Label>
                        <Select 
                          value={form.watch('specifications.material')} 
                          onValueChange={(value) => form.setValue('specifications.material', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tip seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="thermal">Termal</SelectItem>
                            <SelectItem value="adhesive">Yapışkanlı</SelectItem>
                            <SelectItem value="removable">Çıkarılabilir</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Rulo Çapı (mm)</Label>
                        <Input 
                          placeholder="Örn: 76"
                          value={form.watch('specifications.size')}
                          onChange={(e) => form.setValue('specifications.size', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Etiket Boyutu (mm)</Label>
                        <Input 
                          placeholder="Örn: 50 x 30"
                          value={form.watch('specifications.color')}
                          onChange={(e) => form.setValue('specifications.color', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Toplam Adet</Label>
                        <Input 
                          type="number"
                          placeholder="Örn: 10000"
                          value={form.watch('specifications.quantity')}
                          onChange={(e) => form.setValue('specifications.quantity', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  )}

                  {type === 'general_printing' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Baskı Tipi</Label>
                        <Select 
                          value={form.watch('specifications.material')} 
                          onValueChange={(value) => form.setValue('specifications.material', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tip seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="catalog">Katalog</SelectItem>
                            <SelectItem value="brochure">Broşür</SelectItem>
                            <SelectItem value="business-card">Kartvizit</SelectItem>
                            <SelectItem value="flyer">Flyer</SelectItem>
                            <SelectItem value="other">Diğer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Sayfa Sayısı</Label>
                        <Input 
                          type="number"
                          placeholder="Örn: 24"
                          value={form.watch('specifications.color')}
                          onChange={(e) => form.setValue('specifications.color', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Boyut</Label>
                        <Input 
                          placeholder="Örn: 21x29.7 cm"
                          value={form.watch('specifications.size')}
                          onChange={(e) => form.setValue('specifications.size', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Adet</Label>
                        <Input 
                          type="number"
                          placeholder="Örn: 500"
                          value={form.watch('specifications.quantity')}
                          onChange={(e) => form.setValue('specifications.quantity', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab("details")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Geri
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentTab("files")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Devam Et
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Dosya Yükleme</h3>
                    <FileUpload
                      onFileUpload={handleFileUpload}
                      maxFiles={10}
                      maxSizeInMB={100}
                      acceptedTypes={['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'application/postscript', 'image/vnd.adobe.photoshop']}
                      className="mb-4"
                    />

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Yüklenen Dosyalar:</h4>
                        <div className="space-y-2">
                          {uploadedFiles.map((fileId, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Dosya {index + 1} başarıyla yüklendi</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab("specifications")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Geri
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentTab("design")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Devam Et
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Palette className="h-5 w-5 text-purple-600 mr-2" />
                      AI Tasarım Motoru
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Yapay zeka ile profesyonel tasarımlar oluşturun ve projelerinize ekleyin.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Design Templates */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                          Hızlı Şablonlar
                        </h4>
                        <div className="space-y-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setDesignPrompt("Modern kartvizit tasarımı")}
                          >
                            Modern Kartvizit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setDesignPrompt("Ürün etiketi tasarımı")}
                          >
                            Ürün Etiketi
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setDesignPrompt("Broşür kapak tasarımı")}
                          >
                            Broşür Kapağı
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setDesignPrompt("Banner tasarımı")}
                          >
                            Banner
                          </Button>
                        </div>
                      </div>

                      {/* Custom Design */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Palette className="h-4 w-4 text-blue-500 mr-2" />
                          Özel Tasarım
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="design-prompt">Tasarım Açıklaması</Label>
                            <Textarea
                              id="design-prompt"
                              value={designPrompt}
                              onChange={(e) => setDesignPrompt(e.target.value)}
                              placeholder="Örn: Mavi renklerde minimalist logo tasarımı..."
                              className="h-20"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={handleGenerateDesign}
                            disabled={!designPrompt || isGenerating}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            {isGenerating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Tasarım Oluşturuluyor...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4 mr-2" />
                                Tasarım Oluştur
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Generated Designs */}
                    {generatedDesigns.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Oluşturulan Tasarımlar</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {generatedDesigns.map((design, index) => (
                            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                <img 
                                  src={design.url} 
                                  alt={`Tasarım ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Tasarım {index + 1}</span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUseDesign(design)}
                                  >
                                    Kullan
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* API Key Warning */}
                    {!hasApiKey && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                          <span className="text-sm text-yellow-700">
                            AI tasarım özelliği için API anahtarı gereklidir. Lütfen yönetici ile iletişime geçin.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab("files")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Geri
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentTab("submit")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Devam Et
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Upload className="h-5 w-5 text-gray-600 mr-2" />
                      Dosya Yükle
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Matbaa işiniz için gerekli dosyaları yükleyin. AI tasarım motoru ile oluşturulan tasarımlar otomatik olarak eklenir.
                    </p>

                    <FileUpload
                      onFileUpload={handleFileUpload}
                      maxFiles={10}
                      maxSizeInMB={100}
                      acceptedTypes={['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'application/postscript', 'image/vnd.adobe.photoshop']}
                      className="mb-4"
                    />

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Yüklenen Dosyalar:</h4>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                              <span className="text-sm">{file}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                              >
                                Kaldır
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>)}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab("design")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Geri
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentTab("submit")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Devam Et
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="submit" className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                      Teklif Özeti
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Proje Tipi:</span>
                        <span className="font-medium">{typeConfig.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Başlık:</span>
                        <span className="font-medium">{form.getValues("title") || "Belirtilmedi"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bütçe:</span>
                        <span className="font-medium">{form.getValues("budget") || "Belirtilmedi"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Yüklenen Dosya:</span>
                        <span className="font-medium">{uploadedFiles.length} dosya</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Form */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">İletişim Bilgileri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Firma Adı *</Label>
                        <Input
                          id="companyName"
                          placeholder="Firma adınız"
                          {...form.register("contactInfo.companyName")}
                          className={form.formState.errors.contactInfo?.companyName ? "border-red-500" : ""}
                        />
                        {form.formState.errors.contactInfo?.companyName && (
                          <p className="text-sm text-red-500">{form.formState.errors.contactInfo.companyName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactName">Yetkili Kişi *</Label>
                        <Input
                          id="contactName"
                          placeholder="Ad Soyad"
                          {...form.register("contactInfo.contactName")}
                          className={form.formState.errors.contactInfo?.contactName ? "border-red-500" : ""}
                        />
                        {form.formState.errors.contactInfo?.contactName && (
                          <p className="text-sm text-red-500">{form.formState.errors.contactInfo.contactName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          {...form.register("contactInfo.email")}
                          className={form.formState.errors.contactInfo?.email ? "border-red-500" : ""}
                        />
                        {form.formState.errors.contactInfo?.email && (
                          <p className="text-sm text-red-500">{form.formState.errors.contactInfo.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          placeholder="0555 123 4567"
                          {...form.register("contactInfo.phone")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentTab("files")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Geri
                    </Button>
                    <Button
                      type="button"
                      disabled={isSubmitting || mutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("🎯 Explicit submit button clicked");

                        // Get current form values
                        const formValues = form.getValues();

                        // Manual validation and submission
                        const isValid = await form.trigger();
                        if (isValid) {
                          await onSubmit(formValues, true); // Pass true for explicit submission
                        } else {
                          console.log("🚫 Form validation failed");
                          toast({
                            title: "Form Hatası",
                            description: "Lütfen tüm gerekli alanları doldurun",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      {(isSubmitting || mutation.isPending) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Teklif Talebini Gönder
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}