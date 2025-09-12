'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type UUID = string;

interface InspectionItem {
  id: UUID;
  category: string;
  description: string;
  item_order?: number;
  danger_code?: string;
}

interface InspectionResult {
  inspection_item_id: UUID;
  condition: '' | 'baik' | 'rusak';
  notes: string;
}

export default function InspectionClient({ formId }: { formId: string }) {
  const router = useRouter();

  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
  const [inspectionResults, setInspectionResults] = useState<InspectionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDriverLoggedIn, setIsDriverLoggedIn] = useState(false);

  useEffect(() => {
    setIsDriverLoggedIn(!!localStorage.getItem('driver_id'));
    fetchInspectionItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchInspectionItems() {
    try {
      const res = await fetch('/api/inspection-items', { cache: 'no-store' });
      const json = await res.json().catch(() => []);
      const items: InspectionItem[] = Array.isArray(json) ? json : [];

      setInspectionItems(items);

      const initial: InspectionResult[] = items.map((it) => ({
        inspection_item_id: it.id,
        condition: '',
        notes: '',
      }));
      setInspectionResults(initial);
    } catch (e) {
      console.error('Error fetching inspection items:', e);
      setInspectionItems([]);
      setInspectionResults([]);
    } finally {
      setLoading(false);
    }
  }

  function updateInspectionResult(itemId: UUID, field: keyof InspectionResult, value: string) {
    setInspectionResults((prev) => prev.map((r) => (r.inspection_item_id === itemId ? { ...r, [field]: value as any } : r)));
  }

  // ======= PENTING: hitung sebelum guard, tanpa hook =======
  const items = Array.isArray(inspectionItems) ? inspectionItems : [];
  const categories: string[] = [...new Set(items.map((i) => i.category))];
  // =========================================================

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  async function handleSubmit() {
    const incomplete = inspectionResults.filter((r) => !r.condition);
    if (incomplete.length) {
      alert('Semua item harus dipilih kondisinya!');
      return;
    }
    const missingNotes = inspectionResults.filter((r) => r.condition === 'rusak' && !r.notes.trim());
    if (missingNotes.length) {
      alert('Catatan kerusakan wajib diisi untuk item yang rusak!');
      return;
    }

    try {
      const res = await fetch('/api/p2h-inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          p2h_form_id: formId, // UUID, jangan parseInt
          inspections: inspectionResults,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`Error submitting inspection${j?.error ? j.error : ''}`);
        return;
      }

      router.push(`/p2h/submission-success?formId=${encodeURIComponent(formId)}`);
    } catch (e) {
      console.error('submit error:', e);
      alert('Error submitting inspection');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href={isDriverLoggedIn ? '/driver/dashboard' : '/p2h/form'}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Item Yang Harus Diperiksa</CardTitle>
            </CardHeader>
          </Card>

          {categories.map((category, categoryIndex) => (
            <Card key={category} className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  {categoryIndex + 1}. {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Deskripsi</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Kondisi</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Kode Bahaya</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Catatan Kerusakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items
                        .filter((it) => it.category === category)
                        .map((it, idx) => {
                          const result = inspectionResults.find((r) => r.inspection_item_id === it.id);
                          const isRusak = result?.condition === 'rusak';
                          return (
                            <tr key={it.id}>
                              <td className="border border-gray-300 px-4 py-2 text-center">{idx + 1}</td>
                              <td className="border border-gray-300 px-4 py-2">{it.description}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                <div className="flex flex-col space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`baik-${it.id}`}
                                      checked={result?.condition === 'baik'}
                                      onCheckedChange={(checked) => {
                                        if (checked) updateInspectionResult(it.id, 'condition', 'baik');
                                      }}
                                    />
                                    <label htmlFor={`baik-${it.id}`} className="text-sm">
                                      Baik/Normal
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`rusak-${it.id}`}
                                      checked={isRusak}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          updateInspectionResult(it.id, 'condition', 'rusak');
                                        } else {
                                          updateInspectionResult(it.id, 'condition', '');
                                          updateInspectionResult(it.id, 'notes', '');
                                        }
                                      }}
                                    />
                                    <label htmlFor={`rusak-${it.id}`} className="text-sm">
                                      Rusak/Tidak Normal
                                    </label>
                                  </div>
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                <span
                                  className={cn(
                                    'inline-block px-2 py-1 rounded text-xs font-bold',
                                    it.danger_code === 'AA' ? 'bg-red-100 text-red-800' : it.danger_code === 'A' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                  )}
                                >
                                  {it.danger_code || '-'}
                                </span>
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <Textarea
                                  placeholder="Catatan (jika ada kerusakan)"
                                  value={result?.notes || ''}
                                  onChange={(e) => updateInspectionResult(it.id, 'notes', e.target.value)}
                                  className={cn('min-h-[60px]', isRusak && !result?.notes.trim() && 'border-red-500 ring-red-500 ring-1')}
                                  required={isRusak}
                                />
                                {isRusak && !result?.notes.trim() && <p className="text-red-500 text-xs mt-1">Catatan kerusakan wajib diisi.</p>}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-center">
            <Button onClick={handleSubmit} size="lg" className="px-8" disabled={inspectionItems.length === 0}>
              <CheckCircle className="h-5 w-5 mr-2" />
              Submit Form P2H
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
