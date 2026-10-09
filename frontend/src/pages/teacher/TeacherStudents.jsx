import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function TeacherStudents() {
  const { token } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/teacher/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const students = useMemo(() => {
    const map = {};

    rows.forEach((item) => {
      if (!map[item.id]) {
        map[item.id] = {
          id: item.id,
          name: item.name,
          email: item.email,
          group_name: item.group_name,
          courses: [],
        };
      }

      map[item.id].courses.push(item);
    });

    return Object.values(map);
  }, [rows]);

  const filtered = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeStudent =
    selectedStudent || (filtered.length > 0 ? filtered[0] : null);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">Teacher Analytics</span>
          <h1>Студенты</h1>
          <p>
            Выберите студента из списка, чтобы посмотреть его курсы, прогресс и
            результаты тестов.
          </p>
        </div>
      </div>

      <div className="teacher-students-layout">
        <div className="students-list-panel">
          <input
            placeholder="Поиск по имени или email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <div className="empty-state">Загрузка студентов...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">Студенты не найдены</div>
          ) : (
            <div className="compact-student-list">
              {filtered.map((student) => {
                const avgProgress = Math.round(
                  student.courses.reduce(
                    (sum, course) => sum + Number(course.progress || 0),
                    0
                  ) / student.courses.length
                );

                return (
                  <button
                    key={student.id}
                    className={
                      activeStudent?.id === student.id
                        ? "compact-student active"
                        : "compact-student"
                    }
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="student-avatar">
                      {student.name.charAt(0)}
                    </div>

                    <div>
                      <strong>{student.name}</strong>
                      <span>{student.group_name || "Без группы"}</span>
                    </div>

                    <small>{avgProgress}%</small>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="student-detail-panel">
          {!activeStudent ? (
            <div className="empty-state">Выберите студента</div>
          ) : (
            <>
              <div className="student-detail-head">
                <div>
                  <span className="eyebrow">Student Profile</span>
                  <h2>{activeStudent.name}</h2>
                  <p>{activeStudent.email}</p>
                </div>

                <div className="student-group-badge">
                  {activeStudent.group_name || "Без группы"}
                </div>
              </div>

              <div className="student-summary-grid">
                <div>
                  <span>Курсов</span>
                  <strong>{activeStudent.courses.length}</strong>
                </div>

                <div>
                  <span>Средний прогресс</span>
                  <strong>
                    {Math.round(
                      activeStudent.courses.reduce(
                        (sum, course) => sum + Number(course.progress || 0),
                        0
                      ) / activeStudent.courses.length
                    )}
                    %
                  </strong>
                </div>

                <div>
                  <span>Завершено</span>
                  <strong>
                    {
                      activeStudent.courses.filter(
                        (course) => Number(course.completed) === 1
                      ).length
                    }
                  </strong>
                </div>
              </div>

              <div className="course-progress-list">
                {activeStudent.courses.map((course) => (
                  <div
                    className="course-progress-row"
                    key={`${course.course_id}-${course.attempt_number || 0}`}
                  >
                    <div>
                      <h3>{course.course}</h3>
                      <p>
                        Тест:{" "}
                        {course.score !== null && course.score !== undefined
                          ? `${course.score}/${course.max_score} — попытка ${course.attempt_number || 1}`
                          : "Не сдавал"}
                      </p>
                    </div>

                    <div className="course-progress-info">
                      <strong>{course.progress || 0}%</strong>
                      <div className="progress-line">
                        <span style={{ width: `${course.progress || 0}%` }} />
                      </div>
                      <small>
                        {course.completed ? "Завершил" : "В процессе"}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}