import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const formId = Number.parseInt(params.id)
    const { status } = await request.json()

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("p2h_forms")
      .update({ status })
      .eq("id", formId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error updating P2H form status:", error)
    return NextResponse.json({ error: "Failed to update P2H form status" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const formId = Number.parseInt(params.id)

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
      .eq("id", formId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "P2H form not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error fetching P2H form:", error)
    return NextResponse.json({ error: "Failed to fetch P2H form" }, { status: 500 })
  }
}
