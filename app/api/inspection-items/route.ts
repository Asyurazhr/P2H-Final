import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";  // pastikan path ini benar

export async function GET() {
  try {
    // Ambil data dari tabel inspection_items, termasuk danger_code
    const { data, error } = await supabase
      .from("inspection_items")
      .select("id, category, description, danger_code")  // Menambahkan 'danger_code' di sini
      .order("category", { ascending: true });  // Urutkan berdasarkan kategori

    if (error) {
      console.error("[GET /api/inspection-items] supabase error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (e: any) {
    console.error("[GET /api/inspection-items] route error:", e);
    return NextResponse.json(
      { success: false, message: e?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
