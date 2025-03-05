"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { FaUserCircle } from "react-icons/fa";
type Course = {
  id: number;
  title: string;
  description: string;
  previewPhoto?: string | null;
};

type Lesson = {
  id: number;
  title: string;
  videoUrl: string;
};

type StudentLessonDetailProps = {
  course: Course;
  lesson: Lesson;
  profilePhoto?: string | null;  // Теперь передаем фото с сервера
};

export default function StudentLessonDetail({ course, lesson, profilePhoto }: StudentLessonDetailProps) {
  // Функция для преобразования YouTube URL в embed-ссылку
  const getEmbedUrl = (url: string) => {
    try {
      const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    } catch (error) {
      console.error("Ошибка преобразования URL:", error);
    }
    return url;
  };

  const embedUrl = getEmbedUrl(lesson.videoUrl);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3">
      {/* Header */}
      <header className="bg-gray-800 shadow p-4 flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-bold">AIvolution</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/student" className="text-gray-300 hover:underline">
            Главная
          </Link>
          <Link href="/dashboard/student/my-courses" className="text-gray-300 hover:underline">
            Мои курсы
          </Link>
          {/* Фото профиля или иконка */}
          <Link href="/dashboard/student/profile">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Профиль" className="w-10 h-10 rounded-full object-cover cursor-pointer" />
          ): (
              <FaUserCircle className="text-gray-300 text-3xl" />
            )}
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Контент урока */}
      <main>
        {/* Кликабельное название курса */}
        <h2 className="text-3xl font-bold mb-5 ml-3">
          <Link href={`/dashboard/student/my-courses/${course.id}`} className="hover:underline">
            {course.title}
          </Link>
        </h2>
        {/* Название урока */}
        <h3 className="text-2xl font-bold mb-4 ml-3">{lesson.title}</h3>
        {/* Видео плеер */}
        <div className="w-full max-w-3xl mx-auto">
          <iframe
            src={embedUrl}
            width="100%"
            height="500"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded"
          ></iframe>
        </div>
      </main>
    </div>
  );
}
