"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, FormEvent } from "react";
import useSWR from "swr";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StudentProfile() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  
  // Получаем профиль студента через SWR по его ID
  const { data: profile, error, mutate } = useSWR(
    userId ? `/api/student/get-profile?id=${userId}` : null,
    fetcher
  );

  // Состояния для всех полей профиля
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [groupName, setGroupName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [photo, setPhoto] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Устанавливаем значения полей после получения профиля
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setGroupName(profile.groupName || "");
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
      setMajor(profile.major || "");
      setYear(profile.year || "");
      setPhoto(profile.photo || "");
    }
  }, [profile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/student/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, groupName, bio, phone, major, year, photo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || "Ошибка при обновлении профиля");
      } else {
        setMessage("Профиль успешно обновлен");
        mutate(); // Обновляем данные профиля после успешного обновления
      }
    } catch (err: any) {
      setFormError(err.message || "Ошибка при обновлении профиля");
    }
  };

  if (status === "loading") return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки профиля</div>;
  if (!profile) return <div>Нет данных профиля</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3">
      {/* Header */}
      <header className="bg-gray-800 shadow p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-gray-300">Профиль студента</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/student" className="text-gray-300 hover:underline">
            Главная
          </Link>
          <Link href="/dashboard/student/profile" className="text-gray-300 hover:underline">
            Профиль
          </Link>
          <Link href="/dashboard/student/my-courses" className="text-gray-300 hover:underline">
            Мои курсы
          </Link>
          <LogoutButton />
        </div>
      </header>
      
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 mt-5">
        <div>
          <label className="block mb-1">Имя:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Группа:</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1">О себе (Bio):</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1">Телефон:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1">Специальность:</label>
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1">Год обучения:</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1">URL фотографии:</label>
          <input
            type="url"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Обновить профиль
        </button>
        {formError && <p className="text-red-500 mt-2">{formError}</p>}
        {message && <p className="text-green-500 mt-2">{message}</p>}
      </form>
    </div>
  );
}
