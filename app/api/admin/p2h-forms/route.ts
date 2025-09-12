import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Admin sees all forms with related data
    const { data, error } = await supabase
      .from("p2h_forms")
      .select(`
        id,
        driver_id,
        driver_nik,
        inspection_date,
        shift,
        vehicle_id,
        hm_km_awal,
        pengawas_id,
        status,
        created_at,
        users!p2h_forms_driver_id_fkey (
          name as driver_name
        ),
        vehicles!p2h_forms_vehicle_id_fkey (
          vehicle_number,
          vehicle_type_id,
          vehicle_types!vehicles_vehicle_type_id_fkey (
            name as vehicle_type
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    // Transform data to match expected format for admin dashboard
    const transformedData = (data || []).map((form: any) => ({
      id: form.id,
      driver_name: form.users?.driver_name || "Unknown Driver",
      vehicle_number: form.vehicles?.vehicle_number || "Unknown Vehicle",
      inspection_date: form.inspection_date,
      status: form.status,
      has_issues: false, // This would need to be calculated based on inspection results
    }))

    return NextResponse.json(transformedData)
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 })
  }
}
