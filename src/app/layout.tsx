import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Desa Digital Kediren - Smart Portal & Administration",
  description: "Sistem Informasi Desa Terintegrasi untuk Pelayanan Publik dan Administrasi Desa Kediren.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
