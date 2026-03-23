import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST — invite a new user
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

  const { email, role = "user" } = (await req.json()) as { email: string; role?: string };
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  if (!["super_admin", "user", "read_only"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Check if user already exists
  const admin = createAdminClient();
  const { data: existingProfiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .limit(1);
  if (existingProfiles && existingProfiles.length > 0) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
  }

  // Check for existing pending invite
  const { data: existingInvites } = await supabase
    .from("invites")
    .select("id")
    .eq("email", email)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .limit(1);
  if (existingInvites && existingInvites.length > 0) {
    return NextResponse.json({ error: "A pending invite already exists for this email" }, { status: 409 });
  }

  // Send invite via Supabase Auth
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email);
  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  // Record in invites table
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry
  const { error: insertError } = await supabase.from("invites").insert({
    email,
    role,
    invited_by: user.id,
    expires_at: expiresAt.toISOString(),
  });
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE — revoke a pending invite
export async function DELETE(req: NextRequest) {
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

  const { inviteId } = (await req.json()) as { inviteId: string };
  if (!inviteId) {
    return NextResponse.json({ error: "inviteId is required" }, { status: 400 });
  }

  const { error } = await supabase.from("invites").delete().eq("id", inviteId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

// PATCH — resend an invite
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

  const { inviteId } = (await req.json()) as { inviteId: string };
  if (!inviteId) {
    return NextResponse.json({ error: "inviteId is required" }, { status: 400 });
  }

  // Get the invite
  const { data: invite, error: fetchError } = await supabase
    .from("invites")
    .select("email")
    .eq("id", inviteId)
    .single();
  if (fetchError || !invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  // Resend
  const admin = createAdminClient();
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(invite.email);
  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  // Update expiry
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await supabase
    .from("invites")
    .update({ expires_at: expiresAt.toISOString() })
    .eq("id", inviteId);

  return NextResponse.json({ ok: true });
}
