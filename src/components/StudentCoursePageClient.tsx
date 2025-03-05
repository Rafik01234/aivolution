"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { FaUserCircle } from "react-icons/fa";

type Lesson = {
  id: number;
  title: string;
  videoUrl: string;
};

type Course = {
  id: number;
  title: string;
  description: string;
  previewPhoto?: string | null;
};

type StudentCoursePageClientProps = {
  course: Course;
  lessons: Lesson[];
  profilePhoto?: string | null; 
};

export default function StudentCoursePageClient({ course, lessons, profilePhoto }: StudentCoursePageClientProps) {
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

      {/* Контент курса */}
      <main>
        {/* Кликабельное название курса */}
        <h1 className="text-3xl font-bold mb-2">
          <Link href={`/dashboard/student/my-courses/${course.id}`} className="hover:underline">
            {course.title}
          </Link>
        </h1>
        <h2 className="text-xl text-gray-300 mb-6">{course.description}</h2>
        

        {/* Список уроков */}
        <h2 className="text-2xl font-bold mb-4">Уроки курса</h2>
        {lessons.length === 0 ? (
          <p className="text-gray-400">В этом курсе пока нет уроков.</p>
        ) : (
          <ul className="space-y-4">
            {lessons.map((lesson) => (
              <li key={lesson.id} className="bg-gray-800 p-4 rounded hover:bg-gray-700 transition-colors">
                <Link href={`/dashboard/student/my-courses/${course.id}/lessons/${lesson.id}`}>
                  <h3 className="text-xl font-bold hover:underline">{lesson.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
