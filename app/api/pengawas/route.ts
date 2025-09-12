import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('search') || '').trim();

    let query = supabase.from('pengawas').select('id, name').order('name', { ascending: true });

    if (q) {
      query = query.ilike('name', `%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (e: any) {
    console.error('[GET /api/pengawas]', e);
    return NextResponse.json({ success: false, message: e?.message ?? 'Internal server error' }, { status: 500 });
  }
}
