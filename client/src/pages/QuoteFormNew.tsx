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
    adhesive: z.string().optional(),
    shape: z.string().optional(),
    layout: z.string().optional(),
    finishing: z.string().optional(),
    application: z.string().optional(),
    durability: z.string().optional(),
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
        adhesive: "",
        shape: "",
        layout: "",
        finishing: "",
        application: "",
        durability: "",
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
                    <div className="space-y-8">
                      {/* Malzeme Özellikleri */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">📄 Malzeme Özellikleri</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <SelectItem value="transparent-pp">Şeffaf PP Etiket (60 mikron)</SelectItem>
                                <SelectItem value="white-pp">Beyaz PP Etiket (50 mikron)</SelectItem>
                                <SelectItem value="silver-pet">Gümüş PET Etiket (40 mikron)</SelectItem>
                                <SelectItem value="gold-pet">Altın PET Etiket (40 mikron)</SelectItem>
                                <SelectItem value="kraft-paper">Kraft Kağıt (80 gsm)</SelectItem>
                                <SelectItem value="thermal-paper">Termal Kağıt (58 gsm)</SelectItem>
                                <SelectItem value="vinyl-white">Vinil Beyaz (80 mikron)</SelectItem>
                                <SelectItem value="vinyl-transparent">Vinil Şeffaf (80 mikron)</SelectItem>
                                <SelectItem value="destructible">Güvenlik Etiketi (Parçalanabilir)</SelectItem>
                                <SelectItem value="removable">Çıkarılabilir Etiket</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Yapışkan Tipi</Label>
                            <Select 
                              value={form.watch('specifications.adhesive')} 
                              onValueChange={(value) => form.setValue('specifications.adhesive', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Yapışkan seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="permanent">Kalıcı Yapışkan</SelectItem>
                                <SelectItem value="removable">Çıkarılabilir Yapışkan</SelectItem>
                                <SelectItem value="freezer">Dondurulmuş Ürün Yapışkanı</SelectItem>
                                <SelectItem value="high-temp">Yüksek Sıcaklık Yapışkanı</SelectItem>
                                <SelectItem value="marine">Denizcilik Yapışkanı</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Boyut ve Şekil */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">📐 Boyut ve Şekil</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Etiket Boyutu</Label>
                            <Select 
                              value={form.watch('specifications.size')} 
                              onValueChange={(value) => form.setValue('specifications.size', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Boyut seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30x20">30x20 mm</SelectItem>
                                <SelectItem value="40x30">40x30 mm</SelectItem>
                                <SelectItem value="50x30">50x30 mm</SelectItem>
                                <SelectItem value="60x40">60x40 mm</SelectItem>
                                <SelectItem value="70x50">70x50 mm</SelectItem>
                                <SelectItem value="100x50">100x50 mm</SelectItem>
                                <SelectItem value="100x70">100x70 mm</SelectItem>
                                <SelectItem value="custom">Özel Boyut</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Etiket Şekli</Label>
                            <Select 
                              value={form.watch('specifications.shape')} 
                              onValueChange={(value) => form.setValue('specifications.shape', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Şekil seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rectangle">Dikdörtgen</SelectItem>
                                <SelectItem value="square">Kare</SelectItem>
                                <SelectItem value="circle">Yuvarlak</SelectItem>
                                <SelectItem value="oval">Oval</SelectItem>
                                <SelectItem value="rounded-corner">Köşe Yuvarlaklı</SelectItem>
                                <SelectItem value="custom-die-cut">Özel Kesim</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Dizilim (Per Tabaka)</Label>
                            <Select 
                              value={form.watch('specifications.layout')} 
                              onValueChange={(value) => form.setValue('specifications.layout', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Dizilim seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1x1">1x1 (1 etiket/tabaka)</SelectItem>
                                <SelectItem value="2x1">2x1 (2 etiket/tabaka)</SelectItem>
                                <SelectItem value="2x2">2x2 (4 etiket/tabaka)</SelectItem>
                                <SelectItem value="3x2">3x2 (6 etiket/tabaka)</SelectItem>
                                <SelectItem value="4x2">4x2 (8 etiket/tabaka)</SelectItem>
                                <SelectItem value="4x4">4x4 (16 etiket/tabaka)</SelectItem>
                                <SelectItem value="custom">Özel Dizilim</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Baskı Özellikleri */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">🎨 Baskı Özellikleri</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Baskı Tipi</Label>
                            <Select 
                              value={form.watch('specifications.color')} 
                              onValueChange={(value) => form.setValue('specifications.color', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Baskı tipi seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="digital-cmyk">Dijital CMYK</SelectItem>
                                <SelectItem value="digital-6color">Dijital 6 Renk</SelectItem>
                                <SelectItem value="offset-4color">Ofset 4 Renk</SelectItem>
                                <SelectItem value="offset-pantone">Ofset + Pantone</SelectItem>
                                <SelectItem value="flexo">Flekso Baskı</SelectItem>
                                <SelectItem value="thermal-transfer">Termal Transfer</SelectItem>
                                <SelectItem value="screen-print">Serigrafi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Özel Efektler</Label>
                            <Select 
                              value={form.watch('specifications.finishing')} 
                              onValueChange={(value) => form.setValue('specifications.finishing', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Efekt seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Efekt Yok</SelectItem>
                                <SelectItem value="matte-lamination">Mat Laminasyon</SelectItem>
                                <SelectItem value="gloss-lamination">Parlak Laminasyon</SelectItem>
                                <SelectItem value="uv-varnish">UV Vernik</SelectItem>
                                <SelectItem value="hot-foil-gold">Altın Yaldız</SelectItem>
                                <SelectItem value="hot-foil-silver">Gümüş Yaldız</SelectItem>
                                <SelectItem value="embossing">Kabartma</SelectItem>
                                <SelectItem value="hologram">Hologram</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Adet</Label>
                            <Input 
                              type="number"
                              placeholder="Minimum 500 adet"
                              value={form.watch('specifications.quantity')}
                              onChange={(e) => form.setValue('specifications.quantity', parseInt(e.target.value) || 0)}
                            />
                            <p className="text-xs text-gray-500">Min: 500, Optimum: 1000+</p>
                          </div>
                        </div>
                      </div>

                      {/* Uygulama Alanı */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">🏷️ Uygulama Alanı</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Kullanım Amacı</Label>
                            <Select 
                              value={form.watch('specifications.application')} 
                              onValueChange={(value) => form.setValue('specifications.application', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Kullanım amacı seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="product-label">Ürün Etiketi</SelectItem>
                                <SelectItem value="barcode-label">Barkod Etiketi</SelectItem>
                                <SelectItem value="warning-label">Uyarı Etiketi</SelectItem>
                                <SelectItem value="brand-label">Marka Etiketi</SelectItem>
                                <SelectItem value="ingredient-label">İçerik Etiketi</SelectItem>
                                <SelectItem value="address-label">Adres Etiketi</SelectItem>
                                <SelectItem value="security-label">Güvenlik Etiketi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Dayanıklılık</Label>
                            <Select 
                              value={form.watch('specifications.durability')} 
                              onValueChange={(value) => form.setValue('specifications.durability', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Dayanıklılık seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="indoor-standard">İç Mekan Standart</SelectItem>
                                <SelectItem value="indoor-longterm">İç Mekan Uzun Vadeli</SelectItem>
                                <SelectItem value="outdoor-1year">Dış Mekan 1 Yıl</SelectItem>
                                <SelectItem value="outdoor-3year">Dış Mekan 3 Yıl</SelectItem>
                                <SelectItem value="industrial">Endüstriyel Kullanım</SelectItem>
                                <SelectItem value="freezer-safe">Dondurulmuş Ürün</SelectItem>
                                <SelectItem value="chemical-resistant">Kimyasal Dayanıklı</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {type === 'roll_label' && (
                    <div className="space-y-8">
                      {/* Rulo Özellikleri */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">🎯 Rulo Etiket Özellikleri</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Etiket Malzemesi</Label>
                            <Select 
                              value={form.watch('specifications.material')} 
                              onValueChange={(value) => form.setValue('specifications.material', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Malzeme seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="thermal-direct">Termal Direkt (58gsm)</SelectItem>
                                <SelectItem value="thermal-transfer">Termal Transfer (65gsm)</SelectItem>
                                <SelectItem value="synthetic-pp">Sentetik PP (50 mikron)</SelectItem>
                                <SelectItem value="vinyl-pvc">Vinil PVC (80 mikron)</SelectItem>
                                <SelectItem value="polyester-pet">Polyester PET (50 mikron)</SelectItem>
                                <SelectItem value="kraft-paper">Kraft Kağıt (70gsm)</SelectItem>
                                <SelectItem value="security-void">Güvenlik Etiketi (VOID)</SelectItem>
                                <SelectItem value="freezer-grade">Dondurulmuş Ürün Etiketi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Yapışkan Tipi</Label>
                            <Select 
                              value={form.watch('specifications.adhesive')} 
                              onValueChange={(value) => form.setValue('specifications.adhesive', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Yapışkan seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="permanent-acrylic">Kalıcı Akrilik</SelectItem>
                                <SelectItem value="removable-acrylic">Çıkarılabilir Akrilik</SelectItem>
                                <SelectItem value="freezer-grade">Dondurulmuş Ürün</SelectItem>
                                <SelectItem value="high-tack">Yüksek Yapışkanlı</SelectItem>
                                <SelectItem value="low-tack">Düşük Yapışkanlı</SelectItem>
                                <SelectItem value="marine-grade">Denizcilik Sınıfı</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Baskı Yöntemi</Label>
                            <Select 
                              value={form.watch('specifications.color')} 
                              onValueChange={(value) => form.setValue('specifications.color', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Baskı yöntemi seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="thermal-direct">Termal Direkt</SelectItem>
                                <SelectItem value="thermal-transfer">Termal Transfer</SelectItem>
                                <SelectItem value="inkjet-digital">İnkjet Dijital</SelectItem>
                                <SelectItem value="flexo-print">Flekso Baskı</SelectItem>
                                <SelectItem value="offset-print">Ofset Baskı</SelectItem>
                                <SelectItem value="screen-print">Serigrafi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Boyut ve Format */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">📏 Boyut ve Format Ayarları</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Etiket Boyutu</Label>
                            <Select 
                              value={form.watch('specifications.size')} 
                              onValueChange={(value) => form.setValue('specifications.size', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Boyut seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="20x10">20x10 mm</SelectItem>
                                <SelectItem value="30x20">30x20 mm</SelectItem>
                                <SelectItem value="40x25">40x25 mm</SelectItem>
                                <SelectItem value="50x30">50x30 mm</SelectItem>
                                <SelectItem value="58x40">58x40 mm</SelectItem>
                                <SelectItem value="70x50">70x50 mm</SelectItem>
                                <SelectItem value="100x70">100x70 mm</SelectItem>
                                <SelectItem value="custom">Özel Boyut</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Rulo Genişliği</Label>
                            <Select 
                              value={form.watch('specifications.layout')} 
                              onValueChange={(value) => form.setValue('specifications.layout', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Genişlik seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="25mm">25 mm</SelectItem>
                                <SelectItem value="40mm">40 mm</SelectItem>
                                <SelectItem value="50mm">50 mm</SelectItem>
                                <SelectItem value="76mm">76 mm</SelectItem>
                                <SelectItem value="100mm">100 mm</SelectItem>
                                <SelectItem value="150mm">150 mm</SelectItem>
                                <SelectItem value="custom">Özel Genişlik</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Mandrel Çapı</Label>
                            <Select 
                              value={form.watch('specifications.shape')} 
                              onValueChange={(value) => form.setValue('specifications.shape', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Mandrel çapı" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="25mm">25 mm (1")</SelectItem>
                                <SelectItem value="40mm">40 mm (1.5")</SelectItem>
                                <SelectItem value="76mm">76 mm (3")</SelectItem>
                                <SelectItem value="custom">Özel Çap</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Rulo Çapı (Maksimum)</Label>
                            <Select 
                              value={form.watch('specifications.finishing')} 
                              onValueChange={(value) => form.setValue('specifications.finishing', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Max çap" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="100mm">100 mm</SelectItem>
                                <SelectItem value="150mm">150 mm</SelectItem>
                                <SelectItem value="200mm">200 mm</SelectItem>
                                <SelectItem value="250mm">250 mm</SelectItem>
                                <SelectItem value="300mm">300 mm</SelectItem>
                                <SelectItem value="custom">Özel Çap</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Miktar ve Sarım */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">📦 Miktar ve Sarım Detayları</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Toplam Etiket Adedi</Label>
                            <Input 
                              type="number"
                              placeholder="Minimum 1000 adet"
                              value={form.watch('specifications.quantity')}
                              onChange={(e) => form.setValue('specifications.quantity', parseInt(e.target.value) || 0)}
                            />
                            <p className="text-xs text-gray-500">Min: 1000, Optimum: 5000+</p>
                          </div>

                          <div className="space-y-2">
                            <Label>Sarım Yönü</Label>
                            <Select 
                              value={form.watch('specifications.application')} 
                              onValueChange={(value) => form.setValue('specifications.application', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sarım yönü" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="outside-wound">Dış Sarım (Outside Wound)</SelectItem>
                                <SelectItem value="inside-wound">İç Sarım (Inside Wound)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Etiket Arası Boşluk</Label>
                            <Select 
                              value={form.watch('specifications.durability')} 
                              onValueChange={(value) => form.setValue('specifications.durability', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Boşluk seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2mm">2 mm</SelectItem>
                                <SelectItem value="3mm">3 mm (Standart)</SelectItem>
                                <SelectItem value="5mm">5 mm</SelectItem>
                                <SelectItem value="custom">Özel Boşluk</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Özel Özellikler */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">⚡ Özel Özellikler</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Ek Özellikler</Label>
                            <div className="space-y-2">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Perforasyon (kolay koparma)</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Köşe yuvarlama</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Sıcaklık dayanımlı</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Su geçirmez</span>
                              </label>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Kullanım Alanı</Label>
                            <div className="space-y-2">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Lojistik etiketleme</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Ürün etiketleme</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Barkod/QR kod</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Seri numaralama</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {type === 'general_printing' && (
                    <div className="space-y-8">
                      {/* Ürün Tipi ve Kategori */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">📖 Ürün Tipi ve Kategori</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Baskı Ürünü</Label>
                            <Select 
                              value={form.watch('specifications.material')} 
                              onValueChange={(value) => form.setValue('specifications.material', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Ürün tipi seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="catalog">Katalog / Dergi</SelectItem>
                                <SelectItem value="brochure">Broşür / Tanıtım</SelectItem>
                                <SelectItem value="business-card">Kartvizit</SelectItem>
                                <SelectItem value="letterhead">Antetli Kağıt</SelectItem>
                                <SelectItem value="flyer">Flyer / El İlanı</SelectItem>
                                <SelectItem value="poster">Poster / Afiş</SelectItem>
                                <SelectItem value="book">Kitap / Dergi</SelectItem>
                                <SelectItem value="manual">Manuel / Kılavuz</SelectItem>
                                <SelectItem value="calendar">Takvim</SelectItem>
                                <SelectItem value="packaging">Ambalaj / Kutu</SelectItem>
                                <SelectItem value="certificate">Sertifika / Diploma</SelectItem>
                                <SelectItem value="presentation">Sunum Dosyası</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Boyut Standardı</Label>
                            <Select 
                              value={form.watch('specifications.size')} 
                              onValueChange={(value) => form.setValue('specifications.size', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Boyut seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="a0">A0 (841 x 1189 mm)</SelectItem>
                                <SelectItem value="a1">A1 (594 x 841 mm)</SelectItem>
                                <SelectItem value="a2">A2 (420 x 594 mm)</SelectItem>
                                <SelectItem value="a3">A3 (297 x 420 mm)</SelectItem>
                                <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
                                <SelectItem value="a5">A5 (148 x 210 mm)</SelectItem>
                                <SelectItem value="a6">A6 (105 x 148 mm)</SelectItem>
                                <SelectItem value="85x55">Kartvizit (85 x 55 mm)</SelectItem>
                                <SelectItem value="100x70">Kartvizit Jumbo (100 x 70 mm)</SelectItem>
                                <SelectItem value="custom">Özel Boyut</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Yönlendirme</Label>
                            <Select 
                              value={form.watch('specifications.shape')} 
                              onValueChange={(value) => form.setValue('specifications.shape', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Yön seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="portrait">Dikey (Portrait)</SelectItem>
                                <SelectItem value="landscape">Yatay (Landscape)</SelectItem>
                                <SelectItem value="square">Kare</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Kağıt ve Malzeme */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">📄 Kağıt ve Malzeme Özellikleri</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Kağıt Tipi</Label>
                            <Select 
                              value={form.watch('specifications.adhesive')} 
                              onValueChange={(value) => form.setValue('specifications.adhesive', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Kağıt tipi seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="offset-80gsm">Offset 80 gsm</SelectItem>
                                <SelectItem value="offset-90gsm">Offset 90 gsm</SelectItem>
                                <SelectItem value="kuşe-115gsm">Kuşe 115 gsm</SelectItem>
                                <SelectItem value="kuşe-135gsm">Kuşe 135 gsm</SelectItem>
                                <SelectItem value="kuşe-170gsm">Kuşe 170 gsm</SelectItem>
                                <SelectItem value="kuşe-250gsm">Kuşe 250 gsm</SelectItem>
                                <SelectItem value="kuşe-300gsm">Kuşe 300 gsm</SelectItem>
                                <SelectItem value="bristol-250gsm">Bristol 250 gsm</SelectItem>
                                <SelectItem value="bristol-300gsm">Bristol 300 gsm</SelectItem>
                                <SelectItem value="kraft-200gsm">Kraft 200 gsm</SelectItem>
                                <SelectItem value="recycled-80gsm">Geri Dönüşüm 80 gsm</SelectItem>
                                <SelectItem value="special-paper">Özel Kağıt</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Kağıt Yüzeyi</Label>
                            <Select 
                              value={form.watch('specifications.layout')} 
                              onValueChange={(value) => form.setValue('specifications.layout', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Yüzey seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="matte">Mat</SelectItem>
                                <SelectItem value="glossy">Parlak</SelectItem>
                                <SelectItem value="silk">İpek Mat</SelectItem>
                                <SelectItem value="textured">Dokulu</SelectItem>
                                <SelectItem value="linen">Keten Dokulu</SelectItem>
                                <SelectItem value="hammered">Dövme Dokulu</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Kalınlık/Gramaj</Label>
                            <Select 
                              value={form.watch('specifications.finishing')} 
                              onValueChange={(value) => form.setValue('specifications.finishing', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Gramaj seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">Hafif (80-90 gsm)</SelectItem>
                                <SelectItem value="standard">Standart (115-135 gsm)</SelectItem>
                                <SelectItem value="medium">Orta (170-200 gsm)</SelectItem>
                                <SelectItem value="heavy">Ağır (250-300 gsm)</SelectItem>
                                <SelectItem value="cardboard">Karton (350+ gsm)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Baskı Özellikleri */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">🎨 Baskı Özellikleri</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Baskı Teknolojisi</Label>
                            <Select 
                              value={form.watch('specifications.color')} 
                              onValueChange={(value) => form.setValue('specifications.color', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Teknoloji seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="digital-hp-indigo">Dijital HP Indigo</SelectItem>
                                <SelectItem value="digital-xerox">Dijital Xerox</SelectItem>
                                <SelectItem value="offset-sheet">Ofset Tabaka</SelectItem>
                                <SelectItem value="offset-web">Ofset Rotativ</SelectItem>
                                <SelectItem value="uv-offset">UV Ofset</SelectItem>
                                <SelectItem value="screen-printing">Serigrafi</SelectItem>
                                <SelectItem value="large-format">Geniş Format</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Renk Seçenekleri</Label>
                            <Select 
                              value={form.watch('specifications.application')} 
                              onValueChange={(value) => form.setValue('specifications.application', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Renk seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1-0">1+0 (Tek Yüz Siyah)</SelectItem>
                                <SelectItem value="1-1">1+1 (Çift Yüz Siyah)</SelectItem>
                                <SelectItem value="4-0">4+0 (Tek Yüz Renkli)</SelectItem>
                                <SelectItem value="4-4">4+4 (Çift Yüz Renkli)</SelectItem>
                                <SelectItem value="4-1">4+1 (Renkli + Siyah)</SelectItem>
                                <SelectItem value="5-0">5+0 (4 Renk + Pantone)</SelectItem>
                                <SelectItem value="5-5">5+5 (Çift Yüz + Pantone)</SelectItem>
                                <SelectItem value="spot-color">Özel Pantone Renkleri</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Sayfa Sayısı</Label>
                            <Input 
                              type="number"
                              placeholder="Örn: 24 sayfa"
                              value={form.watch('specifications.durability')}
                              onChange={(e) => form.setValue('specifications.durability', e.target.value)}
                            />
                            <p className="text-xs text-gray-500">Kitap/Dergi için geçerli</p>
                          </div>
                        </div>
                      </div>

                      {/* Son İşlemler */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">✨ Son İşlemler ve Ciltleme</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Yüzey İşlemleri</Label>
                            <div className="space-y-2">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Mat Laminasyon</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Parlak Laminasyon</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">UV Vernik (Selective)</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">UV Vernik (Full)</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Altın Yaldız</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Gümüş Yaldız</span>
                              </label>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Kesim ve Ciltleme</Label>
                            <div className="space-y-2">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Spiral Cilt</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Tel Dikis</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Karton Kapak</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Kalın Kapak (Ciltli)</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Özel Kesim (Die-Cut)</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">Perforasyon</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Miktar ve Teslimat */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">📦 Miktar ve Teslimat</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Toplam Adet</Label>
                            <Input 
                              type="number"
                              placeholder="Minimum 100 adet"
                              value={form.watch('specifications.quantity')}
                              onChange={(e) => form.setValue('specifications.quantity', parseInt(e.target.value) || 0)}
                            />
                            <p className="text-xs text-gray-500">Min: 100, Optimum: 500+</p>
                          </div>

                          <div className="space-y-2">
                            <Label>Paketleme</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Paketleme seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standart Paketleme</SelectItem>
                                <SelectItem value="individual">Tek Tek Ambalajlama</SelectItem>
                                <SelectItem value="bulk">Toplu Paketleme</SelectItem>
                                <SelectItem value="gift-wrap">Hediye Paketleme</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Aciliyet</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Teslimat hızı" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standart (5-7 gün)</SelectItem>
                                <SelectItem value="fast">Hızlı (3-4 gün)</SelectItem>
                                <SelectItem value="express">Ekspres (1-2 gün)</SelectItem>
                                <SelectItem value="same-day">Aynı Gün</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
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