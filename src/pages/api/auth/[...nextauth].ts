import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProviders from "next-auth/providers/credentials";
import { prisma } from "server/db/client";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProviders({
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter password",
        },
      },
      authorize: async (credentials, req) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findFirst({
          where: { email, password },
        });
        if (!user) {
          throw new Error("Invalid login.");
        }

        return { id: `${user.id}`, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
