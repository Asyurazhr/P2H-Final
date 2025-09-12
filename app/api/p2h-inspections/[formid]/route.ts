// File: /api/p2h-inspections/[formId]/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: Promise<{ formId: string }> }) {
  try {
    const { formId } = await params;

    // Join p2h_form_details dengan inspection_items untuk get kode bahaya
    const { data, error } = await supabase
      .from('p2h_form_details')
      .select(
        `
        id,
        p2h_form_id,
        condition,
        notes,
        created_at,
        inspection_items (
          id,
          description,
          danger_code,
          category,
          order_number
        )
      `
      )
      .eq('p2h_form_id', formId)
      .order('inspection_items(order_number)', { ascending: true });

    if (error) {
      console.error('Error fetching inspection results:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Transform data untuk mudah digunakan di frontend
    const transformedData = data?.map((item) => ({
      id: item.id,
      p2h_form_id: item.p2h_form_id,
      condition: item.condition,
      notes: item.notes,
      created_at: item.created_at,
      inspection_item: item.inspection_items,
      // Tampilkan kode bahaya hanya jika kondisi rusak
      show_danger_code: item.condition === 'rusak',
    }));

    return NextResponse.json({
      success: true,
      data: transformedData || [],
      count: transformedData?.length || 0,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch inspection results',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}