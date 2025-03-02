// src/app/dashboard/teacher/edit-course/[id]/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import EditCourseForm from "@/components/EditCourseForm";

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  // Ожидаем параметры маршрута перед использованием
  const { id } = await Promise.resolve(params);
  const courseId = parseInt(id);

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  // Если курс не найден или не принадлежит текущему учителю, перенаправляем
  if (!course || course.teacherId !== session.user.id) {
    redirect("/dashboard/teacher/courses");
  }

  // Получаем список уникальных групп, где есть студенты
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
