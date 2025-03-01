// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Обработка GET и POST запросов для управления пользователями
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        groupName: true,
      },
    });
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Ошибка получения пользователей:", error);
    return NextResponse.json(
      { message: "Ошибка получения пользователей" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  // Проверяем, что запрос выполняет администратор
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { name, email, password, role, groupName } = await request.json();
  // Импортируем bcryptjs для хеширования пароля
  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        groupName: role === "STUDENT" ? groupName : null,
      },
    });
    return NextResponse.json({ user: newUser });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
