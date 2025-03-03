// src/app/dashboard/teacher/courses/[courseId]/lessons/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import TeacherLessonsPageClient from "@/components/TeacherLessonsPageClient";

export default async function TeacherLessonsPage({ params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  const courseId = parseInt(params.courseId);

  // Проверяем, что курс принадлежит текущему учителю
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });
  if (!course || course.teacherId !== session.user.id) {
    redirect("/dashboard/teacher/courses");
  }

  // Загружаем уроки
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { createdAt: "asc" },
  });

  // Преобразуем для клиентского компонента
  const lessonsData = lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    videoUrl: lesson.videoUrl,
    createdAt: lesson.createdAt,
  }));

  return (
    <TeacherLessonsPageClient
      course={course}
      lessons={lessonsData}
    />
  );
}
