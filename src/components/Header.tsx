// src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AIvolution
        </Link>
        <nav>
          <Link href="/courses" className="mr-4">
            Курсы
          </Link>
          <Link href="/dashboard" className="mr-4">
            Кабинет
          </Link>
          <Link href="/auth/login">Войти</Link>
        </nav>
      </div>
    </header>
  );
}
