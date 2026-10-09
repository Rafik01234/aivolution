import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CourseView() {
  const { id } = useParams();
  const { token } = useAuth();

  const [lessons, setLessons] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2200);
  };

  const fetchLessons = async () => {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:5000/api/lessons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [id]);

  const getYoutubeEmbed = (url) => {
    try {
      const normal = url.match(/[?&]v=([^&]+)/);
      if (normal) return `https://www.youtube.com/embed/${normal[1]}`;

      const short = url.match(/youtu\.be\/([^?&]+)/);
      if (short) return `https://www.youtube.com/embed/${short[1]}`;

      const embed = url.match(/embed\/([^?&]+)/);
      if (embed) return url;

      return url;
    } catch {
      return url;
    }
  };

  const markViewed = async () => {
    if (!lessons[current]) return;

    const res = await fetch("http://localhost:5000/api/lessons/progress/viewed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lessonId: lessons[current].id,
        courseId: id,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast(`Урок засчитан. Прогресс: ${data.progress}%`);
    } else {
      showToast(data.message || "Ошибка сохранения прогресса");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="empty-state">Загрузка уроков...</div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          В этом курсе пока нет уроков.
          <br />
          <br />
          <Link to="/student/my-courses" className="btn soft">
            Вернуться к моим курсам
          </Link>
        </div>
      </div>
    );
  }

  const lesson = lessons[current];

  return (
    <div className="page">
      {toast && <div className="toast">{toast}</div>}

      <div className="lesson-view-head">
        <div>
          <span className="eyebrow">
            Урок {current + 1} из {lessons.length}
          </span>
          <h1>{lesson.title}</h1>
        </div>

        <Link to="/student/my-courses" className="btn soft">
          Назад
        </Link>
      </div>

      <div className="video-wrap">
        <iframe
          src={getYoutubeEmbed(lesson.video_url)}
          title={lesson.title}
          allowFullScreen
        />
      </div>

      <div className="lesson-nav">
        <button
          className="btn soft"
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          ← Предыдущий
        </button>

        <button className="btn success" onClick={markViewed}>
          Отметить просмотренным
        </button>

        <button
          className="btn primary"
          disabled={current === lessons.length - 1}
          onClick={() => setCurrent(current + 1)}
        >
          Следующий →
        </button>
      </div>

      <div className="lesson-sidebar">
        {lessons.map((item, index) => (
          <button
            key={item.id}
            className={index === current ? "lesson-tab active" : "lesson-tab"}
            onClick={() => setCurrent(index)}
          >
            <strong>{index + 1}</strong>
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      <StudentTestBox courseId={id} token={token} />
    </div>
  );
}
function StudentTestBox({ courseId, token }) {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [timer, setTimer] = useState(30 * 60);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState(null);

  const [canTakeTest, setCanTakeTest] = useState(false);
  const [totalLessons, setTotalLessons] = useState(0);
  const [viewedLessons, setViewedLessons] = useState(0);

  const fetchTest = async () => {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:5000/api/tests/${courseId}/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setAttempts(data.attempts || []);
      setAttemptsUsed(data.attemptsUsed || 0);
      setAttemptsLeft(data.attemptsLeft ?? 3);
      setQuestions(data.questions || []);
      setCanTakeTest(Boolean(data.canTakeTest));
      setTotalLessons(data.totalLessons || 0);
      setViewedLessons(data.viewedLessons || 0);
    } catch {
      setAttempts([]);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTest();
  }, [courseId]);

  useEffect(() => {
    if (!started || result) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitTest();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, result, selected]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const submitTest = async () => {
    const res = await fetch(`http://localhost:5000/api/tests/${courseId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answers: selected }),
    });

    const data = await res.json();

    if (res.ok) {
      setResult(data);
      setStarted(false);
      setSelected({});
      setTimer(30 * 60);
      await fetchTest();
    } else {
      alert(data.message || "Ошибка теста");
    }
  };

  if (loading) {
    return <div className="empty-state">Загрузка теста...</div>;
  }

  return (
    <div className="student-test">
      <span className="eyebrow">Final Test</span>
      <h2>Итоговый тест курса</h2>

      {attempts.length > 0 && (
        <div className="attempts-history">
          <h3>Прошлые попытки</h3>

          {attempts.map((attempt) => (
            <details className="attempt-accordion" key={attempt.id}>
              <summary>
                <span>
                  Попытка {attempt.attempt_number || 1}: {attempt.score}/
                  {attempt.max_score}
                </span>
                <b>{new Date(attempt.created_at).toLocaleString()}</b>
              </summary>

              <div className="result-box">
                <strong>
                  {attempt.score}/{attempt.max_score}
                </strong>
                <p>{attempt.ai_feedback}</p>
              </div>

              <TestReview details={attempt.details || []} />
            </details>
          ))}
        </div>
      )}

      {result && (
        <div className="result-box">
          <strong>
            {result.score}/{result.maxScore}
          </strong>
          <div className="ai-feedback">
  {result.ai_feedback.split("\n").map((line, i) => (
    <p key={i}>{line}</p>
  ))}
</div>
          <p>Осталось попыток: {result.attemptsLeft}</p>
        </div>
      )}

      {attemptsLeft <= 0 ? (
        <div className="empty-state">Все 3 попытки использованы.</div>
      ) : !canTakeTest ? (
        <div className="test-locked-box">
          <span className="eyebrow">Test Locked</span>
          <h3>Тест пока закрыт</h3>
          <p>
            Чтобы открыть итоговый тест, отметьте все уроки курса просмотренными.
          </p>

          <div className="progress-wrap">
            <div className="progress-top">
              <span>Просмотрено уроков</span>
              <strong>
                {viewedLessons}/{totalLessons}
              </strong>
            </div>

            <div className="progress-line">
              <span
                style={{
                  width:
                    totalLessons > 0
                      ? `${Math.round((viewedLessons / totalLessons) * 100)}%`
                      : "0%",
                }}
              />
            </div>
          </div>
        </div>
      ) : questions.length === 0 ? (
        <div className="empty-state">Тест для этого курса пока не добавлен.</div>
      ) : !started ? (
        <div className="test-start-box">
          <p>
            У вас будет 30 минут. Доступно попыток: {attemptsLeft} из 3.
          </p>

          <button className="btn primary" onClick={() => setStarted(true)}>
            Начать тест
          </button>
        </div>
      ) : (
        <>
          <div className="test-headline">
            <div>
              <span className="eyebrow">Attempt {attemptsUsed + 1}</span>
              <h2>Тестирование</h2>
            </div>

            <div className="timer-pill">{formatTime(timer)}</div>
          </div>

          <div className="student-question-list">
            {questions.map((q, index) => (
              <div className="student-question" key={q.id}>
                <h3>
                  {index + 1}. {q.question}
                </h3>

                <div className="student-answers">
                  {q.answers.map((a) => (
                    <label
                      key={a.id}
                      className={
                        Number(selected[q.id]) === Number(a.id)
                          ? "student-answer active"
                          : "student-answer"
                      }
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={a.id}
                        checked={Number(selected[q.id]) === Number(a.id)}
                        onChange={() =>
                          setSelected({ ...selected, [q.id]: a.id })
                        }
                      />
                      {a.answer}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="btn primary" onClick={submitTest}>
            Завершить тест
          </button>
        </>
      )}
    </div>
  );
}

function TestReview({ details }) {
  if (!details || details.length === 0) return null;

  const wrong = details.filter((item) => !item.isCorrect);

  return (
    <div className="test-review">
      <div className="review-head">
        <div>
          <span className="eyebrow">Review</span>
          <h3>Разбор ответов</h3>
        </div>

        <div className={wrong.length === 0 ? "review-badge good" : "review-badge"}>
          Ошибок: {wrong.length}
        </div>
      </div>

      <div className="review-list">
        {details.map((item, index) => (
          <div
            key={item.questionId}
            className={item.isCorrect ? "review-card correct" : "review-card wrong"}
          >
            <div className="review-question">
              <strong>{index + 1}. {item.question}</strong>
              <span>{item.isCorrect ? "Верно" : "Ошибка"}</span>
            </div>

            <div className="review-answers">
              <p>
                <b>Ваш ответ:</b> {item.selectedAnswer}
              </p>
              {!item.isCorrect && (
                <p>
                  <b>Правильный ответ:</b> {item.correctAnswer}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}