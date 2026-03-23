import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  // Verify caller is super_admin
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

  // Get all profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, created_at, updated_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get last_sign_in_at from auth (admin API)
  const admin = createAdminClient();
  const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const signInMap = new Map<string, string | null>();
  if (authData?.users) {
    for (const u of authData.users) {
      signInMap.set(u.id, u.last_sign_in_at ?? null);
    }
  }

  const users = (profiles ?? []).map((p) => ({
    ...p,
    last_sign_in_at: signInMap.get(p.id) ?? null,
  }));

  return NextResponse.json({ users });
}
