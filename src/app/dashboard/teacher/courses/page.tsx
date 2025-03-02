import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import TeacherCourses from "@/components/TeacherCourses";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default async function TeacherCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    redirect("/auth/login");
  }
  
  // Получаем все курсы, созданные данным учителем
  const courses = await prisma.course.findMany({
    where: { teacherId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Группируем курсы по полю group. Если group отсутствует, группируем под "Без группы"
  const groupedCourses = courses.reduce((acc: Record<string, typeof courses>, course) => {
    const groupName = course.group || "Без группы";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(course);
    return acc;
  }, {} as Record<string, typeof courses>);

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
      <TeacherCourses groupedCourses={groupedCourses} />
    </div>
  );
}
