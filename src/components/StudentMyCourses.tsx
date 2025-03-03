"use client";

import Link from "next/link";

type Course = {
  id: number;
  title: string;
  description: string;
  previewPhoto?: string | null;
};

type StudentMyCoursesProps = {
  courses: Course[];
};

export default function StudentMyCourses({ courses }: StudentMyCoursesProps) {
  if (courses.length === 0) {
    return (
      <main className="p-6">
        <h2 className="text-xl font-bold mb-4">Мои курсы</h2>
        <p className="text-gray-300">Вы ещё не записались ни на один курс.</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h2 className="text-xl font-bold mb-4">Мои курсы</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-gray-800 rounded shadow p-4 flex flex-col">
            {course.previewPhoto ? (
              <img
                src={course.previewPhoto}
                alt={course.title}
                className="w-full h-60 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-40 bg-gray-700 rounded mb-2 flex items-center justify-center">
                Нет превью
              </div>
            )}
            <h3 className="text-lg font-bold mb-2">{course.title}</h3>
            <p className="text-sm text-gray-300 mb-4">{course.description}</p>
            <Link
              href={`/dashboard/student/my-courses/${course.id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-auto text-center hover:underline"
            >
              Посмотреть курс
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
