'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface P2HForm {
  id: number;
  driver_name: string;
  driver_nik: string;
  inspection_date: string;
  shift: string;
  vehicle_type_id: number;
  vehicle_id: number;
  hm_km_awal: number | null;
  pengawas_name: string;
  status: string;
  created_at: string;
}

interface VehicleType {
  id: number;
  name: string;
}

interface Vehicle {
  id: number;
  vehicle_number: string;
  vehicle_type_id: number;
}

export default function SubmissionSuccessPage() {
  const searchParams = useSearchParams();
  const formId = searchParams.get('formId');
  const [formDetail, setFormDetail] = useState<P2HForm | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDriverLoggedIn, setIsDriverLoggedIn] = useState(false);

  useEffect(() => {
    // Check for generic driver login flag
    const isLoggedIn = localStorage.getItem('is_driver_logged_in');
    if (isLoggedIn === 'true') {
      setIsDriverLoggedIn(true);
    } else {
      setIsDriverLoggedIn(false);
    }

    const fetchData = async () => {
      if (formId) {
        try {
          const [formRes, vehicleTypesRes, vehiclesRes] = await Promise.all([
            fetch(`/api/p2h-forms/${formId}`), // Fix: Use backticks for the URL
            fetch('/api/vehicle-types'),
            fetch('/api/vehicles')
          ]);

          const form = await formRes.json();
          const types = await vehicleTypesRes.json();
          const vehs = await vehiclesRes.json();

          setFormDetail(form);
          setVehicleTypes(types);
          setVehicles(vehs);
        } catch (error) {
          console.error('Error fetching form details or master data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [formId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!formDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
        <Card className="max-w-md w-full text-center p-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-red-600">Form Tidak Ditemukan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Detail form P2H tidak dapat dimuat.</p>
            <Link href="/">
              <Button>Kembali ke Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const vehicleType = vehicleTypes.find((type) => type.id === formDetail.vehicle_type_id)?.name || 'N/A';
  const vehicleNumber = vehicles.find((veh) => veh.id === formDetail.vehicle_id)?.vehicle_number || 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Form P2H Berhasil Disubmit!</h1>
          <p className="text-lg text-gray-600 mb-8">Terima kasih telah mengisi form P2H. Data Anda telah berhasil dikirim dan menunggu verifikasi dari pengawas.</p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Pernyataan Operator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p>
                    <strong>Nama Driver:</strong> {formDetail.driver_name || 'N/A'}
                  </p>
                  <p>
                    <strong>NIK Driver:</strong> {formDetail.driver_nik || 'N/A'}
                  </p>
                  <p>
                    <strong>Hari/Tanggal:</strong>{' '}
                    {new Date(formDetail.inspection_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p>
                    <strong>Shift:</strong> {formDetail.shift || 'N/A'}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Type Alat:</strong> {vehicleType}
                  </p>
                  <p>
                    <strong>No Alat:</strong> {vehicleNumber}
                  </p>
                  <p>
                    <strong>HM/KM Awal:</strong> {formDetail.hm_km_awal?.toLocaleString() || 'N/A'}
                  </p>
                  <p>
                    <strong>Nama Pengawas:</strong> {formDetail.pengawas_name || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Menunggu Verifikasi Pengawas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600 mb-4">Form Anda sedang dalam proses review oleh pengawas. Mohon tunggu hingga proses verifikasi selesai.</p>
              <p className="text-blue-600 font-semibold">Silakan cek dashboard driver secara berkala untuk melihat status terbaru form Anda.</p>
            </CardContent>
          </Card>

          <Link href={isDriverLoggedIn ? '/driver/dashboard' : '/'}>
            <Button size="lg">Kembali ke Halaman Utama</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
