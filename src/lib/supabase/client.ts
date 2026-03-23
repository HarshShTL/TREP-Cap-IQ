import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createBrowserClient<Database>(url, key, {
    cookieOptions: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  });
}
