import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  FileText,
  DollarSign,
  CheckCircle,
  Settings,
  BarChart3,
  Printer,
  Star,
  Bell,
  Activity,
  TrendingUp,
  Target,
  Award,
  User,
  Edit,
  Trash2,
  AlertCircle,
  Package,
  Eye,
  Download,
  Upload,
  Clock,
  XCircle,
  Building2,
  Shield,
  Database,
  Server,
  Zap,
  RefreshCw,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Filter,
  Search,
  MoreVertical,
  ShoppingCart,
  UserPlus,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  
  // State management for admin panel
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [verificationDialog, setVerificationDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserDialog, setSelectedUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Enhanced authentication handling
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Oturum Sonlandı",
        description: "Lütfen tekrar giriş yapın",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/?login=required";
      }, 1500);
      return;
    }

    if (!isLoading && user && user.role !== 'admin') {
      toast({
        title: "Erişim Hatası",
        description: "Bu sayfaya erişim yetkiniz bulunmuyor",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return;
    }
  }, [isLoading, isAuthenticated, user, toast]);

  // Fetch system statistics with proper error handling
  const { data: systemStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: !!user?.id && user?.role === 'admin',
    refetchInterval: 30000
  });

  // Fetch all users with proper error handling
  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: !!user?.id && user?.role === 'admin'
  });

  // Fetch all quotes with proper error handling
  const { data: allQuotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ['/api/admin/quotes'],
    enabled: !!user?.id && user?.role === 'admin'
  });

  // Fetch all orders with proper error handling
  const { data: allOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/admin/orders'],
    enabled: !!user?.id && user?.role === 'admin'
  });

  // Fetch pending verifications
  const { data: pendingVerifications = [], isLoading: verificationsLoading } = useQuery({
    queryKey: ['/api/admin/verifications'],
    enabled: !!user?.id && user?.role === 'admin'
  });

  // Company verification mutation
  const verifyCompanyMutation = useMutation({
    mutationFn: ({ companyId, status, notes }: { companyId: string; status: string; notes: string }) =>
      apiRequest('/api/admin/verify-company', 'POST', { companyId, status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/verifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setVerificationDialog(false);
      toast({
        title: "Başarılı",
        description: "Firma doğrulaması güncellendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Doğrulama güncellenirken hata oluştu",
        variant: "destructive",
      });
    }
  });

  // User update mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, updateData }: { userId: string; updateData: any }) =>
      apiRequest(`/api/admin/users/${userId}`, 'PUT', updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setSelectedUserDialog(false);
      toast({
        title: "Başarılı",
        description: "Kullanıcı bilgileri güncellendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Kullanıcı güncellenirken hata oluştu",
        variant: "destructive",
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) =>
      apiRequest(`/api/admin/users/${userId}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Başarılı",
        description: "Kullanıcı silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Kullanıcı silinirken hata oluştu",
        variant: "destructive",
      });
    }
  });

  // Filter users based on search term and status
  const filteredUsers = Array.isArray(allUsers) ? allUsers.filter((user: any) => {
    const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || user.role === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Beklemede</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Onaylandı</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Reddedildi</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-700">Admin</Badge>;
      case 'printer':
        return <Badge className="bg-blue-100 text-blue-700">Matbaa</Badge>;
      case 'customer':
        return <Badge className="bg-green-100 text-green-700">Müşteri</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Kontrol Paneli
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sistem yönetimi ve firma doğrulaması
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(allUsers) ? allUsers.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Teklif</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(allQuotes) ? allQuotes.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(allOrders) ? allOrders.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bekleyen Doğrulama</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(pendingVerifications) ? pendingVerifications.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="verifications">Firma Doğrulama</TabsTrigger>
            <TabsTrigger value="quotes">Teklifler</TabsTrigger>
            <TabsTrigger value="orders">Siparişler</TabsTrigger>
            <TabsTrigger value="analytics">Analizler</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kullanıcı Yönetimi
                </CardTitle>
                <CardDescription>
                  Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Kullanıcı ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Rol seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Roller</SelectItem>
                      <SelectItem value="customer">Müşteri</SelectItem>
                      <SelectItem value="printer">Matbaa</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kullanıcı</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Firma</TableHead>
                        <TableHead>Kayıt Tarihi</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                            Yükleniyor...
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Kullanıcı bulunamadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user: any) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                                  <div className="text-sm text-gray-500">{user.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>{user.companyName || 'Belirtilmemiş'}</TableCell>
                            <TableCell>
                              {user.createdAt ? format(new Date(user.createdAt), 'dd.MM.yyyy', { locale: tr }) : 'Bilinmiyor'}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setSelectedUserDialog(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Detayları Görüntüle
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setSelectedUserDialog(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Düzenle
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => {
                                      if (confirm(`${user.firstName} ${user.lastName} kullanıcısını silmek istediğinizden emin misiniz?`)) {
                                        deleteUserMutation.mutate(user.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Sil
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Verifications */}
          <TabsContent value="verifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Firma Doğrulama
                </CardTitle>
                <CardDescription>
                  Bekleyen firma doğrulama taleplerini inceleyin ve onaylayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                {verificationsLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Yükleniyor...
                  </div>
                ) : !Array.isArray(pendingVerifications) || pendingVerifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bekleyen doğrulama yok</h3>
                    <p className="text-gray-600">Tüm firma doğrulamaları tamamlanmış</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {pendingVerifications.map((verification: any) => (
                      <Card key={verification.id} className="border-2 border-yellow-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{verification.companyName}</h3>
                              <p className="text-sm text-gray-600">{verification.email}</p>
                              <p className="text-sm text-gray-600">{verification.phone}</p>
                            </div>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Beklemede
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label className="text-sm font-medium">Vergi Numarası</Label>
                              <p className="text-sm text-gray-900">{verification.taxNumber || 'Belirtilmemiş'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Adres</Label>
                              <p className="text-sm text-gray-900">{verification.address || 'Belirtilmemiş'}</p>
                            </div>
                          </div>

                          {verification.documents && verification.documents.length > 0 && (
                            <div className="mb-4">
                              <Label className="text-sm font-medium mb-2 block">Yüklenen Belgeler</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {verification.documents.map((doc: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{doc.name}</span>
                                    <Button size="sm" variant="ghost" onClick={() => window.open(doc.url, '_blank')}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCompany(verification);
                                setVerificationDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              İncele
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                verifyCompanyMutation.mutate({
                                  companyId: verification.id,
                                  status: 'rejected',
                                  notes: 'Admin tarafından reddedildi'
                                });
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reddet
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                verifyCompanyMutation.mutate({
                                  companyId: verification.id,
                                  status: 'approved',
                                  notes: 'Admin tarafından onaylandı'
                                });
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Onayla
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sistem İstatistikleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Aktif Kullanıcılar</span>
                      <span className="text-lg font-bold text-blue-600">{systemStats.activeUsers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Toplam Yükleme</span>
                      <span className="text-lg font-bold text-green-600">{systemStats.totalUploads || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">İşlenen İşler</span>
                      <span className="text-lg font-bold text-purple-600">{systemStats.processedJobs || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Son Aktiviteler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemStats.recentActivities?.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-2">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-center text-gray-500 py-4">Henüz aktivite yok</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quotes Management */}
          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>Teklif Yönetimi</CardTitle>
                <CardDescription>Sistemdeki tüm teklifler</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Teklif yönetimi geliştiriliyor...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Yönetimi</CardTitle>
                <CardDescription>Sistemdeki tüm siparişler</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Sipariş yönetimi geliştiriliyor...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Detail Dialog */}
        <Dialog open={selectedUserDialog} onOpenChange={setSelectedUserDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Kullanıcı Detayları</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ad</Label>
                    <Input value={selectedUser.firstName} readOnly />
                  </div>
                  <div>
                    <Label>Soyad</Label>
                    <Input value={selectedUser.lastName} readOnly />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={selectedUser.email} readOnly />
                </div>
                <div>
                  <Label>Firma</Label>
                  <Input value={selectedUser.companyName || ''} readOnly />
                </div>
                <div>
                  <Label>Rol</Label>
                  <div className="mt-2">{getRoleBadge(selectedUser.role)}</div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUserDialog(false)}>
                Kapat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Verification Dialog */}
        <Dialog open={verificationDialog} onOpenChange={setVerificationDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Firma Doğrulama İncelemesi</DialogTitle>
            </DialogHeader>
            {selectedCompany && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Firma Adı</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded">{selectedCompany.companyName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded">{selectedCompany.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Telefon</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded">{selectedCompany.phone || 'Belirtilmemiş'}</p>
                  </div>
                  <div>
                    <Label>Vergi Numarası</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded">{selectedCompany.taxNumber || 'Belirtilmemiş'}</p>
                  </div>
                </div>

                <div>
                  <Label>Adres</Label>
                  <p className="mt-1 p-2 bg-gray-50 rounded">{selectedCompany.address || 'Belirtilmemiş'}</p>
                </div>

                {selectedCompany.documents && selectedCompany.documents.length > 0 && (
                  <div>
                    <Label>Belgeler</Label>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {selectedCompany.documents.map((doc: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <span>{doc.name}</span>
                          <Button size="sm" variant="outline" onClick={() => window.open(doc.url, '_blank')}>
                            <Download className="h-4 w-4 mr-2" />
                            İndir
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setVerificationDialog(false)}>
                İptal
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  verifyCompanyMutation.mutate({
                    companyId: selectedCompany?.id,
                    status: 'rejected',
                    notes: 'Admin tarafından reddedildi'
                  });
                }}
              >
                Reddet
              </Button>
              <Button
                onClick={() => {
                  verifyCompanyMutation.mutate({
                    companyId: selectedCompany?.id,
                    status: 'approved',
                    notes: 'Admin tarafından onaylandı'
                  });
                }}
              >
                Onayla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}