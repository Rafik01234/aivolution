// src/app/api/courses/route.ts (пример для POST запроса)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  // Проверяем, что роль - преподаватель (или админ, если разрешаем им)
  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { title, description } = await request.json();
  
  // Если пользователь - преподаватель, его ID используется для привязки курса
  const teacherId = session.user.role === "TEACHER" ? session.user.id : null;

  // Администратор может создать курс, указав teacherId в теле запроса (опционально)
  const course = await prisma.course.create({
    data: {
      title,
      description,
      teacherId: teacherId || null, // или взять teacherId из запроса, если ADMIN
    },
  });

  return NextResponse.json({ course });
}
