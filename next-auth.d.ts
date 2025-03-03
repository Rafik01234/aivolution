// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      groupName: string;
      bio: string;
      phone: string;
      major: string;
      year: string;
      photo: string;
      id: number;
      name: string;
      email: string;
      role: "ADMIN" | "TEACHER" | "STUDENT";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    role?: "ADMIN" | "TEACHER" | "STUDENT";
  }
}
