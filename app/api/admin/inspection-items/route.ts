// app/api/admin/inspection-items/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

export const dynamic = "force-dynamic";

const Body = z.object({
  category: z.string().trim().min(1, "Kategori diperlukan"),
  description: z.string().trim().min(1, "Deskripsi diperlukan"),
  item_order: z.coerce.number().int().nonnegative().default(0), // FE kirim item_order
  danger_code: z.enum(["AA", "A", "B"]).default("B"),
});

const err = (s: number, m: string, extra?: unknown) =>
  NextResponse.json({ error: m, ...(extra ? { extra } : {}) }, { status: s });

/**
 * GET: balikin list dengan alias:
 *   order_number -> item_order
 * id kamu UUID (string).
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("inspection_items")
      .select("id, category, description, order_number, danger_code")
      .order("order_number", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[GET inspection-items] supabase:", error);
      return err(500, "Gagal mengambil item inspeksi");
    }

    const mapped = (data ?? []).map((r: any) => ({
      id: r.id as string,                 // UUID
      category: r.category,
      description: r.description,
      item_order: r.order_number,         // alias buat FE
      danger_code: r.danger_code,
    }));

    return NextResponse.json(mapped);
  } catch (e: any) {
    console.error("[GET inspection-items] server:", e);
    return err(500, e?.message || "Gagal mengambil item inspeksi");
  }
}

/**
 * POST: terima item_order dari FE, simpan ke kolom order_number.
 */
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const p = Body.safeParse(json);
    if (!p.success) {
      return err(400, "Body tidak valid", p.error.flatten());
    }

    const payload = {
      category: p.data.category,
      description: p.data.description,
      order_number: p.data.item_order, // map ke kolom tabel
      danger_code: p.data.danger_code,
      is_active: true,
    };

    const { data, error } = await supabase
      .from("inspection_items")
      .insert([payload])
      .select("id, category, description, order_number, danger_code")
      .single();

    if (error) {
      console.error("[POST inspection-items] supabase:", error);
      return err(400, error.message);
    }

    const res = {
      id: data!.id as string,
      category: data!.category,
      description: data!.description,
      item_order: (data as any).order_number,
      danger_code: data!.danger_code,
    };

    return NextResponse.json(res, { status: 201 });
  } catch (e: any) {
    console.error("[POST inspection-items] server:", e);
    return err(500, e?.message || "Gagal menambah item inspeksi");
  }
}

/**
 * DELETE: id adalah UUID string — JANGAN di-Number().
 * /api/admin/inspection-items?id=<uuid>
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // UUID string
    if (!id) return err(400, "ID diperlukan");

    const { error } = await supabase
      .from("inspection_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[DELETE inspection-items] supabase:", error);
      return err(400, error.message);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[DELETE inspection-items] server:", e);
    return err(500, e?.message || "Gagal menghapus item inspeksi");
  }
}
