// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AIvolution Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Link href="/courses" className="text-gray-600 hover:text-gray-900">
            Курсы
          </Link>
          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            Профиль
          </Link>
          <Link href="/settings" className="text-gray-600 hover:text-gray-900">
            Настройки
          </Link>
          <LogoutButton />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-4 shadow">
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded"
            >
              Главная
            </Link>
            <Link
              href="/dashboard/activity"
              className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded"
            >
              Последние действия
            </Link>
            <Link
              href="/dashboard/notifications"
              className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded"
            >
              Уведомления
            </Link>
            <Link
              href="/dashboard/statistics"
              className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded"
            >
              Статистика
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Добро пожаловать, {session.user?.name || session.user?.email}!
            </h2>
            <p className="text-gray-600">
              Это ваш личный кабинет AIvolution.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Карточка: Последние действия */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Последние действия</h3>
              <ul className="text-gray-600 text-sm">
                <li>
                  Вы просмотрели курс "Введение в ИИ" - 10 минут назад
                </li>
                <li>
                  Вы прошли тест по курсу "Основы программирования" - 1 час назад
                </li>
                <li>
                  Новый комментарий в курсе "Машинное обучение" - 2 часа назад
                </li>
              </ul>
            </div>
            {/* Карточка: Уведомления */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Уведомления</h3>
              <ul className="text-gray-600 text-sm">
                <li>Обновлен курс "Нейронные сети"</li>
                <li>Новый материал в курсе "Анализ данных"</li>
                <li>Скидка на подписку - действуйте сейчас!</li>
              </ul>
            </div>
            {/* Карточка: Статистика */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Статистика</h3>
              <p className="text-gray-600 text-sm">
                Вы завершили 5 курсов, набрали 80% по тестам.
              </p>
            </div>
            {/* Карточка: Общая активность */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2">Общая активность</h3>
              <p className="text-gray-600 text-sm">
                Вы активно участвуете в обсуждениях и регулярно обновляете свои
                навыки.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
