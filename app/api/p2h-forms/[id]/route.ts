import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: Promise<{ formId: string }> }) {
  try {
    const { formId } = await params;

    const { data, error } = await supabase
      .from('p2h_form_details')
      .select(
        `
        *,
        inspection_items (
          id,
          description,
          danger_code,
          category
        )
      `
      )
      .eq('p2h_form_id', formId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inspections' }, { status: 500 });
  }
}