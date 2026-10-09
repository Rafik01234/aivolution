import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { token, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    teachers: 0,
  });

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2200);
  };

  const fetchStats = async () => {
    const res = await fetch("http://localhost:5000/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setStats(data);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);

    const params = new URLSearchParams({
      search,
      role,
    });

    const res = await fetch(`http://localhost:5000/api/admin/users?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [search, role]);

  const changeRole = async (id, newRole) => {
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Роль обновлена");
      fetchUsers();
      fetchStats();
    } else {
      showToast(data.message || "Ошибка");
    }
  };

  const deleteUser = async (id) => {
    const ok = confirm("Удалить пользователя?");
    if (!ok) return;

    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Пользователь удален");
      fetchUsers();
      fetchStats();
    } else {
      showToast(data.message || "Ошибка удаления");
    }
  };

  const deleteSelected = async () => {
    const ok = confirm("Удалить выбранных пользователей?");
    if (!ok) return;

    const res = await fetch("http://localhost:5000/api/admin/users/delete-many", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids: selected }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Выбранные пользователи удалены");
      setSelected([]);
      fetchUsers();
      fetchStats();
    } else {
      showToast(data.message || "Ошибка удаления");
    }
  };

  const toggleSelected = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allSelected = useMemo(() => {
    const visibleIds = users
      .filter((item) => item.id !== user.id)
      .map((item) => item.id);

    return visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  }, [users, selected, user.id]);

  const toggleAll = () => {
    const visibleIds = users
      .filter((item) => item.id !== user.id)
      .map((item) => item.id);

    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(visibleIds);
    }
  };

  return (
    <div className="page">
      {toast && <div className="toast">{toast}</div>}

      <div className="page-head">
        <div>
          <span className="eyebrow">Admin Control</span>
          <h1>Пользователи</h1>
          <p>Ищите пользователей, меняйте роли и управляйте доступами.</p>
        </div>

        <button
          className="btn danger"
          disabled={selected.length === 0}
          onClick={deleteSelected}
        >
          Удалить выбранных
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <span>Всего пользователей</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="stat-card">
          <span>Студенты</span>
          <strong>{stats.students}</strong>
        </div>

        <div className="stat-card">
          <span>Преподаватели</span>
          <strong>{stats.teachers}</strong>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          placeholder="Поиск по имени или email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="all">Все</option>
          <option value="student">Студенты</option>
          <option value="teacher">Учителя</option>
        </select>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="empty-state">Загрузка пользователей...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">Пользователи не найдены</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th>ФИО</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Группа</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {users.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.id !== user.id && (
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelected(item.id)}
                      />
                    )}
                  </td>

                  <td>
                    <strong>{item.name}</strong>
                  </td>

                  <td>{item.email}</td>

                  <td>
                    {item.role === "admin" ? (
                      <span className="role-badge admin">admin</span>
                    ) : (
                      <select
                        className="role-select"
                        value={item.role}
                        onChange={(e) => changeRole(item.id, e.target.value)}
                      >
                        <option value="student">student</option>
                        <option value="teacher">teacher</option>
                      </select>
                    )}
                  </td>

                  <td>{item.group_name || "—"}</td>

                  <td>
                    {item.id !== user.id ? (
                      <button
                        className="mini-danger"
                        onClick={() => deleteUser(item.id)}
                      >
                        Удалить
                      </button>
                    ) : (
                      <span className="muted">Это вы</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}