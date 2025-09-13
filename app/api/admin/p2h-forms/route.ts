// app/api/admin/p2h-forms/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const err = (s: number, m: string) => NextResponse.json({ success: false, message: m }, { status: s });

export async function GET() {
  try {
    // 1) Ambil semua form (kolom dasar)
    const { data: formsData, error: formsError } = await supabase
      .from('p2h_forms')
      .select(
        `
        id,
        driver_id,
        driver_nik,
        inspection_date,
        shift,
        vehicle_id,
        hm_km_awal,
        pengawas_id,
        status,
        created_at
      `
      )
      .order('created_at', { ascending: false });

    if (formsError) {
      console.error('[p2h-forms] formsError:', formsError);
      return err(500, formsError.message || 'Gagal mengambil p2h_forms');
    }

    const forms = formsData || [];

    // jika tidak ada forms, langsung return array kosong
    if (forms.length === 0) return NextResponse.json([]);

    // 2) Kumpulkan id yang dibutuhkan untuk fetch relasi
    const driverIds = Array.from(new Set(forms.map((f: any) => f.driver_id).filter(Boolean)));
    const vehicleIds = Array.from(new Set(forms.map((f: any) => f.vehicle_id).filter(Boolean)));
    const formIds = Array.from(new Set(forms.map((f: any) => f.id).filter(Boolean)));

    // 3) Ambil drivers (nama jika tersedia)
    const { data: driversData, error: driversError } = await supabase
      .from('drivers')
      .select('id, name, user_id')
      .in('id', driverIds.length ? driverIds : ['-']); // .in dengan array kosong bisa error => pakai sentinel
    if (driversError) {
      console.error('[p2h-forms] driversError:', driversError);
      // lanjutkan saja (kita bisa fallback ke users nanti), tapi log error
    }

    // 4) Jika drivers refer ke users via user_id, ambil users
    const userIds = Array.from(new Set((driversData || []).map((d: any) => d.user_id).filter(Boolean)));
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name')
      .in('id', userIds.length ? userIds : ['-']);
    if (usersError) {
      console.error('[p2h-forms] usersError:', usersError);
    }

    // 5) Ambil vehicles & vehicle_types
    const { data: vehiclesData, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, vehicle_number, vehicle_type_id')
      .in('id', vehicleIds.length ? vehicleIds : ['-']);
    if (vehiclesError) {
      console.error('[p2h-forms] vehiclesError:', vehiclesError);
    }

    const vehicleTypeIds = Array.from(new Set((vehiclesData || []).map((v: any) => v.vehicle_type_id).filter(Boolean)));
    const { data: vtypesData, error: vtypesError } = await supabase
      .from('vehicle_types')
      .select('id, name')
      .in('id', vehicleTypeIds.length ? vehicleTypeIds : ['-']);
    if (vtypesError) {
      console.error('[p2h-forms] vtypesError:', vtypesError);
    }

    // 6) Ambil p2h_form_details untuk cek apakah ada kondisi 'rusak' (menandakan issue)
    const { data: detailsData, error: detailsError } = await supabase
      .from('p2h_form_details')
      .select('p2h_form_id, condition')
      .in('p2h_form_id', formIds.length ? formIds : ['-'])
      .eq('condition', 'rusak'); // hanya yang rusak
    if (detailsError) {
      console.error('[p2h-forms] detailsError:', detailsError);
    }

    // 7) Buat map untuk lookup cepat
    const driversMap = new Map((driversData || []).map((d: any) => [d.id, d]));
    const usersMap = new Map((usersData || []).map((u: any) => [u.id, u]));
    const vehiclesMap = new Map((vehiclesData || []).map((v: any) => [v.id, v]));
    const vtypesMap = new Map((vtypesData || []).map((t: any) => [t.id, t]));
    const issuesSet = new Set((detailsData || []).map((d: any) => d.p2h_form_id));

    // 8) Transform hasil supaya sesuai frontend (alias date -> inspection_date)
    const transformed = (forms as any[]).map((f: any) => {
      // driver name: prioritas drivers.name -> users.name -> "Unknown Driver"
      const driver = driversMap.get(f.driver_id);
      const driverNameFromDriver = driver?.name;
      const userNameFromDriver = driver?.user_id ? usersMap.get(driver.user_id)?.name : null;
      const driver_name = driverNameFromDriver || userNameFromDriver || 'Unknown Driver';

      // vehicle number & vehicle type
      const vehicle = vehiclesMap.get(f.vehicle_id);
      const vehicle_number = vehicle?.vehicle_number || 'Unknown Vehicle';
      const vehicle_type = vehicle ? vtypesMap.get(vehicle.vehicle_type_id)?.name ?? 'Unknown Type' : 'Unknown Type';

      return {
        id: f.id,
        driver_name,
        vehicle_number,
        vehicle_type,
        inspection_date: f.inspection_date, // <-- alias
        status: f.status,
        has_issues: issuesSet.has(f.id),
      };
    });

    // debug log (dev)
    console.log('[p2h-forms] transformed count:', transformed.length);

    return NextResponse.json(transformed);
  } catch (e: any) {
    console.error('[GET /api/admin/p2h-forms] unexpected error:', e);
    return err(500, String(e?.message || e));
  }
}
