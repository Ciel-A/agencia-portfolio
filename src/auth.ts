import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export function isAllowedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const rawList = process.env.ADMIN_EMAILS || "";
  const allowedEmails = rawList
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(email.trim().toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  callbacks: {
    async signIn({ user }) {
      return isAllowedAdminEmail(user?.email);
    },
  },
});

