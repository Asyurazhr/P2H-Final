import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Test query untuk melihat data vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from("vehicles")
      .select(`
        id,
        vehicle_number,
        vehicle_type_id,
        vehicle_types ( id, name )
      `)
      .order("vehicle_number", { ascending: true })

    if (vehiclesError) {
      return NextResponse.json({ error: vehiclesError.message }, { status: 500 })
    }

    // Test query untuk melihat data vehicle_types
    const { data: vehicleTypes, error: typesError } = await supabase
      .from("vehicle_types")
      .select("id, name")
      .order("id", { ascending: true })

    if (typesError) {
      return NextResponse.json({ error: typesError.message }, { status: 500 })
    }

    return NextResponse.json({
      vehicles: vehicles || [],
      vehicleTypes: vehicleTypes || [],
      message: "Data berhasil diambil"
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
