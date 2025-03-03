import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function TeacherCourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  const courseId = parseInt(params.id);
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course || course.teacherId !== session.user.id) {
    return (
      <div className="min-h-screen p-6 bg-gray-900 text-white">
        <p>Курс не найден или доступ запрещен.</p>
      </div>
    );
  }

  // Функция для преобразования обычного YouTube URL в embed-ссылку (если применимо)
  const getEmbedUrl = (url: string) => {
    try {
      const videoIdMatch = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
      }
    } catch (error) {
      console.error("Ошибка преобразования URL:", error);
    }
    return url;
  };

  const embedUrl = course.videoUrl ? getEmbedUrl(course.videoUrl) : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="mt-4 text-gray-300">{course.description}</p>
      {embedUrl && (
        <div className="mt-6">
          <iframe
            width="100%"
            height="500"
            src={embedUrl}
            title="Видео курса"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}
