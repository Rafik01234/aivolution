// src/app/dashboard/student/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  // Проверка: доступно только для STUDENT
  if (!session || session.user.role !== "STUDENT") {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/courses"
            className="text-gray-600 hover:text-gray-900"
          >
            Курсы
          </Link>
          <Link
            href="/profile"
            className="text-gray-600 hover:text-gray-900"
          >
            Профиль
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-xl font-semibold">
          Добро пожаловать, {session.user?.name}!
        </h2>
        <p className="mt-2 text-gray-600">
          Здесь вы можете просматривать курсы, записываться на них и отслеживать свои результаты.
        </p>
        {/* Дополнительный контент студенческого кабинета */}
      </main>
    </div>
  );
}
