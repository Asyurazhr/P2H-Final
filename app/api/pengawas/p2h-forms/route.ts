import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pengawasId = searchParams.get("pengawas_id")

    let query = supabase.from("p2h_forms").select("*")

    if (pengawasId) {
      query = query.eq("pengawas_id", Number(pengawasId))
    }

    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 })
  }
}
