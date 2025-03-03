// src/app/api/student/enroll-course/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  
  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json({ message: "CourseId required" }, { status: 400 });
  }
  
  try {
    const existing = await prisma.enrollment.findFirst({
      where: { studentId: session.user.id, courseId },
    });
    if (existing) {
      return NextResponse.json({ message: "Вы уже записаны на этот курс" }, { status: 400 });
    }
    
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: session.user.id,
        courseId,
      },
    });
    return NextResponse.json({ message: "Вы успешно записались", enrollment });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
