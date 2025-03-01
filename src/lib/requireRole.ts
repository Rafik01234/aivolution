// src/lib/requireRole.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function requireRole(requiredRole: "ADMIN" | "TEACHER") {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== requiredRole) {
    // Можно перенаправить или вернуть ошибку
    redirect("/auth/login"); // или на страницу ошибки
  }
  return session;
}
