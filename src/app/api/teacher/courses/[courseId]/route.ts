import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: Request, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  const id = parseInt(params.courseId);
  let payload;
  try {
    payload = await request.json();
    console.log("Получен payload:", payload);
  } catch (error) {
    console.error("Ошибка парсинга JSON:", error);
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  
  const { title, description, videoUrl, group } = payload;
  
  try {
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        videoUrl,
        group,  // Если в модели Course поле называется group
      },
    });
    return NextResponse.json({ course: updatedCourse });
  } catch (error: any) {
    console.error("Ошибка обновления курса:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
  const id = parseInt(params.courseId);
  try {
    await prisma.course.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Курс успешно удален" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
