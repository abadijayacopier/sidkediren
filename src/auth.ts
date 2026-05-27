import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    // Provider 1: Admin login (username + password)
    Credentials({
      id: "admin-login",
      name: "Admin",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.pengguna.findUnique({
          where: { username: credentials.username as string },
        });

        if (!user || !user.isActive) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user.id.toString(),
          name: user.namaPetugas,
          email: user.username,
          role: user.peran,
          loginType: "admin",
        } as any;
      },
    }),

    // Provider 2: Warga login (NIK + PIN)
    Credentials({
      id: "warga-login",
      name: "Warga",
      credentials: {
        nik: { label: "NIK", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.nik || !credentials?.pin) return null;

        const penduduk = await prisma.penduduk.findUnique({
          where: { nik: credentials.nik as string },
          include: { keluarga: true },
        });

        if (!penduduk || !penduduk.isHidup) return null;
        if (!penduduk.pinHash) return null;

        const isPinCorrect = await bcrypt.compare(
          credentials.pin as string,
          penduduk.pinHash
        );

        if (!isPinCorrect) return null;

        return {
          id: penduduk.nik,
          name: penduduk.namaLengkap,
          email: penduduk.nik,
          role: "Warga",
          loginType: "warga",
          nik: penduduk.nik,
          noKk: penduduk.noKk,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.loginType = user.loginType;
        token.nik = user.nik || null;
        token.noKk = user.noKk || null;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.loginType = token.loginType;
        session.user.nik = token.nik;
        session.user.noKk = token.noKk;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
} as any);
