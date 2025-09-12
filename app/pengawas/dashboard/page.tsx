'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface P2HForm {
  id: number;
  driver_name: string;
  driver_nik: string;
  vehicle_number: string;
  vehicle_type: string;
  inspection_date: string;
  shift: string;
  hm_km_awal: number;
  status: string;
  has_issues: boolean;
  created_at: string;
  updated_at: string;
  pengawas_name: string;
}

interface DashboardStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

interface PengawasUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface DashboardData {
  forms: P2HForm[];
  stats: DashboardStats;
}

export default function PengawasDashboardPage() {
  const router = useRouter();
  const [p2hForms, setP2hForms] = useState<P2HForm[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [pengawasData, setPengawasData] = useState<PengawasUser | null>(null);
  const [processingFormId, setProcessingFormId] = useState<number | null>(null);

  useEffect(() => {
    // Check session dan ambil data pengawas
    const sessionData = localStorage.getItem('pengawas_session');

    if (!sessionData) {
      router.push('/pengawas/login');
      return;
    }

    try {
      const session = JSON.parse(sessionData);

      if (!session.isLoggedIn || !session.user) {
        router.push('/pengawas/login');
        return;
      }

      setPengawasData(session.user);
      loadDashboardData(session.user.id);
    } catch (error) {
      console.error('Error parsing session:', error);
      router.push('/pengawas/login');
    }
  }, [router]);

  const loadDashboardData = async (pengawasId: string) => {
    try {
      setLoading(true);
      console.log('Loading dashboard for pengawas:', pengawasId);

      const response = await fetch(`/api/pengawas/dashboard?pengawas_id=${pengawasId}`);
      console.log('API Response status:', response.status);

      const result = await response.json();
      console.log('API Response data:', result);

      if (result.success) {
        setP2hForms(result.data.forms);
        setStats(result.data.stats);
        console.log('Dashboard data loaded successfully:', result.data);
      } else {
        console.error('Failed to load dashboard data:', result);
        alert(`Error loading dashboard: ${result.error || 'Unknown error'}`);
        // Fallback to empty data
        setP2hForms([]);
        setStats({ pending: 0, approved: 0, rejected: 0, total: 0 });
      }
    } catch (error) {
      console.error('Network error loading dashboard data:', error);
      alert(`Network error: ${error instanceof Error ? error.message : 'Failed to fetch'}`);
      // Fallback to empty data
      setP2hForms([]);
      setStats({ pending: 0, approved: 0, rejected: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const updateFormStatus = async (formId: number, status: string) => {
    if (!pengawasData) return;

    const confirmMessage = status === 'approved' ? 'Apakah Anda yakin ingin menyetujui form P2H ini?' : 'Apakah Anda yakin ingin menolak form P2H ini?';

    if (!confirm(confirmMessage)) return;

    let rejectionReason = null;
    if (status === 'rejected') {
      rejectionReason = prompt('Masukkan alasan penolakan (opsional):');
    }

    try {
      setProcessingFormId(formId);

      const response = await fetch(`/api/pengawas/forms/${formId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
          pengawas_id: pengawasData.id,
          rejection_reason: rejectionReason,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setP2hForms((prevForms) => prevForms.map((form) => (form.id === formId ? { ...form, status, updated_at: new Date().toISOString() } : form)));

        // Update stats
        setStats((prevStats) => {
          const newStats = { ...prevStats };
          const currentForm = p2hForms.find((f) => f.id === formId);

          if (currentForm?.status === 'pending') {
            newStats.pending -= 1;
          }

          if (status === 'approved') {
            newStats.approved += 1;
          } else if (status === 'rejected') {
            newStats.rejected += 1;
          }

          return newStats;
        });

        alert(`Form berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
      } else {
        alert(`Error: ${result.message || 'Gagal memperbarui status form'}`);
      }
    } catch (error) {
      console.error('Error updating form status:', error);
      alert('Error: Gagal memperbarui status form');
    } finally {
      setProcessingFormId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Disetujui
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Ditolak
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pengawas_session');
    router.push('/pengawas/login');
  };

  const handleRefresh = () => {
    if (pengawasData) {
      loadDashboardData(pengawasData.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  if (!pengawasData) {
    return null;
  }

  const pendingForms = p2hForms.filter((form) => form.status === 'pending');
  const processedForms = p2hForms.filter((form) => form.status !== 'pending');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Refresh Data
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Dashboard Pengawas</h1>
            <p className="text-gray-600 text-sm mt-1">
              Selamat datang, <span className="font-semibold">{pengawasData.name}</span>
            </p>
          </div>
          <div></div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Pending Forms */}
          <Card>
            <CardHeader>
              <CardTitle>Form P2H Menunggu Review</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingForms.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Tidak ada form yang menunggu review</p>
              ) : (
                <div className="space-y-4">
                  {pendingForms.map((form) => (
                    <div key={form.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                        <div>
                          <h3 className="font-semibold text-lg">{form.driver_name}</h3>
                          <p className="text-sm text-gray-600">NIK: {form.driver_nik}</p>
                          <p className="text-sm text-gray-600">
                            {form.vehicle_type} - {form.vehicle_number}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(form.inspection_date).toLocaleDateString('id-ID')} - Shift {form.shift}
                          </p>
                          <p className="text-sm text-gray-600">HM/KM Awal: {form.hm_km_awal}</p>
                          <p className="text-xs text-gray-500">Dibuat: {new Date(form.created_at).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getStatusBadge(form.status)}
                          {form.has_issues && (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Ada Masalah
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <Link href={`/pengawas/p2h-detail/${form.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Review Detail
                          </Button>
                        </Link>
                        <Button size="sm" onClick={() => updateFormStatus(form.id, 'approved')} className="bg-green-600 hover:bg-green-700" disabled={processingFormId === form.id}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {processingFormId === form.id ? 'Processing...' : 'Setujui'}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateFormStatus(form.id, 'rejected')} disabled={processingFormId === form.id}>
                          <XCircle className="h-4 w-4 mr-1" />
                          {processingFormId === form.id ? 'Processing...' : 'Tolak'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* History Forms */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Form P2H</CardTitle>
            </CardHeader>
            <CardContent>
              {processedForms.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Belum ada riwayat form</p>
              ) : (
                <div className="space-y-4">
                  {processedForms.slice(0, 10).map((form) => (
                    <div key={form.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-2">
                      <div>
                        <h3 className="font-semibold">{form.driver_name}</h3>
                        <p className="text-sm text-gray-600">
                          {form.vehicle_type} - {form.vehicle_number}
                        </p>
                        <p className="text-sm text-gray-600">{new Date(form.inspection_date).toLocaleDateString('id-ID')}</p>
                        <p className="text-xs text-gray-500">Diperbarui: {new Date(form.updated_at).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex flex-col items-end space-x-0 space-y-1">
                        <div className="flex items-center space-x-2">
                          {form.has_issues && (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Ada Masalah
                            </Badge>
                          )}
                          {getStatusBadge(form.status)}
                        </div>
                        <Link href={`/pengawas/p2h-detail/${form.id}`}>
                          <Button size="sm" variant="ghost" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Lihat Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {processedForms.length > 10 && <p className="text-center text-gray-500 text-sm">Menampilkan 10 dari {processedForms.length} form</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Status Dashboard</h4>
          <p className="text-blue-700 text-sm">
            Dashboard pengawas: {pengawasData.name} ({pengawasData.username})
          </p>
          <p className="text-blue-700 text-sm">
            Total form: {stats.total} | Pending: {stats.pending} | Disetujui: {stats.approved} | Ditolak: {stats.rejected}
          </p>
          <p className="text-blue-600 text-xs mt-1">Data diambil langsung dari database. Refresh halaman untuk data terbaru.</p>
        </div>
      </div>
    </div>
  );
}
