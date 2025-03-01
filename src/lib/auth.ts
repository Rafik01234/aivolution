// src/lib/auth.ts
// Пример утилиты для авторизации

export async function login(email: string, password: string) {
    // Отправка запроса на API для входа
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  }
  