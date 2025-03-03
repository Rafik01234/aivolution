// src/app/api/teacher/courses/[courseId]/lessons/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: получение списка уроков для курса
export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  const courseId = parseInt(params.courseId);
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ lessons });
}

// POST: добавление нового урока в курс
export async function POST(request: Request, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  
  const courseId = parseInt(params.courseId);
  const { title, videoUrl } = await request.json();
  
  try {
    // Проверяем, что курс принадлежит текущему учителю
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.teacherId !== session.user.id) {
      return NextResponse.json({ message: "Курс не найден или доступ запрещен" }, { status: 403 });
    }
    
    const newLesson = await prisma.lesson.create({
      data: {
        title,
        videoUrl,
        courseId,
      },
    });
    return NextResponse.json({ lesson: newLesson });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
