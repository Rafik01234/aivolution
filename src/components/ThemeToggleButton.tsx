"use client";

import { useState, useEffect } from "react";

export default function ThemeToggleButton() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // При загрузке проверяем сохранённое значение темы
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
      console.log("Установлена тема: dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
      console.log("Установлена тема: light");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
      console.log("Переключение на светлую тему");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
      console.log("Переключение на тёмную тему");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded"
    >
      {darkMode ? "Светлая тема" : "Тёмная тема"}
    </button>
  );
}
