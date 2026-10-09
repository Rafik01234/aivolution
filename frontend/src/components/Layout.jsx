import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AIChat from "./AIChat";

export default function Layout() {
  const { user, logout } = useAuth();

  const roleLabel = {
    admin: "Администратор",
    teacher: "Преподаватель",
    student: "Студент",
  };

  return (
    <>
      <div className="app-shell">
        <aside className="sidebar">
          <Link to="/dashboard" className="brand">
            <span className="brand-mark">AI</span>
            <span>AIvolution</span>
          </Link>

          <nav className="nav">
            <NavLink to="/dashboard">Главная</NavLink>
            <NavLink to="/profile">Профиль</NavLink>

            {user?.role === "admin" && (
              <NavLink to="/admin">Пользователи</NavLink>
            )}

            {user?.role === "teacher" && (
              <>
                <NavLink to="/courses">Курсы</NavLink>
                <NavLink to="/teacher/students">Студенты</NavLink>
              </>
            )}

            {user?.role === "student" && (
              <>
                <NavLink to="/student/courses">Все курсы</NavLink>
                <NavLink to="/student/my-courses">Мои курсы</NavLink>
                <NavLink to="/student/grades">Оценки</NavLink>
              </>
            )}
          </nav>

          <div className="sidebar-user">
            <div>
              <strong>{user?.name}</strong>
              <p>{roleLabel[user?.role]}</p>
            </div>
            <button onClick={logout}>Выйти</button>
          </div>
        </aside>

        <main className="main">
          <Outlet />
        </main>
      </div>

      <AIChat />
    </>
  );
}