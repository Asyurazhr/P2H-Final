import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("vehicle_types")
      .select("id, name, display_name")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Error fetching vehicle types:", error)
    return NextResponse.json({ error: error.message || "Gagal mengambil tipe kendaraan" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    if (!name) {
      return NextResponse.json({ error: "Nama tipe kendaraan diperlukan" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("vehicle_types")
      .insert([{ 
        name,
        display_name: name   // 🔑 wajib isi biar gak null
      }])
      .select("id, name, display_name")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error adding vehicle type:", error)
    return NextResponse.json({ error: error.message || "Gagal menambah tipe kendaraan" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID diperlukan" }, { status: 400 })
    }

    const { error } = await supabase
      .from("vehicle_types")
      .delete()
      .eq("id", id)   // 🔑 id itu UUID, jadi jangan Number(id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting vehicle type:", error)
    return NextResponse.json({ error: error.message || "Gagal menghapus tipe kendaraan" }, { status: 500 })
  }
}
