// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }

  // Автоматически перенаправляем пользователя в его раздел
  if (session.user?.role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (session.user?.role === "TEACHER") {
    redirect("/dashboard/teacher");
  } else if (session.user?.role === "STUDENT") {
    redirect("/dashboard/student");
  }

  // Если роль по какой-то причине не определена
  return <div>Неподдерживаемая роль пользователя</div>;
}
