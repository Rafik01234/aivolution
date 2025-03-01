import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl mb-4">Добро пожаловать в AIvolution!</h1>
      <div className="flex gap-4">
        <Link href="/auth/login" className="bg-blue-500 text-white p-2 rounded">
          Войти
        </Link>
        <Link
          href="/auth/register"
          className="bg-green-500 text-white p-2 rounded"
        >
          Зарегистрироваться
        </Link>
      </div>
    </main>
  );
}
