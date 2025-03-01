"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggleButton from "@/components/ThemeToggleButton";

type AdminSettingsPageClientProps = {
  session: {
    user: {
      id: number;
      name: string;
      email: string;
      role: "ADMIN";
    };
  };
};

export default function AdminSettingsPageClient({ session }: AdminSettingsPageClientProps) {
  const router = useRouter();

  // Состояния для смены пароля
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Состояния для обновления профиля
  const [name, setName] = useState(session.user.name);
  const [email, setEmail] = useState(session.user.email);
  const [profileMessage, setProfileMessage] = useState("");

  // Обработка смены пароля
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Новые пароли не совпадают");
      return;
    }
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMessage("Пароль успешно изменен");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage(data.message || "Ошибка при изменении пароля");
      }
    } catch (error) {
      setPasswordMessage("Ошибка при изменении пароля");
    }
  };

  // Обработка обновления профиля
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage("");
    try {
      const res = await fetch("/api/admin/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMessage("Профиль успешно обновлен");
      } else {
        setProfileMessage(data.message || "Ошибка при обновлении профиля");
      }
    } catch (error) {
      setProfileMessage("Ошибка при обновлении профиля");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Настройки</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/dashboard/admin")}
            className="text-gray-600 dark:text-gray-300 hover:underline"
          >
            Панель администратора
          </button>
          <button
            onClick={() => signOut()}
            className="text-gray-600 dark:text-gray-300 hover:underline"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8">
        <h2 className="text-xl font-semibold">Настройки системы</h2>

        {/* Переключатель темы */}
        <div className="mb-6">
          <ThemeToggleButton />
        </div>

        {/* Секция смены пароля */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Смена пароля</h3>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block mb-1">Текущий пароль:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Новый пароль:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Подтвердите новый пароль:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Изменить пароль
            </button>
            {passwordMessage && <p className="mt-2">{passwordMessage}</p>}
          </form>
        </div>

        {/* Секция обновления профиля */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Обновление профиля</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
            <div>
              <label className="block mb-1">Имя:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Обновить профиль
            </button>
            {profileMessage && <p className="mt-2">{profileMessage}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}
