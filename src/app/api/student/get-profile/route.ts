import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const id = parseInt(searchParams.get("id") || "", 10);
  
      console.log("Полученный ID:", id); // Логируем ID
  
      if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
      }
  
      const profile = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          phone: true,
          major: true,
          year: true,
          groupName: true,
          photo: true,
        },
      });
  
      console.log("Найденный профиль:", profile); // Логируем результат
  
      if (!profile) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json(profile, { status: 200 });
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }