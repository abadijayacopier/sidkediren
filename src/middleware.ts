import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === "/login";
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin") || 
                      req.nextUrl.pathname.startsWith("/dashboard");

  // Jika belum login dan mencoba akses admin, arahkan ke login
  if (isAdminPage && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Jika sudah login dan mencoba akses halaman login, arahkan ke dashboard
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/admin", req.nextUrl));
  }
});

// Jalankan middleware ini pada path yang relevan
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
