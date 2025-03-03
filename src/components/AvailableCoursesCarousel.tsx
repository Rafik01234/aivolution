"use client";

import { useRef } from "react";

type Course = {
  id: number;
  title: string;
  previewPhoto: string | null;
  group: string | null;
};

type AvailableCoursesCarouselProps = {
  courses: Course[];
  enrolledCourseIds: number[];
};

export default function AvailableCoursesCarousel({
  courses,
  enrolledCourseIds,
}: AvailableCoursesCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-[90%] max-w-6xl">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-3 rounded-full"
        >
          &larr;
        </button>
        <div
          ref={containerRef}
          className="flex overflow-x-auto space-x-6 scrollbar-hide px-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="w-[30%] min-w-[300px] flex-shrink-0 bg-white text-black rounded-lg shadow-md p-6 flex flex-col items-center"
              style={{ scrollSnapAlign: "start" }}
            >
              {course.previewPhoto ? (
                <img
                  src={course.previewPhoto}
                  alt={course.title}
                  className="w-full h-44 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-44 bg-gray-300 rounded mb-4 flex items-center justify-center">
                  Нет превью
                </div>
              )}
              <h3 className="text-lg font-bold mb-2">{course.title}</h3>
              <button
                onClick={() => alert("Записались")} // Замените на вызов onEnroll
                disabled={enrolledCourseIds.includes(course.id)}
                className={`mt-auto px-6 py-2 rounded ${
                  enrolledCourseIds.includes(course.id)
                    ? "bg-gray-500"
                    : "bg-green-500"
                } text-white`}
              >
                {enrolledCourseIds.includes(course.id)
                  ? "Записан"
                  : "Записаться"}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-3 rounded-full"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
