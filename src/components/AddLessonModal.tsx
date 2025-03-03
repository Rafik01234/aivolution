"use client";

import { useState, FormEvent } from "react";

type AddLessonModalProps = {
  courseId: number;
  onClose: () => void;
  onLessonAdded: () => void;
};

export default function AddLessonModal({ courseId, onClose, onLessonAdded }: AddLessonModalProps) {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/teacher/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, videoUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Ошибка при добавлении урока");
      } else {
        setMessage("Урок успешно добавлен");
        setTitle("");
        setVideoUrl("");
        onLessonAdded();
        // Закрываем окно после успешного добавления
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Ошибка при добавлении урока");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-400 p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Добавить урок</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-black">Название урока:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded bg-white text-black"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-black">Видео URL:</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2 border rounded bg-white text-black"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
              Отмена
            </button>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Добавить
            </button>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          {message && <p className="text-green-600 mt-2">{message}</p>}
        </form>
      </div>
    </div>
  );
}
