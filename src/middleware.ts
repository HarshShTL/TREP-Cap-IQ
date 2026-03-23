import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const publicPaths = new Set(["/login", "/auth/callback"]);

function isProtectedPath(pathname: string) {
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) return false;
  if (publicPaths.has(pathname)) return false;
  if (pathname.includes(".")) return false;
  return true;
}

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookieOptions: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // TODO: REVERT AFTER SHOWCASE
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // TODO: REVERT AFTER SHOWCASE
  // if (pathname === "/login" && user) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // TODO: REVERT AFTER SHOWCASE
  // if (isProtectedPath(pathname) && !user) {
  //   const redirectUrl = new URL("/login", request.url);
  //   redirectUrl.searchParams.set("next", pathname);
  //   return NextResponse.redirect(redirectUrl);
  // }

  // TODO: REVERT AFTER SHOWCASE
  // Role-based access control for restricted routes
  // if (user) {
  //   const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  //
  //   if (pathname.startsWith('/settings') && profile?.role !== 'super_admin') {
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  //   if (pathname.startsWith('/import') && profile?.role === 'read_only') {
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  // }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
