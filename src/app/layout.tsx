import "./globals.css";
import { ThemeProvider } from "next-themes";
import SessionWrapper from "@/components/SessionWrapper"; // <-- Подключаем

export const metadata = {
  title: "AIvolution",
  description: "Платформа дистанционного обучения",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <SessionWrapper> {/* ✅ Теперь провайдер в клиентском компоненте */}
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
