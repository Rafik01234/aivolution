// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Проверка обязательных полей
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Заполните все обязательные поля" },
        { status: 400 }
      );
    }

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Пользователь с таким email уже существует" },
        { status: 400 }
      );
    }

    // Хеширование пароля с использованием bcryptjs (12 раундов)
    const hashedPassword = await hash(password, 12);

    // Создание нового пользователя в базе
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error: any) {
    console.error("Ошибка регистрации:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
