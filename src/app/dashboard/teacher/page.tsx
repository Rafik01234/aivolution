// src/app/dashboard/teacher/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);
  // Проверка: доступно только для TEACHER
  if (!session || session.user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  // Запрос курсов, где teacherId соответствует текущему пользователю
  const courses = await prisma.course.findMany({
    where: { teacherId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teacher Panel</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/teacher/courses"
            className="text-gray-300 hover:text-white"
          >
            Мои курсы
          </Link>
          <Link
            href="/dashboard/teacher/create-course"
            className="text-gray-300 hover:text-white"
          >
            Создать курс
          </Link>
          <Link
            href="/dashboard/teacher/settings"
            className="text-gray-300 hover:text-white"
          >
            Настройки
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-xl font-semibold">
          Добро пожаловать, {session.user?.name}!
        </h2>
        <p className="mt-2 text-gray-300">
          Здесь вы можете управлять своими курсами, добавлять дисциплины, тесты и задания.
        </p>

        {/* Секция с курсами */}
        <section className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Мои курсы</h3>
          {courses.length === 0 ? (
            <p className="text-gray-300">У вас пока нет курсов.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-700 text-left">
                      Название курса
                    </th>
                    <th className="py-2 px-4 border-b border-gray-700 text-left">
                      Описание
                    </th>
                    <th className="py-2 px-4 border-b border-gray-700 text-left">
                      Дата создания
                    </th>
                    <th className="py-2 px-4 border-b border-gray-700 text-left">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td className="py-2 px-4 border-b border-gray-700">
                        {course.title}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-700">
                        {course.description}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-700">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-700">
                        <Link
                          href={`/dashboard/teacher/edit-course/${course.id}`}
                          className="text-blue-400 hover:underline"
                        >
                          Редактировать
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
