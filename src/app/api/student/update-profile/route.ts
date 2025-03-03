import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "STUDENT") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { name, email, bio, phone, major, year, groupName, photo } = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email, bio, phone, major, year, groupName, photo },
    });

    return NextResponse.json({
      message: "Профиль успешно обновлен",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        major: updatedUser.major,
        year: updatedUser.year,
        groupName: updatedUser.groupName,
        photo: updatedUser.photo,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
