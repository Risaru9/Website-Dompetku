import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Halaman yang HARUS login (Protected Routes)
  const protectedRoutes = ["/dashboard", "/transaksi", "/laporan", "/target", "/download"];
  
  // 2. Halaman yang TIDAK BOLEH diakses kalau sudah login (Auth Routes)
  const authRoutes = ["/login", "/register", "/forgot-password"];

  // LOGIKA 1: Jika mau masuk halaman rahasia tapi tidak punya token -> Tendang ke Login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  // LOGIKA 2: Jika sudah login tapi mau masuk halaman login/register -> Tendang ke Dashboard
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      const url = new URL("/dashboard", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher agar middleware tidak jalan di file statis/gambar
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};