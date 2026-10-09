import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

 const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  group_name: "",
});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(form);
      setSuccess("Аккаунт создан. Теперь войдите.");
      setTimeout(() => navigate("/login"), 900);
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
        <h1>Создать аккаунт</h1>
        <p>Создайте студенческий аккаунт. Роль преподавателя назначает администратор.</p>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={submit} className="form">
          <input
            placeholder="ФИО"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

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

          <input
            placeholder="Группа, например CS-24"
            value={form.group_name}
            onChange={(e) => setForm({ ...form, group_name: e.target.value })}
          />

          <button className="btn primary" disabled={loading}>
            {loading ? "Создаем..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="auth-bottom">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
}