
"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, FormEvent } from "react";
import useSWR from "swr";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { FaUserCircle } from "react-icons/fa";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StudentProfile() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data: profile, error, mutate } = useSWR(
    userId ? `/api/student/get-profile?id=${userId}` : null,
    fetcher
  );

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
        mutate();
      }
    } catch (err: any) {
      setFormError(err.message || "Ошибка при обновлении профиля");
    }
  };

  if (status === "loading") return <div className="min-h-screen bg-gray-900 text-white p-6">Загрузка...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 text-white p-6">Ошибка загрузки профиля</div>;
  if (!profile) return <div className="min-h-screen bg-gray-900 text-white p-6">Нет данных профиля</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3">
    <header className="bg-gray-800 shadow p-4 flex justify-between items-center ">
    <div>
        <h1 className="text-2xl font-bold">AIvolution</h1>
        <p className="text-gray-300">Мои курсы</p>
      </div>
    <div className="flex items-center space-x-4">
        <Link href="/dashboard/student" className="text-gray-300 hover:underline">
          Главная
        </Link>
        <Link href="/dashboard/student/my-courses" className="text-gray-300 hover:underline">
          Мои курсы
        </Link>
        <Link href="/dashboard/student/profile">
          {photo ? (
            <img src={photo} alt="Профиль" className="w-10 h-10 rounded-full object-cover cursor-pointer" />
          ) : (
            <FaUserCircle className="text-gray-300 text-3xl" />
          )}
        </Link>
        <LogoutButton />
        </div>
    </header>

      <div className="p-6">
        <div className="flex flex-col items-center mb-6">
          {photo ? (
            <img src={photo} alt="Профиль" className="w-32 h-32 rounded-full object-cover border-4 border-gray-700" />
          ) : (
            <FaUserCircle className="w-32 h-32 text-gray-500" />
          )}
          <label className="mt-2 text-blue-400 cursor-pointer">
            Изменить фото
            <input type="file" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPhoto(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Имя:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded bg-gray-800 text-white" required />
              </div>
              <div>
                <label className="block mb-1">Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded bg-gray-800 text-white" required />
              </div>
              <div>
                <label className="block mb-1">Группа:</label>
                <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="w-full p-2 border rounded bg-gray-800 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">О себе:</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 border rounded bg-gray-800 text-white" />
              </div>
              <div>
                <label className="block mb-1">Телефон:</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded bg-gray-800 text-white" />
              </div>
              <div>
                <label className="block mb-1">Специальность:</label>
                <input type="text" value={major} onChange={(e) => setMajor(e.target.value)} className="w-full p-2 border rounded bg-gray-800 text-white" />
              </div>
              <div>
                <label className="block mb-1">Год обучения:</label>
                <input type="text" value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-2 border rounded bg-gray-800 text-white" />
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-green-500 cursor-pointer">
              Обновить профиль
            </button>
          </div>
          {formError && <p className="text-red-500 mt-2 text-center">{formError}</p>}
          {message && <p className="text-green-500 mt-2 text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}
