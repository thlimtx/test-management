import { jsonParse } from "@/util/format";
import { compare } from "bcrypt";
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
          where: { email },
          include: { member: true },
        });
        if (!user) {
          throw new Error("Invalid login.");
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid login.");
        }

        return {
          id: `${user.id}`,
          email: user.email,
          name: `${user.name}`,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          // add any field needed for useSession
        },
      };
    },
    jwt: ({ token, user }) => {
      return { ...token, ...user };
    },
  },
};

export default NextAuth(authOptions);
