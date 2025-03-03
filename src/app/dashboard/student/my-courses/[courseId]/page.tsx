import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import StudentCoursePageClient from "@/components/StudentCoursePageClient";

export default async function StudentCourseDetailPage({ params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STUDENT") {
    redirect("/auth/login");
  }
  
  const courseId = parseInt(params.courseId, 10);

  // Проверяем, что студент записан на этот курс
  const enrollment = await prisma.enrollment.findFirst({
    where: { studentId: session.user.id, courseId },
    include: { course: true },
  });
  if (!enrollment) {
    redirect("/dashboard/student/my-courses");
  }

  // Загружаем уроки курса
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { createdAt: "asc" },
  });

  const courseData = {
    id: enrollment.course.id,
    title: enrollment.course.title,
    description: enrollment.course.description,
    previewPhoto: enrollment.course.previewPhoto,
  };

  const lessonsData = lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    videoUrl: lesson.videoUrl,
  }));

  return <StudentCoursePageClient course={courseData} lessons={lessonsData} />;
}
