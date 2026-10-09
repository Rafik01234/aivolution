import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function MyCourses() {
  const { token } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCourses = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/courses/student/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setCourses(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const getCourseStatus = (progress) => {
    const value = Number(progress || 0);

    if (value >= 100) return { text: "Завершил", className: "done" };
    if (value >= 70) return { text: "Допущен к тесту", className: "ready" };
    if (value > 0) return { text: "В процессе", className: "process" };

    return { text: "Не начат", className: "not-started" };
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">My Learning</span>
          <h1>Мои курсы</h1>
          <p>Продолжайте обучение и отслеживайте личный прогресс.</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Загрузка моих курсов...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          Вы пока не добавили курсы. Откройте каталог и выберите программу.
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => {
            const status = getCourseStatus(course.progress);

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

                  <div className="progress-wrap">
                    <div className="progress-top">
                      <span>Прогресс</span>
                      <strong>{course.progress || 0}%</strong>
                    </div>

                    <div className="progress-line">
                      <span
                        style={{ width: `${course.progress || 0}%` }}
                      ></span>
                    </div>
                  </div>
                </div>

                <div className="course-actions">
                  <Link
                    to={`/student/course/${course.id}`}
                    className="btn primary"
                  >
                    Открыть
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}