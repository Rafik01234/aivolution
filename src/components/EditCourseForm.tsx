"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Course = {
  id: number;
  title: string;
  description: string;
  group: string | null;
  videoUrl: string | null;
};

type EditCourseFormProps = {
  course: Course;
  groupOptions: string[];
};

export default function EditCourseForm({ course, groupOptions }: EditCourseFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [videoUrl, setVideoUrl] = useState(course.videoUrl || "");
  const [selectedGroup, setSelectedGroup] = useState(course.group || (groupOptions[0] || ""));
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/teacher/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, videoUrl, group: selectedGroup }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Ошибка при обновлении курса");
      } else {
        setMessage("Курс успешно обновлен");
      }
    } catch (err: any) {
      setError(err.message || "Ошибка при обновлении курса");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить этот курс?")) return;
    try {
      const res = await fetch(`/api/teacher/courses/${course.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Ошибка при удалении курса");
      } else {
        // После успешного удаления перенаправляем пользователя на страницу со списком курсов
        router.push("/dashboard/teacher/courses");
      }
    } catch (err: any) {
      setError(err.message || "Ошибка при удалении курса");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Редактировать курс</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">Название курса:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Описание курса:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Видео URL:</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1">Выберите группу:</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          >
            {groupOptions.map((group, index) => (
              <option key={index} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Обновить курс
        </button>
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      {/* Кнопка для удаления курса */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Удалить курс
        </button>
      </div>
    </div>
  );
}
