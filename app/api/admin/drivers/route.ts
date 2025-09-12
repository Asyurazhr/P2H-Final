// app/api/admin/drivers/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

/** =========================================
 *  Konfigurasi (hindari caching di Next)
 *  ========================================= */
export const dynamic = "force-dynamic";

/** =========================================
 *  Schema / Utils
 *  ========================================= */
const BodySchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(200),
  nik: z.string().trim().min(1, "NIK wajib diisi").max(100),
});

const err = (status: number, message: string, extra?: unknown) =>
  NextResponse.json({ error: message, ...(extra ? { extra } : {}) }, { status });

const toInt = (v: string | null, def: number) => {
  if (!v) return def;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : def;
};

/** =========================================
 *  GET /api/admin/drivers
 *  Query params (opsional):
 *   - q: search (name/nik)
 *   - active: "true" | "false"
 *   - limit: number (default 50, max 200)
 *   - offset: number (default 0)
 *  ========================================= */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").trim();
    const activeParam = url.searchParams.get("active");
    const limit = Math.min(toInt(url.searchParams.get("limit"), 50), 200);
    const offset = toInt(url.searchParams.get("offset"), 0);

    let query = supabase
      .from("drivers")
      .select("id, name, nik, is_active", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (activeParam === "true") query = query.eq("is_active", true);
    if (activeParam === "false") query = query.eq("is_active", false);

    if (q) {
      // cari di name atau nik (ILIKE = case-insensitive)
      query = query.or(`name.ilike.%${q}%,nik.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[GET /drivers] supabase error:", error);
      return err(500, "Failed to fetch drivers");
    }

    // Selalu array
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (e: any) {
    console.error("[GET /drivers] server error:", e);
    return err(500, e?.message || "Failed to fetch drivers");
  }
}

/** =========================================
 *  POST /api/admin/drivers
 *  body: { name: string, nik: string }
 *  ========================================= */
export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return err(400, "Invalid body", parsed.error.flatten());
    }

    // Normalisasi sederhana
    const name = parsed.data.name.trim();
    const nik = parsed.data.nik.trim();

    // Cek duplikat NIK
    {
      const { data: existing, error: existErr } = await supabase
        .from("drivers")
        .select("id")
        .eq("nik", nik)
        .maybeSingle();
      if (existErr) {
        // bukan fatal; log aja
        console.warn("[POST /drivers] check nik warning:", existErr);
      }
      if (existing) {
        return err(409, "NIK sudah digunakan");
      }
    }

    const { data, error } = await supabase
      .from("drivers")
      .insert([{ name, nik }])
      .select("id, name, nik, is_active")
      .single();

    if (error) {
      console.error("[POST /drivers] supabase error:", error);
      // Tangkap unique violation postgres kalau lolos dari pre-check
      // (kode umum: 23505) → balas 409
      // @ts-ignore
      if (error.code === "23505") return err(409, "NIK sudah digunakan");
      return err(400, error.message);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error("[POST /drivers] server error:", e);
    return err(500, e?.message || "Gagal menambah driver");
  }
}

/** =========================================
 *  DELETE /api/admin/drivers?id=<uuid>
 *  ========================================= */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // UUID string

    if (!id) return err(400, "ID diperlukan");

    const { error } = await supabase.from("drivers").delete().eq("id", id);

    if (error) {
      console.error("[DELETE /drivers] supabase error:", error);
      return err(400, error.message);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[DELETE /drivers] server error:", e);
    return err(500, e?.message || "Gagal menghapus driver");
  }
}
