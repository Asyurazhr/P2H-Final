// app/pengawas/login/page.tsx
'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PengawasLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/pengawas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.success) {
        // Store detailed session data untuk personalisasi dashboard
        localStorage.setItem(
          'pengawas_session',
          JSON.stringify({
            isLoggedIn: true,
            user: data.data,
            loginTime: new Date().toISOString(),
          })
        );

        console.log('Pengawas login successful:', data.data.name);
        router.push('/pengawas/dashboard');
      } else {
        setError(data.message || 'Username atau password salah!');
      }
    } catch (err) {
      console.error('Pengawas login error:', err);
      setError('Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login Pengawas</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} disabled={isLoading} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} disabled={isLoading} required />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Login...' : 'Login'}
              </Button>
            </form>

            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>Gunakan username dan password yang telah diberikan</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
