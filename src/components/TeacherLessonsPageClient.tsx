"use client";

import { useState } from "react";
import AddLessonModal from "./AddLessonModal";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

type Lesson = {
  id: number;
  title: string;
  videoUrl: string;
  createdAt: string;
};

type TeacherLessonsPageClientProps = {
  course: {
    id: number;
    title: string;
    description: string;
    group: string | null;
    previewPhoto: string | null;
  };
  lessons: Lesson[];
};

export default function TeacherLessonsPageClient({ course, lessons }: TeacherLessonsPageClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentLessons, setCurrentLessons] = useState<Lesson[]>(lessons);

  // Функция для обновления списка уроков (например, после добавления нового урока)
  const handleLessonAdded = async () => {
    // Простейший способ – просто перезагрузить страницу
    // Или можно вызвать mutate() через SWR, если используете его
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Управление уроками</h1>
          <p className="text-gray-300">Курс: {course.title}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/teacher/courses" className="text-gray-300 hover:underline">
            Назад к курсам
          </Link>
          <LogoutButton />
        </div>
      </header>
      
      <button
        onClick={() => setModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-6"
      >
        Добавить урок
      </button>
      
      {modalOpen && (
        <AddLessonModal
          courseId={course.id}
          onClose={() => setModalOpen(false)}
          onLessonAdded={handleLessonAdded}
        />
      )}
      
      <h2 className="text-2xl font-bold mb-4">Уроки курса</h2>
      {currentLessons.length === 0 ? (
        <p className="text-gray-300">У этого курса ещё нет уроков.</p>
      ) : (
        <ul className="space-y-4">
          {currentLessons.map((lesson) => (
            <li key={lesson.id} className="p-4 bg-gray-800 rounded shadow">
              <h3 className="text-xl font-bold">{lesson.title}</h3>
              <p className="mt-2">
                Видео:{" "}
                <a
                  href={lesson.videoUrl}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lesson.videoUrl}
                </a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
