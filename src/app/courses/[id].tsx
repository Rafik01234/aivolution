// src/app/courses/[id].tsx
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
  // Извлекаем id курса из URL
  const params = useParams();
  const courseId = params.id;

  // В реальном проекте здесь можно сделать запрос к базе данных или API,
  // чтобы получить подробную информацию о курсе по courseId.

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Детали курса</h1>
      <p className="text-gray-700">Здесь будет информация по курсу с ID: {courseId}</p>
      {/* Добавьте дополнительную информацию о курсе, такую как описание, программа курса, отзывы и т.д. */}
    </div>
  );
}
