// src/app/auth/register.tsx
export default function Register() {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold">Регистрация</h2>
        <form className="flex flex-col space-y-4">
          <input type="text" placeholder="Имя" className="p-2 border rounded" />
          <input type="email" placeholder="Email" className="p-2 border rounded" />
          <input type="password" placeholder="Пароль" className="p-2 border rounded" />
          <button type="submit" className="p-2 bg-green-500 text-white rounded">
            Зарегистрироваться
          </button>
        </form>
      </div>
    );
  }
  