import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(form);

      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "teacher") navigate("/courses");
      else navigate("/student/courses");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">AI</div>
        <h1>Вход в AIvolution</h1>
        <p>Войдите, чтобы продолжить обучение или управление курсами.</p>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={submit} className="form">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="btn primary" disabled={loading}>
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>

        <div className="auth-bottom">
          Нет аккаунта? <Link to="/register">Создать аккаунт</Link>
        </div>
      </div>
    </div>
  );
}