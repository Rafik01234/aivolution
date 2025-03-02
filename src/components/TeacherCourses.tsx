"use client";

import { useState } from "react";

type Course = {
  id: number;
  title: string;
  description: string;
  videoUrl?: string | null;
  createdAt: string;
  groupName: string | null;
};

type TeacherCoursesProps = {
  groupedCourses: Record<string, Course[]>;
};

export default function TeacherCourses({ groupedCourses }: TeacherCoursesProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedCourses, setExpandedCourses] = useState<Record<number, boolean>>({});

  // Функция для извлечения embed-ссылки (например, из обычного YouTube URL)
  const getEmbedUrl = (url: string) => {
    // Если не хотите парсить, можно сразу возвращать url:
    // return url;
    // Но ниже пример для YouTube:
    try {
      // Ищем video ID в ссылке (например, ?v=..., /embed/..., .be/...)
      const videoIdMatch = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
      }
    } catch (error) {
      console.error("Ошибка извлечения ID видео:", error);
    }
    // Если не удалось, возвращаем исходную ссылку (iframe может не работать для других сайтов)
    return url;
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const toggleCourse = (courseId: number) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Мои курсы</h1>
      {Object.keys(groupedCourses).length === 0 ? (
        <p>У вас пока нет курсов.</p>
      ) : (
        Object.keys(groupedCourses).map((groupName) => (
          <div key={groupName} className="mb-6">
            {/* Заголовок группы – кликабельный */}
            <div
              className="cursor-pointer bg-gray-800 p-2 rounded"
              onClick={() => toggleGroup(groupName)}
            >
              <h2 className="text-xl font-semibold">{groupName}</h2>
            </div>
            {expandedGroups[groupName] && (
              <div className="mt-2 ml-4">
                {groupedCourses[groupName].map((course) => {
                  const expanded = expandedCourses[course.id];
                  const embedUrl =
                    course.videoUrl && course.videoUrl !== ""
                      ? getEmbedUrl(course.videoUrl)
                      : null;

                  return (
                    <div key={course.id} className="mb-4 border-b border-gray-700 pb-2">
                      {/* Заголовок курса – кликабельный */}
                      <div className="cursor-pointer" onClick={() => toggleCourse(course.id)}>
                        <h3 className="text-lg font-bold">{course.title}</h3>
                      </div>
                      {expanded && (
                        <div className="mt-2 ml-4">
                          <p className="mb-2">{course.description}</p>
                          {embedUrl ? (
                            <div className="aspect-video">
                              <iframe
                                src={embedUrl}
                                width="100%"
                                height="100%"
                                className="rounded"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : (
                            <p className="text-gray-400">
                              Видео не указано или не поддерживается.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
