// src/app/dashboard/teacher/create-course/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import LogoutButton from "@/components/LogoutButton";
import CreateCourseForm from "@/components/CreateCourseForm";

export default async function CreateCoursePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  // Получаем список уникальных групп студентов (значения из поля group)
  const groups = await prisma.user.groupBy({
    by: ["groupName"],
    where: { role: "STUDENT", groupName: { not: null } },
  });
  // Преобразуем в массив строк (убираем возможные null)
  const groupOptions = groups.map((g) => g.groupName).filter(Boolean) as string[];

  return (
    <div>
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
      <CreateCourseForm groupOptions={groupOptions} />
    </div>
  );
}
