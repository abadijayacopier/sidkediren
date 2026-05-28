export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.loginType = user.loginType;
        token.nik = user.nik || null;
        token.noKk = user.noKk || null;
        token.aksesModul = user.aksesModul || null;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.loginType = token.loginType;
        session.user.nik = token.nik;
        session.user.noKk = token.noKk;
        session.user.aksesModul = token.aksesModul;
      }
      return session;
    },
  },
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
};
