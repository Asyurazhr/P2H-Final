import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { p2h_form_id, inspections } = body;

    console.log('Form ID:', p2h_form_id);
    console.log('Processing', inspections.length, 'inspections');

    const insertPayload = inspections.map((inspection: any) => ({
      p2h_form_id: p2h_form_id, // Sesuai dengan schema DB
      inspection_item_id: inspection.inspection_item_id,
      condition: inspection.condition, // Langsung 'baik' atau 'rusak' sesuai CHECK constraint
      notes: inspection.notes || null,
    }));

    console.log('Sample payload:', JSON.stringify(insertPayload[0], null, 2));

    // PERBAIKAN: Ganti nama tabel dari 'p2h_inspections' ke 'p2h_form_details'
    const { data, error } = await supabase
      .from('p2h_form_details') // ← INI YANG DIPERBAIKI
      .insert(insertPayload);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          details: error.details,
        },
        { status: 400 }
      );
    }

    console.log('Insert successful');
    const hasIssues = inspections.some((i: any) => i.condition === 'rusak');

    return NextResponse.json({
      success: true,
      has_issues: hasIssues,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save inspections',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}