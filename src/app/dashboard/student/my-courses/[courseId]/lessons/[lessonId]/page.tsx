import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import StudentLessonDetail from "@/components/StudentLessonDetail";

export default async function StudentLessonDetailPage({ params }: { params: { courseId: string; lessonId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STUDENT") {
    redirect("/auth/login");
  }
  
  const courseId = parseInt(params.courseId, 10);
  const lessonId = parseInt(params.lessonId, 10);
  
  // Проверяем, что студент записан на этот курс
  const enrollment = await prisma.enrollment.findFirst({
    where: { studentId: session.user.id, courseId },
    include: { course: true },
  });
  if (!enrollment) {
    redirect("/dashboard/student/my-courses");
  }
  
  // Получаем урок
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });
  
  if (!lesson || lesson.courseId !== courseId) {
    redirect(`/dashboard/student/my-courses/${courseId}`);
  }
  
  const course = enrollment.course;
  
  return <StudentLessonDetail course={course} lesson={lesson} />;
}
