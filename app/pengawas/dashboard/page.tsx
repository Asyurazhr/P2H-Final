'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
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
}

interface PengawasUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

export default function PengawasDashboardPage() {
  const router = useRouter();
  const [p2hForms, setP2hForms] = useState<P2HForm[]>([]);
  const [loading, setLoading] = useState(false); // Changed to false since we'll use mock data for now
  const [pengawasData, setPengawasData] = useState<PengawasUser | null>(null);

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

      // For now, load mock data instead of API call
      loadMockData(session.user.id);
    } catch (error) {
      console.error('Error parsing session:', error);
      router.push('/pengawas/login');
    }
  }, [router]);

  const loadMockData = (pengawasId: string) => {
    // Mock data untuk testing - nanti diganti dengan API call
    const mockForms: P2HForm[] = [
      {
        id: 1,
        driver_name: 'Budi Santoso',
        driver_nik: '3201234567890123',
        vehicle_number: 'B 1234 CD',
        vehicle_type: 'Truck',
        inspection_date: '2024-01-15',
        shift: 'pagi',
        hm_km_awal: 15000,
        status: 'pending',
        has_issues: true,
        created_at: '2024-01-15T08:30:00Z',
      },
      {
        id: 2,
        driver_name: 'Andi Wijaya',
        driver_nik: '3201234567890124',
        vehicle_number: 'B 5678 EF',
        vehicle_type: 'Bus',
        inspection_date: '2024-01-15',
        shift: 'siang',
        hm_km_awal: 22000,
        status: 'pending',
        has_issues: false,
        created_at: '2024-01-15T10:15:00Z',
      },
      {
        id: 3,
        driver_name: 'Sari Dewi',
        driver_nik: '3201234567890125',
        vehicle_number: 'B 9012 GH',
        vehicle_type: 'Van',
        inspection_date: '2024-01-14',
        shift: 'pagi',
        hm_km_awal: 8500,
        status: 'approved',
        has_issues: false,
        created_at: '2024-01-14T07:45:00Z',
      },
      {
        id: 4,
        driver_name: 'Joko Susilo',
        driver_nik: '3201234567890126',
        vehicle_number: 'B 3456 IJ',
        vehicle_type: 'Truck',
        inspection_date: '2024-01-14',
        shift: 'siang',
        hm_km_awal: 18200,
        status: 'rejected',
        has_issues: true,
        created_at: '2024-01-14T14:20:00Z',
      },
    ];

    setP2hForms(mockForms);
    setLoading(false);
  };

  const updateFormStatus = async (formId: number, status: string) => {
    try {
      // For now, just update local state - nanti diganti dengan API call
      setP2hForms((prevForms) => prevForms.map((form) => (form.id === formId ? { ...form, status } : form)));

      alert(`Form berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating form status');
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Logout
          </Button>
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
              <div className="text-2xl font-bold text-yellow-600">{pendingForms.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{processedForms.filter((f) => f.status === 'approved').length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{processedForms.filter((f) => f.status === 'rejected').length}</div>
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
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getStatusBadge(form.status)}
                          {form.has_issues && <Badge variant="destructive">Ada Masalah</Badge>}
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <Button size="sm" variant="outline" disabled>
                          Review Detail (Coming Soon)
                        </Button>
                        <Button size="sm" onClick={() => updateFormStatus(form.id, 'approved')} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Setujui
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateFormStatus(form.id, 'rejected')}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Tolak
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
                      </div>
                      <div className="flex items-center space-x-2">
                        {form.has_issues && <Badge variant="destructive">Ada Masalah</Badge>}
                        {getStatusBadge(form.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Debug Info - hapus ini nanti */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">✅ Login Berhasil!</h4>
          <p className="text-blue-700 text-sm">
            Dashboard berhasil dimuat untuk: {pengawasData.name} ({pengawasData.username})
          </p>
          <p className="text-blue-600 text-xs mt-1">Mock data ditampilkan. Data akan berbeda untuk setiap pengawas setelah API terintegrasi.</p>
        </div>
      </div>
    </div>
  );
}
