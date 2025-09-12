import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();

    // Query ke TABEL YANG BENAR: 'drivers'
    let query = supabase
      .from("drivers")
      .select("id, name, nik")
      .order("name", { ascending: true });

    if (search) {
      // cari by name atau NIK
      query = query.or(`name.ilike.%${search}%,nik.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[/api/drivers] supabase error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (e: any) {
    console.error("[/api/drivers] route error:", e);
    return NextResponse.json(
      { success: false, message: e?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
