// app/api/pengawas/p2h-detail/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Ambil form header
    const { data: form, error: formError } = await supabase
      .from('p2h_forms')
      .select(
        `
        id,
        driver_id,
        driver_nik,
        pengawas_id,
        vehicle_id,
        inspection_date,
        shift,
        hm_km_awal,
        status,
        created_at,
        updated_at,
        drivers ( name, nik ),
        pengawas ( name ),
        vehicles (
          vehicle_number,
          vehicle_types (
            name
          )
        )
      `
      )
      .eq('id', id)
      .single();

    if (formError || !form) {
      console.error('Form not found:', formError);
      return NextResponse.json({ error: 'P2H form not found' }, { status: 404 });
    }

    // Ambil detail pemeriksaan
    const { data: inspections, error: inspectionsError } = await supabase
      .from('p2h_form_details')
      .select(
        `
        id,
        condition,
        notes,
        inspection_items ( category, description )
      `
      )
      .eq('p2h_form_id', id);

    if (inspectionsError) {
      console.error('Error fetching inspections:', inspectionsError);
      return NextResponse.json({ error: 'Failed to fetch inspections' }, { status: 500 });
    }

    // Format response
    const detail = {
      id: form.id,
      driver_name: form.drivers?.name || null,
      driver_nik: form.drivers?.nik || form.driver_nik || null,
      vehicle_number: form.vehicles?.vehicle_number || null,
      vehicle_type: form.vehicles?.vehicle_types?.name || null,
      inspection_date: form.date,
      shift: form.shift,
      hm_km_awal: form.hm_km_awal,
      pengawas_name: form.pengawas?.name || null,
      status: form.status,
      created_at: form.created_at,
      inspections:
        inspections?.map((i) => ({
          id: i.id,
          inspection_item: {
            category: i.inspection_items?.category || null,
            description: i.inspection_items?.description || null,
          },
          condition: i.condition,
          notes: i.notes,
        })) || [],
    };

    return NextResponse.json(detail);
  } catch (error) {
    console.error('Failed to fetch P2H detail:', error);
    return NextResponse.json({ error: 'Failed to fetch P2H detail' }, { status: 500 });
  }
}
