import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ethers } from "ethers";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const { message, signature } = credentials as {
            message: string;
            signature: string;
          };

          const address = ethers.utils.verifyMessage(message, signature);

          return {
            id: address,
            address: address,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.address = user.address;
      }
      return token;
    },
    async session({ session, token }) {
      session.address = token.address;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}); 