import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Grades() {
  const { token } = useAuth();

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGrades = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/tests/student/grades", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setGrades(Array.isArray(data) ? data : []);
    } catch {
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const getPercent = (score, max) => {
    if (!max) return 0;
    return Math.round((score / max) * 100);
  };

  const getStatus = (course) => {
    if (Number(course.completed) === 1) return "Завершен";
    if (course.attempts.length > 0) return "Тест начат";
    if (course.progress > 0) return "В процессе";
    return "Не начат";
  };

  if (loading) {
    return (
      <div className="page">
        <div className="empty-state">Загрузка оценок...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">Student Grades</span>
          <h1>Оценки</h1>
          <p>
            Здесь отображаются результаты тестов, лучшие попытки и AI-рекомендации.
          </p>
        </div>
      </div>

      {grades.length === 0 ? (
        <div className="empty-state">
          Оценок пока нет. Добавьте курс и пройдите тест.
        </div>
      ) : (
        <div className="grades-list">
          {grades.map((course) => (
            <div className="grade-card" key={course.course_id}>
              <div className="grade-cover">
                {course.image ? (
                  <img src={course.image} alt={course.course_title} />
                ) : (
                  <div className="cover-placeholder">AI</div>
                )}
              </div>

              <div className="grade-content">
                <div className="grade-top">
                  <div>
                    <h3>{course.course_title}</h3>
                    <span className="grade-status">{getStatus(course)}</span>
                  </div>

                  <div className="grade-score">
                    {course.best_score !== null ? (
                      <>
                        <strong>
                          {course.best_score}/{course.best_max_score}
                        </strong>
                        <span>
                          Лучший результат:{" "}
                          {getPercent(course.best_score, course.best_max_score)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>—</strong>
                        <span>Тест не сдан</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="progress-wrap">
                  <div className="progress-top">
                    <span>Прогресс курса</span>
                    <strong>{course.progress || 0}%</strong>
                  </div>
                  <div className="progress-line">
                    <span style={{ width: `${course.progress || 0}%` }} />
                  </div>
                </div>

                {course.last_attempt && (
                  <div className="grade-feedback">
                    <strong>Последняя AI-рекомендация</strong>
                    <p>{course.last_attempt.ai_feedback}</p>
                  </div>
                )}

                {course.attempts.length > 0 ? (
                  <div className="attempt-mini-list">
                    <strong>Попытки</strong>

                    {course.attempts.map((attempt) => (
                      <div className="attempt-mini" key={attempt.id}>
                        <span>Попытка {attempt.attempt_number}</span>
                        <b>
                          {attempt.score}/{attempt.max_score}
                        </b>
                        <small>
                          {new Date(attempt.created_at).toLocaleString()}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Link to={`/student/course/${course.course_id}`} className="btn primary">
                    Перейти к тесту
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}