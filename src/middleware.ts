import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;
  const loginType = (req.auth?.user as any)?.loginType;
  const pathname = req.nextUrl.pathname;

  const isAdminLoginPage = pathname === "/login";
  const isWargaLoginPage = pathname === "/portal/login";
  const isAdminPage = pathname.startsWith("/admin");
  const isPortalPage = pathname.startsWith("/portal") && !isWargaLoginPage;

  // Admin routes: require admin login
  if (isAdminPage && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  if (isAdminPage && isLoggedIn && role === "Warga") {
    return Response.redirect(new URL("/portal", req.nextUrl));
  }

  // Portal routes: require warga login
  if (isPortalPage && !isLoggedIn) {
    return Response.redirect(new URL("/portal/login", req.nextUrl));
  }

  if (isPortalPage && isLoggedIn && role !== "Warga") {
    return Response.redirect(new URL("/admin", req.nextUrl));
  }

  // If admin is logged in and tries to access admin login page, redirect to dashboard
  if (isAdminLoginPage && isLoggedIn) {
    if (role === "Warga") {
      return Response.redirect(new URL("/portal", req.nextUrl));
    } else {
      return Response.redirect(new URL("/admin", req.nextUrl));
    }
  }

  // If warga is logged in and tries to access warga login page, redirect to portal
  if (isWargaLoginPage && isLoggedIn && role === "Warga") {
    return Response.redirect(new URL("/portal", req.nextUrl));
  }

  // Settings: only Admin & Kepala Desa
  if (pathname.startsWith("/admin/settings")) {
    if (role !== "Admin" && role !== "Kepala Desa") {
      return Response.redirect(new URL("/admin", req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/login"],
};
