import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
export default function TeacherCourses() {
  const { token } = useAuth();

  const [courses, setCourses] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
  });

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2200);
  };

  const fetchCourses = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setCourses(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const createCourse = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Курс создан");
      setForm({ title: "", description: "", image: "" });
      setFormOpen(false);
      fetchCourses();
    } else {
      showToast(data.message || "Ошибка создания курса");
    }
  };

  const deleteCourse = async (id) => {
    const ok = confirm("Удалить курс?");
    if (!ok) return;

    const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Курс удален");
      fetchCourses();
    } else {
      showToast(data.message || "Ошибка удаления");
    }
  };

  return (
    <div className="page">
      {toast && <div className="toast">{toast}</div>}

      <div className="page-head">
        <div>
          <span className="eyebrow">Teacher Workspace</span>
          <h1>Курсы</h1>
          <p>Создавайте курсы, добавляйте описание и управляйте материалами.</p>
        </div>

        <button className="btn primary" onClick={() => setFormOpen(!formOpen)}>
          {formOpen ? "Закрыть форму" : "Создать курс"}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={createCourse} className="creator-panel">
          <div>
            <label>Название курса</label>
            <input
              placeholder="Например: Основы искусственного интеллекта"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Описание</label>
            <textarea
              placeholder="Кратко опишите, чему студент научится на курсе"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="4"
            />
          </div>

          <div>
            <label>Обложка URL</label>
            <input
              placeholder="https://..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>

          <button className="btn primary">Сохранить курс</button>
        </form>
      )}

      {loading ? (
        <div className="empty-state">Загрузка курсов...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          Курсов пока нет. Нажмите “Создать курс”, чтобы добавить первый.
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-cover">
                {course.image ? (
                  <img src={course.image} alt={course.title} />
                ) : (
                  <div className="cover-placeholder">AI</div>
                )}
              </div>

              <div className="course-body">
                <h3>{course.title}</h3>
                <p>{course.description || "Описание курса пока не добавлено."}</p>
              </div>

              <div className="course-actions">
                <Link to={`/courses/${course.id}`} className="btn soft">
  Открыть
</Link>
                <button className="btn danger" onClick={() => deleteCourse(course.id)}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}