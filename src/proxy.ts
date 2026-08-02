/* eslint-disable */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = request.nextUrl.pathname === '/admin/login';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Handle API routes
  if (isApiRoute) {
    return supabaseResponse;
  }

  // Redirect to /admin if already logged in and trying to access /admin/login
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Redirect to /admin/login if not logged in and trying to access an admin route
  if (isAdminRoute && !isAuthRoute && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

