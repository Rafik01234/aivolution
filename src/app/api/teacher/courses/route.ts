// src/app/api/teacher/courses/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  
  const { title, description, group, videoUrl } = await request.json();
  
  try {
    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        teacherId: session.user.id,
        group,      // Сохраняем выбранную группу
        videoUrl,   // Сохраняем URL видео (если указано)
      },
    });
    return NextResponse.json({ course: newCourse });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
