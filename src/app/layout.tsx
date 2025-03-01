// src/app/layout.tsx
import "./globals.css";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "AIvolution",
  description: "Платформа дистанционного обучения",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
