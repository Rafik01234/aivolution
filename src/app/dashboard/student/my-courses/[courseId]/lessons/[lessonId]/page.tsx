import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import StudentLessonDetail from "@/components/StudentLessonDetail";

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STUDENT") {
    redirect("/auth/login");
  }

  // Получаем данные урока
  const lesson = await prisma.lesson.findUnique({
    where: { id: parseInt(params.lessonId) },
    include: { course: true },
  });

  if (!lesson) {
    return <div className="text-white">Урок не найден</div>;
  }

  // Получаем фото профиля студента
  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { photo: true },
  });

  return (
    <StudentLessonDetail 
      course={lesson.course} 
      lesson={lesson} 
      profilePhoto={student?.photo || null} 
    />
  );
}
