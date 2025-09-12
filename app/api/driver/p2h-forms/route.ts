import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const driverNik = searchParams.get("driver_nik")

    // Query P2H forms with related data
    let query = supabase
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
        users!p2h_forms_pengawas_id_fkey (
          name as pengawas_name
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

    // If driverNik is provided, filter by it
    if (driverNik) {
      query = query.eq("driver_nik", driverNik)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching P2H forms:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    // Transform the data to match the expected format
    const transformedData = (data || []).map((form: any) => ({
      id: form.id,
      driver_name: form.users?.driver_name || "Unknown Driver",
      driver_nik: form.driver_nik,
      vehicle_number: form.vehicles?.vehicle_number || "Unknown Vehicle",
      vehicle_type: form.vehicles?.vehicle_types?.vehicle_type || "Unknown Type",
      inspection_date: form.inspection_date,
      shift: form.shift,
      hm_km_awal: form.hm_km_awal,
      pengawas_name: form.users?.pengawas_name || "Unknown Pengawas",
      status: form.status,
      created_at: form.created_at,
    }))

    return NextResponse.json(transformedData)
  } catch (error: any) {
    console.error("Error in driver P2H forms API:", error)
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 })
  }
}
