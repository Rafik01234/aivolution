import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import InfiniteCoursesCarousel from "@/components/InfiniteCoursesCarousel";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { FaUserCircle } from "react-icons/fa";
export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STUDENT") {
    redirect("/auth/login");
  }

  const studentGroup = session.user.groupName || null;
  if (!studentGroup) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <p>В вашем профиле не указана группа.</p>
      </div>
    );
  }

  // Курсы для данной группы
  const courses = await prisma.course.findMany({
    where: { group: studentGroup },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      previewPhoto: true,
      group: true,
    },
  });

  // Список ID курсов, на которые студент уже записался
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: session.user.id },
    select: { courseId: true },
  });
  const enrolledCourseIds = enrollments.map((e) => e.courseId);
  // Получаем фото профиля студента
const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { photo: true },
  });
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3">
      {/* Шапка */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">AIvolution</h1>
          <p className="text-gray-300">
            Добро пожаловать, {session.user?.name}!
          </p>
        </div>
        <div className="flex items-center space-x-4">
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

      {/* Карусель */}
      <InfiniteCoursesCarousel
        allCourses={courses}
        enrolledCourseIds={enrolledCourseIds}
      />
    </div>
  );
}
