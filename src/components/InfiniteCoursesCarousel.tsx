"use client";

import { useState } from "react";

type Course = {
  id: number;
  title: string;
  previewPhoto: string | null;
  group: string | null;
};

type InfiniteCoursesCarouselProps = {
  allCourses: Course[];
  enrolledCourseIds: number[];
};

export default function InfiniteCoursesCarousel({
  allCourses,
  enrolledCourseIds,
}: InfiniteCoursesCarouselProps) {
  // Локальное состояние массива курсов
  const [courses, setCourses] = useState<Course[]>(allCourses);

  // Сдвигаем массив вправо: первый элемент уходит в конец
  const handleRight = () => {
    if (courses.length > 1) {
      const first = courses.shift();
      if (first) {
        courses.push(first);
        setCourses([...courses]);
      }
    }
  };

  // Сдвигаем массив влево: последний элемент уходит в начало
  const handleLeft = () => {
    if (courses.length > 1) {
      const last = courses.pop();
      if (last) {
        courses.unshift(last);
        setCourses([...courses]);
      }
    }
  };

  // Берём ровно 3 карточки для отображения
  const visibleCourses = courses.slice(0, 3);

  // Обработчик записи (для кнопки «Записаться»)
  const onEnroll = async (courseId: number) => {
    try {
      const res = await fetch("/api/student/enroll-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      if (res.ok) {
        alert("Вы успешно записались на курс");
      } else {
        const data = await res.json();
        alert("Ошибка: " + data.message);
      }
    } catch (err: any) {
      alert("Ошибка: " + err.message);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen px-[20px] pb-[50px] flex flex-col items-center">
      {/* Верхняя панель со стрелками и заголовком */}
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={handleLeft}
          className="text-5xl text-gray-200 hover:text-gray-100 px-4 py-2"
        >
          &larr;
        </button>
        <h1 className="text-3xl font-bold">Курсы для вашей группы</h1>
        <button
          onClick={handleRight}
          className="text-5xl text-gray-200 hover:text-gray-100 px-4 py-2"
        >
          &rarr;
        </button>
      </div>

      {/* Контейнер карусели */}
      <div className="w-full overflow-hidden">
        <div className="flex space-x-25">
          {visibleCourses.map((course) => (
            <div
              key={course.id}
              className="w-[30%] min-w-[250px] bg-gray-800 text-light rounded-lg shadow-md p-6 flex flex-col items-center"
            >
              {course.previewPhoto ? (
                <img
                  src={course.previewPhoto}
                  alt={course.title}
                  className="w-full h-70 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-44 bg-gray-300 rounded mb-4 flex items-center justify-center">
                  Нет превью
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <button
                onClick={() => onEnroll(course.id)}
                disabled={enrolledCourseIds.includes(course.id)}
                className={`mt-auto px-6 py-2 rounded ${
                  enrolledCourseIds.includes(course.id)
                    ? "bg-gray-500"
                    : "bg-green-500"
                }`}
              >
                {enrolledCourseIds.includes(course.id) ? "Записан" : "Записаться"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
