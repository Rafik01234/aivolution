import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import StudentMyCourses from "@/components/StudentMyCourses";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { FaUserCircle } from "react-icons/fa";

export default async function StudentMyCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STUDENT") {
    redirect("/auth/login");
  }
  
  // Получаем записи о том, на какие курсы студент записался
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: session.user.id },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });
  
  // Преобразуем записи в массив курсов
  const courses = enrollments.map((enrollment) => enrollment.course);

  // Получаем фото профиля студента
  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { photo: true },
  });
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-3">
      {/* Header */}
      <header className="bg-gray-800 shadow p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">AIvolution</h1>
          <p className="text-gray-300">Мои курсы</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/student" className="text-gray-300 hover:underline">
            Главная
          </Link>
          <Link href="/dashboard/student/my-courses" className="text-gray-300 hover:underline">
            Мои курсы
          </Link>
          <Link href="/dashboard/student/profile">
          {student?.photo ? (
            <img src={student.photo} alt="Профиль" className="w-10 h-10 rounded-full object-cover cursor-pointer" />
          ): (
              <FaUserCircle className="text-gray-300 text-3xl" />
            )}
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Основной контент: список курсов */}
      <StudentMyCourses courses={courses} />
    </div>
  );
}
