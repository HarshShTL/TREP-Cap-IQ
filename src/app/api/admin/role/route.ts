import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, role } = (await req.json()) as { userId: string; role: string };
  if (!userId || !role) {
    return NextResponse.json({ error: "userId and role are required" }, { status: 400 });
  }
  if (!["super_admin", "user", "read_only"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  // Prevent demoting yourself
  if (userId === user.id) {
    return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: role as "super_admin" | "user" | "read_only" })
    .eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
