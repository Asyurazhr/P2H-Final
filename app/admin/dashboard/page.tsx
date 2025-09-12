'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Settings, Wrench, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';
import { SearchInput } from '@/components/SearchInput';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Vehicle {
  id: number;
  vehicle_number: string;
  status: string;
  vehicle_type: string;
  last_p2h_date?: string;
  has_p2h_today: boolean;
}

interface P2HForm {
  id: number;
  driver_name: string;
  vehicle_number: string;
  inspection_date: string;
  status: string;
  has_issues: boolean;
}

interface P2HDetail {
  id: number;
  driver_name: string;
  driver_nik: string;
  vehicle_number: string;
  vehicle_type: string;
  inspection_date: string;
  shift: string;
  hm_km_awal: number;
  pengawas_name: string;
  status: string;
  inspections: Array<{
    category: string;
    description: string;
    condition: string;
    notes: string;
  }>;
}

// --- helper untuk normalisasi JSON ke array ---
const toArray = (json: any): any[] => {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.forms)) return json.forms;
  if (json && typeof json === 'object') return Object.values(json);
  return [];
};

export default function AdminDashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [p2hForms, setP2hForms] = useState<P2HForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedP2H, setSelectedP2H] = useState<P2HDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = vehicles.filter(
      (v) =>
        v.vehicle_number.toLowerCase().includes(term) ||
        v.vehicle_type.toLowerCase().includes(term)
    );
    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm]);

  const fetchData = async () => {
    try {
      const [vehiclesRes, formsRes] = await Promise.all([
        fetch('/api/admin/vehicles', { cache: 'no-store' }),
        fetch('/api/admin/p2h-forms', { cache: 'no-store' }),
      ]);

      // Vehicles
      if (!vehiclesRes.ok) {
        console.error('Vehicles API error:', vehiclesRes.status, vehiclesRes.statusText);
        setVehicles([]); // fallback array
      } else {
        const vehiclesJson = await vehiclesRes.json().catch(() => []);
        setVehicles(toArray(vehiclesJson) as Vehicle[]);
      }

      // P2H forms
      if (!formsRes.ok) {
        console.error('P2H API error:', formsRes.status, formsRes.statusText);
        setP2hForms([]); // fallback array biar .filter nggak meledak
      } else {
        const formsJson = await formsRes.json().catch(() => []);
        setP2hForms(toArray(formsJson) as P2HForm[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setVehicles([]);
      setP2hForms([]);
    } finally {
      setLoading(false);
    }
  };

  const updateVehicleStatus = async (vehicleId: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchData();
      } else {
        alert('Error updating vehicle status');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating vehicle status');
    }
  };

  const updateP2HStatus = async (formId: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/p2h-forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchData();
        alert(`P2H form status updated to ${status}`);
      } else {
        alert('Error updating P2H form status');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating P2H form status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Tersedia</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-100 text-red-800">Tidak Tersedia</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const fetchP2HDetail = async (formId: number) => {
    try {
      const response = await fetch(`/api/admin/p2h-detail/${formId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const detail = (await response.json()) as P2HDetail;
      setSelectedP2H(detail);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching P2H detail:', error);
      alert('Error loading P2H detail');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // --- aman karena p2hForms & vehicles dijamin array ---
  const todayP2H = vehicles.filter((v) => v.has_p2h_today);
  const notTodayP2H = vehicles.filter((v) => !v.has_p2h_today);
  const issueVehicles = p2hForms.filter((form) => form.has_issues && form.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
          <Link href="/">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Link href="/admin/manage">
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Kelola Data
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sudah P2H Hari Ini</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{todayP2H.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum P2H Hari Ini</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{notTodayP2H.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {p2hForms.filter((form) => form.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ada Masalah</CardTitle>
              <Wrench className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{issueVehicles.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="not-p2h" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-4">
            <TabsTrigger value="not-p2h">Belum P2H Hari Ini</TabsTrigger>
            <TabsTrigger value="completed-p2h">Sudah P2H Hari Ini</TabsTrigger>
            <TabsTrigger value="pending-approval">Menunggu Persetujuan</TabsTrigger>
            <TabsTrigger value="issues">Unit Bermasalah</TabsTrigger>
          </TabsList>

          <TabsContent value="not-p2h">
            <Card>
              <CardHeader>
                <CardTitle>Unit Belum P2H Hari Ini</CardTitle>
                <div className="flex items-center space-x-2">
                  {/* fix typo: buang \" yang nyangkut */}
                  <SearchInput
                    placeholder="Cari unit..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    className="w-full max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredVehicles.filter((v) => !v.has_p2h_today).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {searchTerm ? 'Tidak ada unit yang sesuai pencarian' : 'Semua unit sudah P2H hari ini'}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredVehicles
                      .filter((v) => !v.has_p2h_today)
                      .map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2"
                        >
                          <div>
                            <h3 className="font-semibold">{vehicle.vehicle_number}</h3>
                            <p className="text-sm text-gray-600">Type: {vehicle.vehicle_type}</p>
                            <p className="text-sm text-red-600">Belum P2H hari ini</p>
                          </div>
                          <Badge className="bg-red-100 text-red-800">Belum P2H</Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed-p2h">
            <Card>
              <CardHeader>
                <CardTitle>Unit Sudah P2H Hari Ini</CardTitle>
                <div className="flex items-center space-x-2">
                  <SearchInput
                    placeholder="Cari unit..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    className="w-full max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredVehicles.filter((v) => v.has_p2h_today).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {searchTerm ? 'Tidak ada unit yang sesuai pencarian' : 'Belum ada unit yang P2H hari ini'}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredVehicles
                      .filter((v) => v.has_p2h_today)
                      .map((vehicle) => {
                        const p2hForm = p2hForms.find(
                          (form) => form.vehicle_number === vehicle.vehicle_number
                        );
                        return (
                          <div
                            key={vehicle.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2"
                          >
                            <div>
                              <h3 className="font-semibold">{vehicle.vehicle_number}</h3>
                              <p className="text-sm text-gray-600">Type: {vehicle.vehicle_type}</p>
                              <p className="text-sm text-green-600">
                                Sudah P2H: {vehicle.last_p2h_date}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-800">Sudah P2H</Badge>
                              {p2hForm && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => fetchP2HDetail(p2hForm.id)}
                                >
                                  Detail
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending-approval">
            <Card>
              <CardHeader>
                <CardTitle>Form P2H Menunggu Persetujuan</CardTitle>
              </CardHeader>
              <CardContent>
                {p2hForms.filter((form) => form.status === 'pending').length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Tidak ada form P2H yang menunggu persetujuan
                  </p>
                ) : (
                  <div className="space-y-4">
                    {p2hForms
                      .filter((form) => form.status === 'pending')
                      .map((form) => (
                        <div
                          key={form.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2"
                        >
                          <div>
                            <h3 className="font-semibold">{form.vehicle_number}</h3>
                            <p className="text-sm text-gray-600">Driver: {form.driver_name}</p>
                            <p className="text-sm text-gray-600">
                              Tanggal: {new Date(form.inspection_date).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => fetchP2HDetail(form.id)}>
                              Detail
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateP2HStatus(form.id, 'approved')}
                            >
                              Setujui
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateP2HStatus(form.id, 'rejected')}
                            >
                              Tolak
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>Unit Bermasalah</CardTitle>
              </CardHeader>
              <CardContent>
                {issueVehicles.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Tidak ada unit bermasalah</p>
                ) : (
                  <div className="space-y-4">
                    {issueVehicles.map((form) => (
                      <div
                        key={form.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-2"
                      >
                        <div>
                          <h3 className="font-semibold">{form.vehicle_number}</h3>
                          <p className="text-sm text-gray-600">Driver: {form.driver_name}</p>
                          <p className="text-sm text-gray-600">
                            Tanggal: {new Date(form.inspection_date).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const vehicleId = vehicles.find(
                                (v) => v.vehicle_number === form.vehicle_number
                              )?.id;
                              if (vehicleId) updateVehicleStatus(vehicleId, 'maintenance');
                            }}
                          >
                            <Wrench className="h-4 w-4 mr-1" />
                            Perbaiki
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Form P2H</DialogTitle>
            </DialogHeader>
            {selectedP2H && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p><strong>Driver:</strong> {selectedP2H.driver_name}</p>
                    <p><strong>NIK:</strong> {selectedP2H.driver_nik}</p>
                    <p><strong>Kendaraan:</strong> {selectedP2H.vehicle_type} - {selectedP2H.vehicle_number}</p>
                  </div>
                  <div>
                    <p><strong>Tanggal:</strong> {new Date(selectedP2H.inspection_date).toLocaleDateString('id-ID')}</p>
                    <p><strong>Shift:</strong> {selectedP2H.shift}</p>
                    <p><strong>HM/KM Awal:</strong> {selectedP2H.hm_km_awal}</p>
                    <p><strong>Pengawas:</strong> {selectedP2H.pengawas_name}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Hasil Pemeriksaan</h3>
                  {selectedP2H.inspections && selectedP2H.inspections.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Kategori</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Deskripsi</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Kondisi</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Catatan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedP2H.inspections.map((inspection, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2 text-sm">{inspection.category}</td>
                              <td className="border border-gray-300 px-4 py-2">{inspection.description}</td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                <Badge className={inspection.condition === 'baik' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                  {inspection.condition === 'baik' ? 'Baik/Normal' : 'Rusak/Tidak Normal'}
                                </Badge>
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{inspection.notes || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">Tidak ada data pemeriksaan</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
