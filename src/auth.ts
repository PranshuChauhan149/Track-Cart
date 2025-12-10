import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDb from "./lib/DB";
import User from "./models/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, reqest) {
        await connectDb();
        const email = credentials.email;
        const password = credentials.password as string;
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User does not exist");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Incorrect Password");
        }
        return {
          id: user._id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider == "google") {
        await connectDb();
        let dbuser = await User.findOne({ email: user.email });
        if (!dbuser) {
          dbuser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }
        user.id = dbuser._id.toString();
        user.role = dbuser.role;
      }
      return true;
    },

    jwt({ token, user }) {
      if (user) {
        (token.id = user.id),
          (token.name = user.name),
          (token.email = user.email);
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user.id = token.id as string),
          (session.user.name = token.name as string),
          (session.user.email = token.email as string),
          (session.user.role = token.role as string);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  },
  secret: process.env.AUTH_SECRET,
});
