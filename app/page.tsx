import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, Settings, UserCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sistem P2H</h1>
          <p className="text-xl text-gray-600 mb-8">Pelaksanaan Perawatan Harian - Sistem Manajemen Inspeksi Kendaraan</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <ClipboardCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Form P2H</CardTitle>
              <CardDescription>Isi form pemeriksaan harian kendaraan</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/driver/login">
                {' '}
                {/* Changed to driver login */}
                <Button className="w-full">Mulai Inspeksi</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>Kelola data kendaraan dan maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/login">
                <Button className="w-full ">Login Admin</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <UserCheck className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Pengawas</CardTitle>
              <CardDescription>Review dan approve form P2H Driver</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pengawas/login">
                <Button className="w-full ">Login Pengawas</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
