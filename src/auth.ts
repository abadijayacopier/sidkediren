import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        console.log("Mencoba login untuk user:", credentials.username);

        const user = await prisma.pengguna.findUnique({
          where: { username: credentials.username as string },
        });

        if (!user) {
          console.log("User tidak ditemukan di database!");
          return null;
        }

        if (!user.isActive) {
          console.log("User ditemukan tapi statusnya TIDAK AKTIF!");
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordCorrect) {
          console.log("Password salah!");
          return null;
        }

        console.log("Login berhasil untuk:", user.namaPetugas);

        return {
          id: user.id.toString(),
          name: user.namaPetugas,
          email: user.username,
          role: user.peran,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
} as any);
