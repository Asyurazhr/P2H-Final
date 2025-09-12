// app/api/admin/pengawas/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

const Body = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  username: z.string().trim().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

const err = (s: number, m: string, extra?: unknown) =>
  NextResponse.json({ error: m, ...(extra ? { extra } : {}) }, { status: s });

/** GET: ambil pengawas dari tabel users (role='pengawas') */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, username")
      .eq("role", "pengawas")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET pengawas] supabase:", error);
      return err(500, "Failed to fetch pengawas");
    }

    return NextResponse.json(data ?? []);
  } catch (e: any) {
    console.error("[GET pengawas] server:", e);
    return err(500, e?.message || "Failed to fetch pengawas");
  }
}


export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const p = Body.safeParse(raw);
    if (!p.success) return err(400, "Semua field diperlukan", p.error.flatten());

   
    const { data: existing, error: existErr } = await supabase
      .from("users")
      .select("id")
      .eq("username", p.data.username)
      .maybeSingle();

    if (existErr) console.warn("[POST pengawas] check username warn:", existErr);
    if (existing) return err(409, "Username sudah digunakan");

    const hashed = await Promise.resolve(hashPassword(p.data.password));

    const { data, error } = await supabase
      .from("users")
      .insert([{
        name: p.data.name,
        role: "pengawas",
        is_shared_account: false,
        username: p.data.username,
        password: hashed,
      }])
      .select("id, name, username")
      .single();

    if (error) {
      console.error("[POST pengawas] supabase:", error);
      // 23505 = unique violation
      // @ts-ignore
      if (error.code === "23505") return err(409, "Username sudah digunakan");
      return err(400, error.message);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error("[POST pengawas] server:", e);
    return err(500, e?.message || "Gagal menambah pengawas");
  }
}

/** DELETE: /api/admin/pengawas?id=<uuid>  — id itu UUID string, JANGAN Number() */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // UUID string
    if (!id) return err(400, "ID diperlukan");

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .eq("role", "pengawas");

    if (error) {
      console.error("[DELETE pengawas] supabase:", error);
      return err(400, error.message);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[DELETE pengawas] server:", e);
    return err(500, e?.message || "Gagal menghapus pengawas");
  }
}
