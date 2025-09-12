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

export default function DriverLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '', // Changed from nik to username for generic login
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/auth/driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const result = await response.json();
        const profile = result?.data || {};
        // Store driver session and profile
        localStorage.setItem('is_driver_logged_in', 'true');
        localStorage.setItem('driver_profile', JSON.stringify({
          id: profile.id,
          name: profile.name,
          nik: profile.nik,
          username: profile.username,
        }));
        router.push('/driver/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Username atau password salah!');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Terjadi kesalahan saat login.');
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
            <CardTitle className="text-center">Login Driver</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
