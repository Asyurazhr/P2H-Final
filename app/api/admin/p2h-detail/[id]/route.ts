import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const formId = Number.parseInt(params.id);

    // Get P2H form with related data
    const { data: form, error: formError } = await supabase
      .from('p2h_forms')
      .select(
        `
    id,
    driver_id,
    driver_nik,
    pengawas_id,
    vehicle_id,
    date,
    shift,
    hm_km_awal,
    status,
    created_at,
    updated_at,
    drivers ( name, nik ),
    pengawas ( name ),
    vehicles ( vehicle_number ),
    vehicle_types ( name )
  `
      )
      .eq('id', formId)
      .single();

    if (formError || !form) {
      return NextResponse.json({ error: 'P2H form not found' }, { status: 404 });
    }

    // Get inspection results for this form
    const { data: inspections, error: inspectionsError } = await supabase
      .from('p2h_inspections')
      .select(
        `
        condition,
        notes,
        inspection_items!p2h_inspections_inspection_item_id_fkey (
          category,
          description
        )
      `
      )
      .eq('p2h_form_id', formId);

    if (inspectionsError) {
      console.error('Error fetching inspections:', inspectionsError);
    }

    const transformedInspections = (inspections || []).map((inspection: any) => ({
      category: inspection.inspection_items?.category || 'Unknown Category',
      description: inspection.inspection_items?.description || 'Unknown Description',
      condition: inspection.condition,
      notes: inspection.notes || '',
    }));

    const detail = {
      id: form.id,
      driver_name: form.users?.driver_name || 'Unknown Driver',
      driver_nik: form.driver_nik,
      vehicle_number: form.vehicles?.vehicle_number || 'Unknown Vehicle',
      vehicle_type: form.vehicles?.vehicle_types?.vehicle_type || 'Unknown Type',
      inspection_date: form.inspection_date,
      shift: form.shift,
      hm_km_awal: form.hm_km_awal,
      pengawas_name: form.users?.pengawas_name || 'Unknown Pengawas',
      status: form.status,
      created_at: form.created_at,
      inspections: transformedInspections,
    };

    return NextResponse.json(detail);
  } catch (error) {
    console.error('Failed to fetch P2H detail:', error);
    return NextResponse.json({ error: 'Failed to fetch P2H detail' }, { status: 500 });
  }
}
