import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Package, 
  Settings,
  Upload,
  Palette,
  Calculator,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import Navigation from "@/components/Navigation";
import DesignEngine from "@/components/DesignEngine";
import FileUpload from "@/components/FileUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Enhanced form schema with better validation
const quoteSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  type: z.enum(["sheet_label", "roll_label", "general_printing"]),
  specifications: z.object({
    quantity: z.number().min(1, "Adet 1'den az olamaz"),
    material: z.string().optional(),
    size: z.string().optional(),
    description: z.string().optional(),
    paperType: z.string().optional(),
    printType: z.string().optional(),
    finishType: z.string().optional(),
    customWidth: z.string().optional(),
    customHeight: z.string().optional(),
  }),
  contactInfo: z.object({
    companyName: z.string().min(2, "Firma adı gerekli"),
    contactName: z.string().min(2, "İletişim kişisi gerekli"),
    email: z.string().email("Geçerli email adresi girin"),
    phone: z.string().min(10, "Telefon numarası gerekli"),
  }),
  description: z.string().optional(),
  deadline: z.string().optional(),
  budget: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

// Form type definitions
interface FormConfig {
  title: string;
  fields: FormField[];
  categories: FormCategory[];
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  description?: string;
}

interface FormCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  fields: string[];
}

export default function QuoteFormNew() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { type } = useParams();
  const queryClient = useQueryClient();

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("details");
  const [designPrompt, setDesignPrompt] = useState("");
  const [generatedDesigns, setGeneratedDesigns] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDesignDialogOpen, setIsDesignDialogOpen] = useState(false);

  // Form configuration based on type
  const getFormConfig = (formType: string): FormConfig => {
    const baseFields: FormField[] = [
      {
        name: 'quantity',
        label: 'Adet',
        type: 'number',
        required: true,
        placeholder: '1000',
        description: 'Üretilecek toplam adet sayısı'
      },
      {
        name: 'description',
        label: 'Açıklama',
        type: 'textarea',
        placeholder: 'Projeniz hakkında detaylı bilgi verin...',
        description: 'Özel istekleriniz, kalite gereksinimleri vb.'
      }
    ];

    switch (formType) {
      case 'sheet_label':
        return {
          title: 'Tabaka Etiket Teklifi',
          fields: [
            ...baseFields,
            {
              name: 'paperType',
              label: 'Kağıt Türü',
              type: 'select',
              required: true,
              options: [
                { value: 'kuşe', label: 'Kuşe Kağıt' },
                { value: 'mat_kuşe', label: 'Mat Kuşe' },
                { value: 'bristol', label: 'Bristol' },
                { value: 'kraft', label: 'Kraft Kağıt' },
                { value: 'özel', label: 'Özel Kağıt' }
              ]
            },
            {
              name: 'size',
              label: 'Boyut',
              type: 'select',
              required: true,
              options: [
                { value: 'a4', label: 'A4 (210x297mm)' },
                { value: 'a3', label: 'A3 (297x420mm)' },
                { value: '70x100', label: '70x100cm' },
                { value: 'custom', label: 'Özel Boyut' }
              ]
            },
            {
              name: 'customWidth',
              label: 'Özel En (mm)',
              type: 'text',
              placeholder: '210'
            },
            {
              name: 'customHeight',
              label: 'Özel Boy (mm)',
              type: 'text',
              placeholder: '297'
            },
            {
              name: 'printType',
              label: 'Baskı Türü',
              type: 'select',
              options: [
                { value: 'offset', label: 'Offset Baskı' },
                { value: 'dijital', label: 'Dijital Baskı' },
                { value: 'serigrafi', label: 'Serigrafi' }
              ]
            },
            {
              name: 'finishType',
              label: 'Yüzey İşlemi',
              type: 'select',
              options: [
                { value: 'yok', label: 'Yüzey İşlemi Yok' },
                { value: 'selefon', label: 'Selefon' },
                { value: 'uv_vernik', label: 'UV Vernik' },
                { value: 'laminasyon', label: 'Laminasyon' }
              ]
            }
          ],
          categories: [
            {
              id: 'basic',
              title: 'Temel Bilgiler',
              icon: <Info className="h-4 w-4" />,
              fields: ['quantity', 'paperType', 'size', 'customWidth', 'customHeight']
            },
            {
              id: 'printing',
              title: 'Baskı Özellikleri',
              icon: <Settings className="h-4 w-4" />,
              fields: ['printType', 'finishType']
            },
            {
              id: 'details',
              title: 'Detaylar',
              icon: <FileText className="h-4 w-4" />,
              fields: ['description']
            }
          ]
        };

      case 'roll_label':
        return {
          title: 'Rulo Etiket Teklifi',
          fields: [
            ...baseFields,
            {
              name: 'material',
              label: 'Malzeme',
              type: 'select',
              required: true,
              options: [
                { value: 'pp', label: 'PP Film' },
                { value: 'pe', label: 'PE Film' },
                { value: 'termal', label: 'Termal Kağıt' },
                { value: 'vinyl', label: 'Vinil' },
                { value: 'şeffaf', label: 'Şeffaf Film' }
              ]
            },
            {
              name: 'rollWidth',
              label: 'Rulo Eni (mm)',
              type: 'text',
              required: true,
              placeholder: '100'
            },
            {
              name: 'rollLength',
              label: 'Rulo Uzunluğu (m)',
              type: 'text',
              placeholder: '1000'
            },
            {
              name: 'adhesiveType',
              label: 'Yapıştırıcı Türü',
              type: 'select',
              options: [
                { value: 'permanent', label: 'Kalıcı' },
                { value: 'removable', label: 'Çıkarılabilir' },
                { value: 'ultra_permanent', label: 'Ultra Kalıcı' }
              ]
            },
            {
              name: 'cuttingType',
              label: 'Kesim Türü',
              type: 'select',
              options: [
                { value: 'die_cut', label: 'Kalıp Kesim' },
                { value: 'straight_cut', label: 'Düz Kesim' },
                { value: 'kiss_cut', label: 'Kiss Cut' }
              ]
            }
          ],
          categories: [
            {
              id: 'basic',
              title: 'Temel Bilgiler',
              icon: <Info className="h-4 w-4" />,
              fields: ['quantity', 'material', 'rollWidth', 'rollLength']
            },
            {
              id: 'specs',
              title: 'Teknik Özellikler',
              icon: <Settings className="h-4 w-4" />,
              fields: ['adhesiveType', 'cuttingType']
            },
            {
              id: 'details',
              title: 'Detaylar',
              icon: <FileText className="h-4 w-4" />,
              fields: ['description']
            }
          ]
        };

      case 'general_printing':
        return {
          title: 'Genel Baskı Teklifi',
          fields: [
            ...baseFields,
            {
              name: 'printType',
              label: 'Baskı Türü',
              type: 'select',
              required: true,
              options: [
                { value: 'kartvizit', label: 'Kartvizit' },
                { value: 'broşür', label: 'Broşür' },
                { value: 'katalog', label: 'Katalog' },
                { value: 'poster', label: 'Poster' },
                { value: 'banner', label: 'Banner' },
                { value: 'diğer', label: 'Diğer' }
              ]
            },
            {
              name: 'paperType',
              label: 'Kağıt/Malzeme',
              type: 'select',
              options: [
                { value: 'kuşe', label: 'Kuşe Kağıt' },
                { value: 'bristol', label: 'Bristol' },
                { value: 'kraft', label: 'Kraft' },
                { value: 'canvas', label: 'Canvas' },
                { value: 'vinyl', label: 'Vinil' }
              ]
            },
            {
              name: 'size',
              label: 'Boyut',
              type: 'select',
              options: [
                { value: 'a4', label: 'A4' },
                { value: 'a3', label: 'A3' },
                { value: 'a2', label: 'A2' },
                { value: 'a1', label: 'A1' },
                { value: 'custom', label: 'Özel Boyut' }
              ]
            }
          ],
          categories: [
            {
              id: 'basic',
              title: 'Temel Bilgiler',
              icon: <Info className="h-4 w-4" />,
              fields: ['quantity', 'printType', 'paperType', 'size']
            },
            {
              id: 'details',
              title: 'Detaylar',
              icon: <FileText className="h-4 w-4" />,
              fields: ['description']
            }
          ]
        };

      default:
        return {
          title: 'Teklif Formu',
          fields: baseFields,
          categories: []
        };
    }
  };

  const formConfig = getFormConfig(type || 'sheet_label');

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      title: formConfig.title,
      type: (type as any) || "sheet_label",
      specifications: {
        quantity: 1000,
        material: "",
        size: "",
        description: ""
      },
      contactInfo: {
        companyName: user?.companyName || "",
        contactName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        email: user?.email || "",
        phone: ""
      },
      description: "",
      deadline: "",
      budget: "",
    },
    mode: "onChange",
  });

  // Load form data from API
  const { data: formData, isLoading: formLoading } = useQuery({
    queryKey: [`/api/quotes/form/${type}`],
    queryFn: async () => {
      const response = await fetch(`/api/quotes/form/${type}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Form yüklenemedi');
      }
      return response.json();
    },
    enabled: !!type
  });

  const mutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      console.log("📤 Submitting quote with data:", data);

      const quoteData = {
        ...data,
        specifications: {
          ...data.specifications,
          uploadedFiles,
          generatedDesigns
        },
        files: uploadedFiles,
        generatedDesigns
      };

      // Convert deadline to proper format if it exists
      if (quoteData.deadline && quoteData.deadline !== '') {
        quoteData.deadline = new Date(quoteData.deadline).toISOString();
      } else {
        delete quoteData.deadline;
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(quoteData),
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

      // Redirect to customer dashboard
      setTimeout(() => {
        window.location.href = "/customer-dashboard";
      }, 2000);
    },
    onError: (error: any) => {
      console.error("Quote creation error:", error);
      setIsSubmitting(false);

      toast({
        title: "Hata",
        description: error.message || "Teklif oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: QuoteFormData, isExplicitSubmit: boolean = false) => {
    console.log("Form submitted with data:", data, "Explicit submit:", isExplicitSubmit);

    if (!isExplicitSubmit) {
      console.log("🚫 Blocking automatic form submission");
      return;
    }

    if (isSubmitting || mutation.isPending) {
      console.log("🚫 Preventing duplicate submission");
      return;
    }

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
      if (!data.title?.trim()) {
        throw new Error("Başlık alanı boş olamaz");
      }

      if (!data.contactInfo?.companyName?.trim()) {
        throw new Error("Firma adı boş olamaz");
      }

      if (!data.contactInfo?.contactName?.trim()) {
        throw new Error("İletişim kişisi boş olamaz");
      }

      if (!data.contactInfo?.email?.trim()) {
        throw new Error("Email adresi boş olamaz");
      }

      mutation.mutate(data);
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: "Form Hatası",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExplicitSubmit = () => {
    console.log("🚀 Explicit submit triggered");
    form.handleSubmit((data) => onSubmit(data, true))();
  };

  const renderFormField = (field: FormField) => {
    const value = form.watch(`specifications.${field.name}` as any) || '';

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {field.type === 'select' ? (
          <Select
            value={value}
            onValueChange={(val) => form.setValue(`specifications.${field.name}` as any, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `${field.label} seçin`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === 'textarea' ? (
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => form.setValue(`specifications.${field.name}` as any, e.target.value)}
            rows={3}
          />
        ) : field.type === 'number' ? (
          <Input
            id={field.name}
            type="number"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => form.setValue(`specifications.${field.name}` as any, parseInt(e.target.value) || 0)}
          />
        ) : (
          <Input
            id={field.name}
            type="text"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => form.setValue(`specifications.${field.name}` as any, e.target.value)}
          />
        )}

        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}
      </div>
    );
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user?.role !== 'customer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-bold">Erişim Hatası</h2>
              </div>
              <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmuyor.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{formConfig.title}</h1>
            <p className="text-gray-600">Teklif talebinizi detaylandırın</p>
          </div>
        </div>

        {formLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Proje Detayları</TabsTrigger>
                <TabsTrigger value="design">Tasarım</TabsTrigger>
                <TabsTrigger value="files">Dosyalar</TabsTrigger>
                <TabsTrigger value="contact">İletişim</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Proje Özellikleri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Proje Başlığı *</Label>
                        <Input
                          id="title"
                          {...form.register("title")}
                          placeholder="Proje başlığınızı girin"
                        />
                        {form.formState.errors.title && (
                          <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Dynamic form fields by category */}
                    {formConfig.categories.map((category) => (
                      <div key={category.id} className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {category.icon}
                          {category.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {category.fields.map((fieldName) => {
                            const field = formConfig.fields.find(f => f.name === fieldName);
                            return field ? renderFormField(field) : null;
                          })}
                        </div>
                        {category.id !== 'details' && <Separator />}
                      </div>
                    ))}

                    {/* Additional Options */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Ek Bilgiler</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="deadline">Teslim Tarihi</Label>
                          <Input
                            id="deadline"
                            type="date"
                            {...form.register("deadline")}
                          />
                        </div>
                        <div>
                          <Label htmlFor="budget">Tahmini Bütçe (₺)</Label>
                          <Input
                            id="budget"
                            type="number"
                            placeholder="5000"
                            {...form.register("budget")}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Tasarım Oluşturma
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Dialog open={isDesignDialogOpen} onOpenChange={setIsDesignDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <Palette className="h-4 w-4 mr-2" />
                            AI Tasarım Motoru ile Tasarım Oluştur
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl h-[90vh] overflow-hidden">
                          <DialogHeader>
                            <DialogTitle>AI Tasarım Motoru</DialogTitle>
                          </DialogHeader>
                          <div className="h-full overflow-y-auto">
                            <DesignEngine />
                          </div>
                        </DialogContent>
                      </Dialog>

                      {generatedDesigns.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Oluşturulan Tasarımlar:</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {generatedDesigns.map((design, index) => (
                              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={design.url}
                                  alt={`Tasarım ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <Badge className="absolute top-2 right-2">
                                  {index + 1}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Dosya Yükleme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      onFileUpload={(files) => setUploadedFiles(prev => [...prev, ...files])}
                      multiple={true}
                    />
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Yüklenen Dosyalar:</p>
                        <div className="space-y-1">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{file}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                              >
                                Sil
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      İletişim Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Firma Adı *</Label>
                        <Input
                          id="companyName"
                          {...form.register("contactInfo.companyName")}
                          placeholder="Firma adınız"
                        />
                        {form.formState.errors.contactInfo?.companyName && (
                          <p className="text-sm text-red-600">{form.formState.errors.contactInfo.companyName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="contactName">İletişim Kişisi *</Label>
                        <Input
                          id="contactName"
                          {...form.register("contactInfo.contactName")}
                          placeholder="Adınız soyadınız"
                        />
                        {form.formState.errors.contactInfo?.contactName && (
                          <p className="text-sm text-red-600">{form.formState.errors.contactInfo.contactName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email Adresi *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register("contactInfo.email")}
                          placeholder="email@ornek.com"
                        />
                        {form.formState.errors.contactInfo?.email && (
                          <p className="text-sm text-red-600">{form.formState.errors.contactInfo.email.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon Numarası *</Label>
                        <Input
                          id="phone"
                          {...form.register("contactInfo.phone")}
                          placeholder="+90 555 123 4567"
                        />
                        {form.formState.errors.contactInfo?.phone && (
                          <p className="text-sm text-red-600">{form.formState.errors.contactInfo.phone.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Section */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Teklif talebiniz matbaa firmalarına iletilecektir
                      </div>
                      <Button
                        onClick={handleExplicitSubmit}
                        disabled={isSubmitting || mutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        {isSubmitting ? (
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        )}
      </div>
    </div>
  );
}