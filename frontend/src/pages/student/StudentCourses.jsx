import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function StudentCourses() {
  const { token } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2200);
  };

  const getCourseStatus = (course) => {
    if (!course.enrollment_id) {
      return { text: "Доступен", className: "available" };
    }

    return { text: "Добавлен", className: "ready" };
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/courses/student/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Ошибка загрузки курсов");
        setCourses([]);
        return;
      }

      setCourses(Array.isArray(data) ? data : []);
    } catch {
      showToast("Backend не отвечает. Проверь npm run dev");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const enroll = async (courseId) => {
    const res = await fetch("http://localhost:5000/api/courses/student/enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Курс добавлен");
      fetchCourses();
    } else {
      showToast(data.message || "Ошибка");
    }
  };

  return (
    <div className="page">
      {toast && <div className="toast">{toast}</div>}

      <div className="page-head">
        <div>
          <span className="eyebrow">Course Catalog</span>
          <h1>Все курсы</h1>
          <p>
            Выберите учебную программу, добавьте ее в личный кабинет и начните
            обучение.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Загрузка курсов...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">Пока преподаватели не добавили курсы.</div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => {
            const status = getCourseStatus(course);

            return (
              <div className="course-card" key={course.id}>
                <div className="course-cover">
                  {course.image ? (
                    <img src={course.image} alt={course.title} />
                  ) : (
                    <div className="cover-placeholder">AI</div>
                  )}
                </div>

                <div className="course-body">
                  <span className="course-teacher">
                    {course.teacher_name || "Преподаватель"}
                  </span>

                  <div className={`course-status ${status.className}`}>
                    {status.text}
                  </div>

                  <h3>{course.title}</h3>

                  <p>
                    {course.description || "Описание курса пока не добавлено."}
                  </p>
                </div>

                <div className="course-actions">
                  {course.enrollment_id ? (
                    <button className="btn success" disabled>
                      Уже добавлен
                    </button>
                  ) : (
                    <button
                      className="btn primary"
                      onClick={() => enroll(course.id)}
                    >
                      Добавить
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}