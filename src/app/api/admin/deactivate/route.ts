import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
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

  const { userId, active } = (await req.json()) as { userId: string; active: boolean };
  if (!userId || typeof active !== "boolean") {
    return NextResponse.json({ error: "userId and active are required" }, { status: 400 });
  }
  if (userId === user.id) {
    return NextResponse.json({ error: "Cannot deactivate yourself" }, { status: 400 });
  }

  // Update is_active in profiles
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: active })
    .eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Ban/unban in Supabase Auth
  const admin = createAdminClient();
  if (!active) {
    await admin.auth.admin.updateUserById(userId, { ban_duration: "876600h" }); // ~100 years
  } else {
    await admin.auth.admin.updateUserById(userId, { ban_duration: "none" });
  }

  return NextResponse.json({ ok: true });
}
