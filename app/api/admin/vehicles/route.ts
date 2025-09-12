import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const err = (s: number, m: string) => NextResponse.json({ error: m }, { status: s });

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select(`
        id,
        vehicle_number,
        vehicle_type_id,
        status,
        vehicle_types ( id, name )
      `)
      .order("created_at", { ascending: false });

    if (error) return err(500, error.message);

    // Get today's date for P2H check
    const today = new Date().toISOString().split('T')[0];

    // Get P2H forms for today to check which vehicles have P2H
    const { data: todayP2HForms } = await supabase
      .from("p2h_forms")
      .select("vehicle_id, inspection_date, created_at")
      .eq("inspection_date", today)
      .eq("status", "approved");

    const vehiclesWithP2H = new Set(todayP2HForms?.map(form => form.vehicle_id) || []);

    const out = (data || []).map((v: any) => {
      const hasP2HToday = vehiclesWithP2H.has(v.id);
      const todayForm = todayP2HForms?.find(form => form.vehicle_id === v.id);
      
      return {
        id: v.id as string,
        vehicle_number: v.vehicle_number as string,
        vehicle_type_id: v.vehicle_type_id as string,
        vehicle_type: v.vehicle_types?.name ?? "Unknown",
        status: v.status,
        has_p2h_today: hasP2HToday,
        last_p2h_date: todayForm ? today : null,
      };
    });
    return NextResponse.json(out);
  } catch (e: any) {
    console.error("[GET vehicles]", e);
    return err(500, e?.message || "Gagal mengambil data kendaraan");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vehicle_number = (body?.vehicle_number ?? "").trim();
    const vehicle_type_id = (body?.vehicle_type_id ?? "").trim(); // UUID string

    if (!vehicle_number || !vehicle_type_id) {
      return err(400, "Nomor kendaraan dan tipe kendaraan diperlukan");
    }

    // validasi tipe
    const { data: vtype, error: vtypeErr } = await supabase
      .from("vehicle_types")
      .select("id, name")
      .eq("id", vehicle_type_id)
      .single();
    if (vtypeErr) return err(400, vtypeErr.message);
    if (!vtype) return err(400, "Tipe kendaraan tidak valid");

    // anti duplikat nomor
    const { data: existing } = await supabase
      .from("vehicles")
      .select("id")
      .ilike("vehicle_number", vehicle_number)
      .maybeSingle();
    if (existing) return err(409, "Nomor kendaraan sudah terdaftar");

    // ⬇️ status DIHAPUS dari insert — pakai default DB
    const { data, error } = await supabase
      .from("vehicles")
      .insert([{ vehicle_number, vehicle_type_id }])
      .select(`
        id,
        vehicle_number,
        vehicle_type_id,
        status,
        vehicle_types ( id, name )
      `)
      .single();

    if (error) return err(400, error.message);

    const out = {
      id: data.id as string,
      vehicle_number: data.vehicle_number as string,
      vehicle_type_id: data.vehicle_type_id as string,
      vehicle_type: (data.vehicle_types as any)?.name ?? vtype.name ?? "Unknown",
      status: data.status,          // nilai dari default/constraint
      has_p2h_today: false,
      last_p2h_date: null,
    };
    return NextResponse.json(out, { status: 201 });
  } catch (e: any) {
    console.error("[POST vehicles]", e);
    return err(500, e?.message || "Gagal menambah kendaraan");
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id")?.trim() || "";
    if (!id) return err(400, "ID diperlukan");

    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) return err(400, error.message);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[DELETE vehicles]", e);
    return err(500, e?.message || "Gagal menghapus kendaraan");
  }
}
