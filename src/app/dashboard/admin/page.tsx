// src/app/dashboard/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminDashboard() {
  // Получаем сессию и проверяем, что пользователь - админ
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  // Получаем актуальные данные из базы
  const totalTeachers = await prisma.user.count({ where: { role: "TEACHER" } });
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
  const totalUsers = totalTeachers + totalStudents + totalAdmins;
  const totalCourses = await prisma.course.count(); // актуальное число курсов (сейчас может быть 0)
  const pendingRequests = 0; // пока что запросов нет

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Панель администратора</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/admin/users"
            className="text-gray-600 dark:text-gray-300 hover:underline"
          >
            Управление пользователями
          </Link>
          <Link
            href="/dashboard/admin/settings"
            className="text-gray-600 dark:text-gray-300 hover:underline"
          >
            Настройки
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Добро пожаловать, {session.user?.name}!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Карточка: Пользователи */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-lg font-bold">Пользователи</h3>
            <p className="text-3xl font-semibold">{totalUsers}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Учителя: {totalTeachers} | Студенты: {totalStudents} | Админы: {totalAdmins}
            </p>
          </div>
          {/* Карточка: Курсы */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-lg font-bold">Курсы</h3>
            <p className="text-3xl font-semibold">{totalCourses}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Активных курсов
            </p>
          </div>
          {/* Карточка: Запросы */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-lg font-bold">Запросы</h3>
            <p className="text-3xl font-semibold">{pendingRequests}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ожидают обработки
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
