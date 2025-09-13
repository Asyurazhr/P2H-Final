import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const err = (s: number, m: string) => NextResponse.json({ error: m }, { status: s });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const status = (body?.status ?? '').trim();

    if (!id || !status) return err(400, 'ID dan status diperlukan');

    const { data, error } = await supabase.from('vehicles').update({ status }).eq('id', id).select('id, vehicle_number, status').single();

    if (error) return err(400, error.message);

    return NextResponse.json(data);
  } catch (e: any) {
    console.error('[PATCH vehicle]', e);
    return err(500, e?.message || 'Gagal update kendaraan');
  }
}
