// src/app/dashboard/teacher/settings/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import TeacherSettingsPageClient from "@/components/TeacherSettingsPageClient";

export default async function TeacherSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    redirect("/auth/login");
  }
  return <TeacherSettingsPageClient session={session} />;
}
