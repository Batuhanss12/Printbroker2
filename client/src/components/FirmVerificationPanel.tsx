
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Building2,
  AlertCircle,
  Eye,
  Download
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function FirmVerificationPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Fetch pending verification documents
  const { data: pendingDocuments, isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/admin/verification/pending"],
  });

  // Fetch companies verification status
  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ["/api/admin/verification/companies"],
  });

  // Review document mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ documentId, status, reviewNotes }: { 
      documentId: string; 
      status: 'approved' | 'rejected'; 
      reviewNotes?: string 
    }) => {
      return apiRequest('POST', `/api/admin/verification/review/${documentId}`, {
        status,
        reviewNotes
      });
    },
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Belge incelemesi tamamlandı",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verification/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verification/companies"] });
      setSelectedDocument(null);
      setReviewNotes("");
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Belge incelemesi sırasında hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleReview = (status: 'approved' | 'rejected') => {
    if (!selectedDocument) return;

    reviewMutation.mutate({
      documentId: selectedDocument.id,
      status,
      reviewNotes
    });
  };

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Onaylandı</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Reddedildi</Badge>;
      case 'under_review':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />İnceleniyor</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Bekliyor</Badge>;
    }
  };

  const getDocumentTypeName = (type: string) => {
    const types: Record<string, string> = {
      'trade_registry': 'Ticaret Sicil Belgesi',
      'tax_certificate': 'Vergi Levhası',
      'signature_circular': 'İmza Sirküleri',
      'iso_certificate': 'ISO Sertifikası',
      'other': 'Diğer'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingDocuments?.documents?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Bekleyen Belgeler</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {companies?.companies?.filter((c: any) => c.verificationStatus === 'approved').length || 0}
                </p>
                <p className="text-sm text-gray-600">Onaylanan Firmalar</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {companies?.companies?.filter((c: any) => c.verificationStatus === 'pending').length || 0}
                </p>
                <p className="text-sm text-gray-600">Onay Bekleyenler</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Bekleyen Belgeler</TabsTrigger>
          <TabsTrigger value="companies">Tüm Firmalar</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>İnceleme Bekleyen Belgeler</CardTitle>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="text-center py-8">Yükleniyor...</div>
              ) : pendingDocuments?.documents?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firma</TableHead>
                      <TableHead>Belge Türü</TableHead>
                      <TableHead>Dosya Adı</TableHead>
                      <TableHead>Yükleme Tarihi</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingDocuments.documents.map((doc: any) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {companies?.companies?.find((c: any) => c.id === doc.userId)?.companyName || 'Bilinmiyor'}
                        </TableCell>
                        <TableCell>{getDocumentTypeName(doc.documentType)}</TableCell>
                        <TableCell>{doc.fileName}</TableCell>
                        <TableCell>
                          {new Date(doc.uploadDate).toLocaleDateString('tr-TR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedDocument(doc)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  İncele
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Belge İncelemesi</DialogTitle>
                                  <DialogDescription>
                                    {getDocumentTypeName(selectedDocument?.documentType)} - {selectedDocument?.fileName}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div className="border rounded-lg p-4 bg-gray-50">
                                    <p><strong>Firma:</strong> {companies?.companies?.find((c: any) => c.id === selectedDocument?.userId)?.companyName}</p>
                                    <p><strong>Email:</strong> {companies?.companies?.find((c: any) => c.id === selectedDocument?.userId)?.email}</p>
                                    <p><strong>Belge Türü:</strong> {getDocumentTypeName(selectedDocument?.documentType)}</p>
                                    <p><strong>Yükleme Tarihi:</strong> {selectedDocument && new Date(selectedDocument.uploadDate).toLocaleString('tr-TR')}</p>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2">İnceleme Notları</label>
                                    <Textarea
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                      placeholder="İnceleme notlarınızı buraya yazın..."
                                      rows={3}
                                    />
                                  </div>

                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      variant="outline"
                                      onClick={() => handleReview('rejected')}
                                      disabled={reviewMutation.isPending}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reddet
                                    </Button>
                                    <Button
                                      onClick={() => handleReview('approved')}
                                      disabled={reviewMutation.isPending}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Onayla
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  İnceleme bekleyen belge bulunmuyor.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Tüm Firmalar ve Doğrulama Durumları</CardTitle>
            </CardHeader>
            <CardContent>
              {companiesLoading ? (
                <div className="text-center py-8">Yükleniyor...</div>
              ) : companies?.companies?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Firma Adı</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead>Doğrulama Durumu</TableHead>
                      <TableHead>Doğrulama Tarihi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.companies.map((company: any) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          {company.companyName || 'Firma Adı Belirtilmemiş'}
                        </TableCell>
                        <TableCell>{company.email}</TableCell>
                        <TableCell>
                          {new Date(company.createdAt).toLocaleDateString('tr-TR')}
                        </TableCell>
                        <TableCell>
                          {getVerificationStatusBadge(company.verificationStatus)}
                        </TableCell>
                        <TableCell>
                          {company.verificationDate ? 
                            new Date(company.verificationDate).toLocaleDateString('tr-TR') : 
                            '-'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Kayıtlı firma bulunmuyor.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
