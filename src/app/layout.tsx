import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/components/providers/session-provider";
import PWARegister from "@/components/providers/PWARegister";

import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Desa Digital Kediren - Smart Portal & Administration",
  description: "Sistem Informasi Desa Terintegrasi untuk Pelayanan Publik dan Administrasi Desa Kediren.",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="id">
      <body className="antialiased">
        <AuthProvider session={session}>
          <PWARegister />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
