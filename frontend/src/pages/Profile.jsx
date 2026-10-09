import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    group_name: "",
    avatar: "",
    specialization: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2200);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setProfile(data);
      setForm({
        name: data.name || "",
        group_name: data.group_name || "",
        avatar: data.avatar || "",
        specialization: data.specialization || "",
        bio: data.bio || "",
      });
    } catch {
      showToast("Ошибка загрузки профиля");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Профиль сохранен");
      setProfile(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      showToast(data.message || "Ошибка сохранения");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="empty-state">Загрузка профиля...</div>
      </div>
    );
  }

  return (
    <div className="page">
      {toast && <div className="toast">{toast}</div>}

      <div className="page-head">
        <div>
          <span className="eyebrow">User Profile</span>
          <h1>Профиль</h1>
          <p>Настройте личную информацию для работы с платформой.</p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar">
            {form.avatar ? (
              <img src={form.avatar} alt={form.name} />
            ) : (
              <span>{form.name?.charAt(0) || "U"}</span>
            )}
          </div>

          <h2>{profile?.name}</h2>
          <p>{profile?.email}</p>

          <div className="profile-role">
            {profile?.role}
          </div>

          <div className="profile-info-list">
            <div>
              <span>Группа</span>
              <strong>{profile?.group_name || "—"}</strong>
            </div>
            <div>
              <span>Направление</span>
              <strong>{profile?.specialization || "—"}</strong>
            </div>
          </div>
        </div>

        <form onSubmit={saveProfile} className="profile-form">
          <div>
            <label>ФИО</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Группа</label>
            <input
              placeholder="Например: CS-24"
              value={form.group_name}
              onChange={(e) =>
                setForm({ ...form, group_name: e.target.value })
              }
            />
          </div>

          <div>
            <label>Аватар URL</label>
            <input
              placeholder="https://..."
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
            />
          </div>

          <div>
            <label>
              {profile?.role === "teacher"
                ? "Специализация преподавателя"
                : "Направление обучения"}
            </label>
            <input
              placeholder={
                profile?.role === "teacher"
                  ? "Например: Frontend, Python, AI"
                  : "Например: Web Development"
              }
              value={form.specialization}
              onChange={(e) =>
                setForm({ ...form, specialization: e.target.value })
              }
            />
          </div>

          <div>
            <label>О себе</label>
            <textarea
              rows="5"
              placeholder="Кратко расскажите о себе"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <button className="btn primary">Сохранить профиль</button>
        </form>
      </div>
    </div>
  );
}