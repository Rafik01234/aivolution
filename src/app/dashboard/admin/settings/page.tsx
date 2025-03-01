// src/app/dashboard/admin/settings/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminSettingsPageClient from "@/components/AdminSettingsPageClient";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }
  return <AdminSettingsPageClient session={session} />;
}
