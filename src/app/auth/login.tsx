// src/app/auth/login.tsx
export default function Login() {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold">Вход в систему</h2>
        <form className="flex flex-col space-y-4">
          <input type="email" placeholder="Email" className="p-2 border rounded" />
          <input type="password" placeholder="Пароль" className="p-2 border rounded" />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Войти
          </button>
        </form>
      </div>
    );
  }
  