// api/pengawas/dashboard/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pengawasId = searchParams.get('pengawas_id');

    if (!pengawasId) {
      return NextResponse.json({ error: 'pengawas_id is required' }, { status: 400 });
    }

    // Query untuk mengambil P2H forms yang terkait dengan pengawas
    const { data: p2hForms, error: formsError } = await supabase
      .from('p2h_forms')
      .select(
        `
    id,
    driver_id,
    driver_nik,
    inspection_date,
    shift,
    hm_km_awal,
    status,
    created_at,
    updated_at,
    drivers (
      nik,
      name
    ),
    vehicles (
      id,
      vehicle_number,
      vehicle_types (
        id,
        name
      )
    ),
    pengawas (
      id,
      name
    )
  `
      )
      .eq('pengawas_id', pengawasId)
      .order('created_at', { ascending: false });

    if (formsError) {
      console.error('Error fetching P2H forms:', formsError);
      return NextResponse.json(
        {
          success: false,
          error: 'Database query failed',
          details: formsError.message,
        },
        { status: 500 }
      );
    }

    if (!p2hForms || p2hForms.length === 0) {
      console.log('No P2H forms found for pengawas:', pengawasId);
      return NextResponse.json({
        success: true,
        data: {
          forms: [],
          stats: { pending: 0, approved: 0, rejected: 0, total: 0 },
        },
      });
    }

    // Get additional data for each form
    const transformedForms = await Promise.all(
      p2hForms.map(async (form: any) => {
        // Get driver info
        const { data: driver } = await supabase.from('drivers').select('name, nik').eq('id', form.driver_id).single();

        // Get vehicle info
        const { data: vehicle } = await supabase.from('vehicles').select('vehicle_number').eq('id', form.vehicle_id).single();

        // Get pengawas info
        const { data: pengawas } = await supabase.from('pengawas').select('name').eq('id', form.pengawas_id).single();

        return {
          id: form.id,
          driver_name: form.drivers?.name || 'Unknown Driver',
          driver_nik: form.driver_nik || form.drivers?.nik || 'Unknown NIK',
          vehicle_number: form.vehicles?.vehicle_number || 'Unknown Vehicle',
          vehicle_type: form.vehicles?.vehicle_types?.name || 'Unknown Type',
          inspection_date: form.date,
          shift: form.shift,
          hm_km_awal: form.hm_km_awal,
          pengawas_name: form.pengawas?.name || 'Unknown Pengawas',
          status: form.status,
          has_issues: false,
          created_at: form.created_at,
          updated_at: form.updated_at,
        };
      })
    );

    // Check for issues in each form
    for (let i = 0; i < transformedForms.length; i++) {
      const form = transformedForms[i];

      const { data: details, error: detailsError } = await supabase.from('p2h_form_details').select('condition').eq('p2h_form_id', form.id).eq('condition', 'rusak');

      if (!detailsError && details && details.length > 0) {
        transformedForms[i].has_issues = true;
      }
    }

    // Calculate statistics
    const stats = {
      pending: transformedForms.filter((form) => form.status === 'pending').length,
      approved: transformedForms.filter((form) => form.status === 'approved').length,
      rejected: transformedForms.filter((form) => form.status === 'rejected').length,
      total: transformedForms.length,
    };

    return NextResponse.json({
      success: true,
      data: {
        forms: transformedForms,
        stats: stats,
      },
    });
  } catch (error: any) {
    console.error('Error in pengawas dashboard API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        message: error?.message,
      },
      { status: 500 }
    );
  }
}
