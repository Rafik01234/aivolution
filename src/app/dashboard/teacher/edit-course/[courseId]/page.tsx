import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import EditCourseForm from "@/components/EditCourseForm";

export default async function EditCoursePage({ params }: { params: { courseId: string } }) {
  // Ожидаем параметры маршрута перед использованием
  const { courseId } = await Promise.resolve(params);
  const id = parseInt(courseId);

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  const course = await prisma.course.findUnique({
    where: { id },
  });

  // Если курс не найден или не принадлежит текущему учителю, перенаправляем
  if (!course || course.teacherId !== session.user.id) {
    redirect("/dashboard/teacher/courses");
  }

  // Получаем список уникальных групп (из пользователей-студентов)
  const groups = await prisma.user.groupBy({
    by: ["groupName"],
    where: { role: "STUDENT", groupName: { not: null } },
  });
  const groupOptions = groups.map((g) => g.groupName).filter(Boolean) as string[];

  return (
    <div>
      <EditCourseForm course={course} groupOptions={groupOptions} />
    </div>
  );
}
