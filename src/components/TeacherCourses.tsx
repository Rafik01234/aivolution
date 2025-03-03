// src/components/TeacherCourses.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

type Course = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  // Поле group, previewPhoto, etc. тоже могут быть
  group?: string | null;
  previewPhoto?: string | null;
};

type TeacherCoursesProps = {
  groupedCourses: Record<string, Course[]>;
};

export default function TeacherCourses({ groupedCourses }: TeacherCoursesProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedCourses, setExpandedCourses] = useState<Record<number, boolean>>({});

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
                  return (
                    <div key={course.id} className="mb-4 border-b border-gray-700 pb-2">
                      {/* Заголовок курса – кликабельный */}
                      <div className="flex justify-between items-center">
                        <div
                          className="cursor-pointer"
                          onClick={() => toggleCourse(course.id)}
                        >
                          <h3 className="text-lg font-bold">{course.title}</h3>
                        </div>
                        {/* Кнопка "Добавить урок" */}
                        <Link
                          href={`/dashboard/teacher/courses/${course.id}/lessons`}
                          className="text-green-400 hover:underline"
                        >
                          Список уроков
                        </Link>
                      </div>
                      {expanded && (
                        <div className="mt-2 ml-4">
                          <p className="mb-2">{course.description}</p>
                          <p className="text-sm text-gray-400">
                            Дата создания: {new Date(course.createdAt).toLocaleDateString()}
                          </p>
                          {/* Здесь можно вывести что-то ещё, например previewPhoto */}
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
