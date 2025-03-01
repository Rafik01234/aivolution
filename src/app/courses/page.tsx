// src/app/courses/page.tsx
import Link from "next/link";

// Пример данных – позже можно заменить реальными данными из базы или API
const courses = [
  { id: 1, title: "Введение в ИИ", description: "Основы искусственного интеллекта." },
  { id: 2, title: "Основы программирования", description: "Базовый курс по программированию." },
  { id: 3, title: "Машинное обучение", description: "Курс по алгоритмам машинного обучения." },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Доступные курсы</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <Link
              href={`/courses/${course.id}`}
              className="text-blue-500 hover:underline"
            >
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
