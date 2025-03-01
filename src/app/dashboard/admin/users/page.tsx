"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  groupName?: string | null;
};

export default function AdminUserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Поля формы для нового пользователя
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "TEACHER" | "STUDENT">("STUDENT");
  const [groupName, setGroup] = useState(""); // Новое состояние для группы

  // Функция для получения списка пользователей
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Ошибка получения пользователей");
      const data = await res.json();
      setUsers(data.users);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки пользователей");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Функция для добавления нового пользователя
  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role, groupName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Ошибка при добавлении пользователя");
      }
      await fetchUsers();
      setName("");
      setEmail("");
      setPassword("");
      setRole("STUDENT");
      setGroup(""); // сбрасываем группу
    } catch (err: any) {
      setError(err.message || "Ошибка");
    }
  };

  // Функция для удаления пользователя
  const handleDeleteUser = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить пользователя?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Ошибка при удалении пользователя");
      }
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Ошибка");
    }
  };

  return (
    <div className="relative p-6">
      {/* Кнопка закрытия */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:shadow-lg"
      >
        <span className="text-black text-xl">&times;</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Управление пользователями</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Имя</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Роль</th>
              <th className="border p-2">Группа</th>
              <th className="border p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2 text-center">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2 text-center">{user.role}</td>
                <td className="border p-2 text-center">{user.groupName || "-"}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="text-xl font-semibold mb-2">Добавить пользователя</h2>
      <form onSubmit={handleAddUser} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Имя:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Роль:</label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "ADMIN" | "TEACHER" | "STUDENT")
            }
            className="border p-2 w-full"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="TEACHER">TEACHER</option>
            <option value="STUDENT">STUDENT</option>
          </select>
        </div>
        {role === "STUDENT" && (
  <div>
    <label className="block mb-1">Группа:</label>
    <input
      type="text"
      value={groupName}
      onChange={(e) => setGroup(e.target.value)}
      required
      className="border p-2 w-full"
    />
  </div>
)}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Добавить пользователя
        </button>
      </form>
    </div>
  );
}
