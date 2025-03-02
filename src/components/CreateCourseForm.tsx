"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type CreateCourseFormProps = {
  groupOptions: string[];
};

export default function CreateCourseForm({ groupOptions }: CreateCourseFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(groupOptions[0] || "");
  const [videoUrl, setVideoUrl] = useState(""); // Новое состояние для видео URL
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/teacher/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, group: selectedGroup, videoUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Ошибка при создании курса");
      } else {
        setMessage("Курс успешно создан");
        setTitle("");
        setDescription("");
        setVideoUrl("");
        // router.push("/dashboard/teacher/courses"); // При необходимости редирект
      }
    } catch (err: any) {
      setError(err.message || "Ошибка при создании курса");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Создать курс</h1>
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
          Создать курс
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {message && <p className="text-green-500 mt-2">{message}</p>}
      </form>
    </div>
  );
}
