// app/api/vehicles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const typeId = searchParams.get("type_id"); // UUID/string

    // log untuk verifikasi; lihat di terminal saat pilih type
    console.log("[/api/vehicles] type_id =", typeId);

    let query = supabase
      .from("vehicles")
      .select(`
        id,
        vehicle_number,
        vehicle_type_id,
        vehicle_type:vehicle_types ( id, name )
      `)
      .order("vehicle_number", { ascending: true });

    if (typeId) {
      // JANGAN Number(typeId)
      query = query.eq("vehicle_type_id", typeId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (e: any) {
    console.error("[GET /api/vehicles]", e);
    return NextResponse.json(
      { success: false, message: e?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const vehicle_number = String(body?.vehicle_number || "").trim();
    const vehicle_type_id = body?.vehicle_type_id; // UUID/string

    if (!vehicle_number) {
      return NextResponse.json({ success: false, message: "vehicle_number wajib diisi" }, { status: 400 });
    }
    if (!vehicle_type_id) {
      return NextResponse.json({ success: false, message: "vehicle_type_id wajib diisi" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("vehicles")
      .insert([{ vehicle_number, vehicle_type_id }])
      .select(`
        id,
        vehicle_number,
        vehicle_type_id,
        vehicle_type:vehicle_types ( id, name )
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e: any) {
    console.error("[POST /api/vehicles]", e);
    return NextResponse.json({ success: false, message: e?.message ?? "Internal server error" }, { status: 500 });
  }
}
