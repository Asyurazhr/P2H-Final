import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const driver_id = body?.driver_id || null;
    const driver_name = String(body?.driver_name || "").trim();
    const driver_nik = String(body?.driver_nik || "").trim();
    const inspection_date = String(body?.inspection_date || "").trim();
    const shift = String(body?.shift || "").trim();
    const vehicle_id = body?.vehicle_id || null;
    const hm_km_awal = Number(body?.hm_km_awal ?? NaN);
    let   pengawas_id = body?.pengawas_id || null;
    const pengawas_name = String(body?.pengawas_name || "").trim();

    const missing: string[] = [];
    if (!driver_name) missing.push("driver_name");
    if (!driver_nik) missing.push("driver_nik");
    if (!inspection_date) missing.push("inspection_date");
    if (!shift) missing.push("shift");
    if (!vehicle_id) missing.push("vehicle_id");
    if (!Number.isFinite(hm_km_awal)) missing.push("hm_km_awal");
    if (!pengawas_id && !pengawas_name) missing.push("pengawas_id/pengawas_name");
    if (missing.length) {
      return NextResponse.json({ success: false, error: `Missing/invalid: ${missing.join(", ")}` }, { status: 400 });
    }

    // fallback cari id berdasarkan nama (exact → partial)
    if (!pengawas_id && pengawas_name) {
      let { data: p } = await supabase
        .from("pengawas")
        .select("id")
        .ilike("name", pengawas_name)
        .limit(1)
        .maybeSingle();

      if (!p?.id && pengawas_name.length >= 2) {
        const { data: px } = await supabase
          .from("pengawas")
          .select("id")
          .ilike("name", `%${pengawas_name}%`)
          .limit(1)
          .maybeSingle();
        p = px as any;
      }
      if (!p?.id) {
        return NextResponse.json({ success: false, error: "Pengawas tidak ditemukan. Pilih dari daftar." }, { status: 400 });
      }
      pengawas_id = p.id;
    }

    const payload = {
      driver_id,
      driver_nik,
      inspection_date, // kolom di DB
      shift,
      vehicle_id,
      hm_km_awal,
      pengawas_id,
      status: "pending",
    };

    const { data, error } = await supabase
      .from("p2h_forms")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (e: any) {
    console.error("[POST /api/p2h-forms]", e);
    return NextResponse.json({ success: false, error: e?.message ?? "Internal server error" }, { status: 500 });
  }
}
