import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TeacherCourseView() {
  const { id } = useParams();
  const { token } = useAuth();

  const [lessons, setLessons] = useState([]);
  const [toast, setToast] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    video_url: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    video_url: "",
  });

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2200);
  };

  const fetchLessons = async () => {
    const res = await fetch(`http://localhost:5000/api/lessons/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLessons(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const addLesson = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/api/lessons/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Урок добавлен");
      setForm({ title: "", video_url: "" });
      fetchLessons();
    } else {
      showToast(data.message || "Ошибка добавления урока");
    }
  };

  const startEdit = (lesson) => {
    setEditingId(lesson.id);
    setEditForm({
      title: lesson.title,
      video_url: lesson.video_url,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", video_url: "" });
  };

  const saveEdit = async (lessonId) => {
    const res = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Урок обновлен");
      cancelEdit();
      fetchLessons();
    } else {
      showToast(data.message || "Ошибка редактирования");
    }
  };

  const deleteLesson = async (lessonId) => {
    const ok = confirm("Удалить урок?");
    if (!ok) return;

    const res = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Урок удален");
      fetchLessons();
    } else {
      showToast(data.message || "Ошибка удаления");
    }
  };

  return (
    <div className="page">
      {toast && <div className="toast">{toast}</div>}

      <div className="page-head">
        <div>
          <span className="eyebrow">Course Builder</span>
          <h1>Уроки курса</h1>
          <p>
            Добавляйте и редактируйте уроки. Все изменения сразу видны студентам.
          </p>
        </div>
      </div>

      <form onSubmit={addLesson} className="creator-panel">
        <div>
          <label>Название урока</label>
          <input
            placeholder="Например: Введение в JavaScript"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label>YouTube ссылка</label>
          <input
            placeholder="https://www.youtube.com/watch?v=..."
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            required
          />
        </div>

        <button className="btn primary">Добавить урок</button>
      </form>

      {lessons.length === 0 ? (
        <div className="empty-state">Уроков пока нет. Добавьте первый урок.</div>
      ) : (
        <div className="lesson-list">
          {lessons.map((lesson, index) => (
            <div className="lesson-card" key={lesson.id}>
              <div className="lesson-number">{index + 1}</div>

              {editingId === lesson.id ? (
                <div className="lesson-edit-area">
                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />

                  <input
                    value={editForm.video_url}
                    onChange={(e) =>
                      setEditForm({ ...editForm, video_url: e.target.value })
                    }
                  />

                  <div className="lesson-actions">
                    <button
                      type="button"
                      className="btn primary"
                      onClick={() => saveEdit(lesson.id)}
                    >
                      Сохранить
                    </button>

                    <button type="button" className="btn soft" onClick={cancelEdit}>
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.video_url}</p>
                  </div>

                  <div className="lesson-actions">
                    <button className="btn soft" onClick={() => startEdit(lesson)}>
                      Редактировать
                    </button>

                    <button
                      className="btn danger"
                      onClick={() => deleteLesson(lesson.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <TeacherTestBuilder courseId={id} token={token} showToast={showToast} />
    </div>
  );
}

function TeacherTestBuilder({ courseId, token, showToast }) {
  const emptyAnswers = [
    { answer: "", is_correct: true },
    { answer: "", is_correct: false },
    { answer: "", is_correct: false },
    { answer: "", is_correct: false },
    { answer: "", is_correct: false },
  ];

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(emptyAnswers);
  const [questions, setQuestions] = useState([]);

  const fetchTest = async () => {
    const res = await fetch(`http://localhost:5000/api/tests/${courseId}/teacher`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setQuestions(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchTest();
  }, []);

  const updateAnswer = (index, value) => {
    setAnswers((prev) =>
      prev.map((item, i) => (i === index ? { ...item, answer: value } : item))
    );
  };

  const setCorrect = (index) => {
    setAnswers((prev) =>
      prev.map((item, i) => ({ ...item, is_correct: i === index }))
    );
  };

  const addQuestion = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/api/tests/${courseId}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question, answers }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Вопрос добавлен");
      setQuestion("");
      setAnswers(emptyAnswers);
      fetchTest();
    } else {
      showToast(data.message || "Ошибка добавления вопроса");
    }
  };

  const deleteQuestion = async (questionId) => {
    const ok = confirm("Удалить вопрос?");
    if (!ok) return;

    const res = await fetch(`http://localhost:5000/api/tests/questions/${questionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      showToast("Вопрос удален");
      fetchTest();
    }
  };

  const changeCorrectAnswer = async (questionId, answerId) => {
  const res = await fetch(
    `http://localhost:5000/api/tests/questions/${questionId}/correct`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answerId }),
    }
  );

  const data = await res.json();

  if (res.ok) {
    showToast("Правильный ответ изменен");
    fetchTest();
  } else {
    showToast(data.message || "Ошибка изменения ответа");
  }
};

  return (
    <div className="test-builder">
      <div className="page-head">
        <div>
          <span className="eyebrow">Test Builder</span>
          <h1>Тест курса</h1>
          <p>Добавьте вопросы. У каждого вопроса должно быть 5 вариантов и 1 правильный ответ.</p>
        </div>
      </div>

      <form onSubmit={addQuestion} className="creator-panel">
        <div>
          <label>Вопрос</label>
          <textarea
            rows="3"
            placeholder="Например: Что такое искусственный интеллект?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="answers-grid">
          {answers.map((item, index) => (
            <div className="answer-row" key={index}>
              <input
                placeholder={`Вариант ${index + 1}`}
                value={item.answer}
                onChange={(e) => updateAnswer(index, e.target.value)}
                required
              />

              <label className="correct-check">
                <input
                  type="radio"
                  name="correct"
                  checked={item.is_correct}
                  onChange={() => setCorrect(index)}
                />
                Правильный
              </label>
            </div>
          ))}
        </div>

        <button className="btn primary">Добавить вопрос</button>
      </form>

      {questions.length === 0 ? (
        <div className="empty-state">Вопросов пока нет.</div>
      ) : (
        <div className="question-list">
          {questions.map((q, index) => (
            <div className="question-card" key={q.id}>
              <div className="question-top">
                <h3>{index + 1}. {q.question}</h3>
                <button className="mini-danger" onClick={() => deleteQuestion(q.id)}>
                  Удалить
                </button>
              </div>

              <div className="answer-list teacher-answer-list">
  {q.answers.map((a) => (
    <button
      type="button"
      key={a.id}
      className={a.is_correct ? "answer-pill correct" : "answer-pill"}
      onClick={() => changeCorrectAnswer(q.id, a.id)}
      title="Нажмите, чтобы сделать этот вариант правильным"
    >
      {a.answer}
      {a.is_correct ? " ✓" : ""}
    </button>
  ))}
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}