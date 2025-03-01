// src/app/courses/[id].tsx
import { useRouter } from 'next/router';

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">Курс: {id}</h2>
      <p>Описание курса и материалы.</p>
    </div>
  );
}
