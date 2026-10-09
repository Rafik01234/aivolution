const db = require("../config/db");
const axios = require("axios");

const recalculateProgressAfterTest = async (userId, courseId) => {
  const [lessonRows] = await db.query(
    "SELECT COUNT(*) AS total FROM lessons WHERE course_id = ?",
    [courseId]
  );

  const totalLessons = lessonRows[0].total;

  const [viewedRows] = await db.query(
    `
    SELECT COUNT(*) AS viewed
    FROM lesson_progress lp
    JOIN lessons l ON lp.lesson_id = l.id
    WHERE lp.user_id = ? AND l.course_id = ? AND lp.viewed = 1
    `,
    [userId, courseId]
  );

  const viewedLessons = viewedRows[0].viewed;

  let lessonProgress = 0;

  if (totalLessons > 0) {
    lessonProgress = Math.round((viewedLessons / totalLessons) * 70);
  }

  const progress = Math.min(100, lessonProgress + 30);

  await db.query(
    "UPDATE enrollments SET progress = ?, completed = ? WHERE user_id = ? AND course_id = ?",
    [progress, progress === 100 ? 1 : 0, userId, courseId]
  );

  return progress;
};

const parseDetails = (value) => {
  if (!value) return [];

  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return [];
  }
};

const generateAiFeedback = async (wrongItems, lessons = []) => {
  if (wrongItems.length === 0) {
    return "Отличный результат. Все ответы верные. Вы хорошо усвоили тему и можете переходить к следующему материалу.";
  }

  try {
const aiPrompt = `
Ты — дружелюбный преподаватель.

Студент прошел тест. Объясни ошибки так, как будто ты разговариваешь с ним лично.

Формат:

1. Разбор ошибок:
- Объясни правильный ответ простым языком
- Объясни суть ошибки
- Дай короткий совет как запомнить

2. Что повторить:
- Перечисли темы (коротко)

3. Рекомендуемые уроки:
- Выбери подходящие уроки из списка ниже

Важно:
- Не пиши "студент выбрал"
- Пиши как наставник
- Кратко, без воды
- 2–3 предложения на вопрос

Ошибки:
${wrongItems
  .map(
    (item, index) => `
${index + 1}) Вопрос: ${item.question}
Правильный ответ: ${item.correctAnswer}
`
  )
  .join("\n")}

Уроки курса:
${lessons.map((l) => `- ${l.title}`).join("\n")}
`;

    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
  "Ты умный преподаватель онлайн-платформы. Ты объясняешь ошибки просто, даешь рекомендации и направляешь студента к нужным темам и урокам.",
          },
          {
            role: "user",
            content: aiPrompt,
          },
        ],
        temperature: 0.45,
        max_tokens: 700,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return aiResponse.data.choices[0].message.content;
  } catch (err) {
    console.error("AI feedback error:", err.response?.data || err.message);

    return `Рекомендуется повторить вопросы, где были ошибки: ${wrongItems
      .map((item) => item.question)
      .join("; ")}. Посмотрите правильные ответы и повторите соответствующие темы.`;
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { question, answers } = req.body;

    if (req.user.role !== "teacher") {
      return res.status(403).json({
        message: "Тест создает только преподаватель",
      });
    }

    if (!question || !Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({
        message: "Нужен вопрос и ровно 5 вариантов",
      });
    }

    const correctCount = answers.filter((item) => item.is_correct).length;

    if (correctCount !== 1) {
      return res.status(400).json({
        message: "Выберите один правильный ответ",
      });
    }

    const [result] = await db.query(
      "INSERT INTO questions (course_id, question) VALUES (?, ?)",
      [courseId, question]
    );

    const questionId = result.insertId;

    for (const item of answers) {
      await db.query(
        "INSERT INTO answers (question_id, answer, is_correct) VALUES (?, ?, ?)",
        [questionId, item.answer, item.is_correct ? 1 : 0]
      );
    }

    res.json({ message: "Вопрос добавлен" });
  } catch (err) {
    console.error("createQuestion error:", err);
    res.status(500).json({ message: "Ошибка создания вопроса" });
  }
};

exports.getTeacherTest = async (req, res) => {
  try {
    const { courseId } = req.params;

    const [questions] = await db.query(
      "SELECT * FROM questions WHERE course_id = ? ORDER BY id ASC",
      [courseId]
    );

    for (const q of questions) {
      const [answers] = await db.query(
        "SELECT id, answer, is_correct FROM answers WHERE question_id = ?",
        [q.id]
      );
      q.answers = answers;
    }

    res.json(questions);
  } catch (err) {
    console.error("getTeacherTest error:", err);
    res.status(500).json({ message: "Ошибка получения теста" });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (req.user.role !== "teacher") {
      return res.status(403).json({
        message: "Удалять вопросы может только преподаватель",
      });
    }

    await db.query("DELETE FROM questions WHERE id = ?", [questionId]);

    res.json({ message: "Вопрос удален" });
  } catch (err) {
    console.error("deleteQuestion error:", err);
    res.status(500).json({ message: "Ошибка удаления вопроса" });
  }
};

exports.getStudentTest = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const [attempts] = await db.query(
      `
      SELECT * 
      FROM test_results 
      WHERE user_id = ? AND course_id = ? 
      ORDER BY COALESCE(attempt_number, 1) DESC, created_at DESC, id DESC
      `,
      [userId, courseId]
    );

    const formattedAttempts = attempts.map((item) => ({
      ...item,
      attempt_number: item.attempt_number || 1,
      details: parseDetails(item.details_json),
    }));

    const attemptsUsed = formattedAttempts.length;
    const attemptsLeft = Math.max(0, 3 - attemptsUsed);

    const [lessonStats] = await db.query(
      `
      SELECT 
        COUNT(l.id) AS total_lessons,
        COUNT(lp.id) AS viewed_lessons
      FROM lessons l
      LEFT JOIN lesson_progress lp
        ON lp.lesson_id = l.id 
        AND lp.user_id = ?
        AND lp.viewed = 1
      WHERE l.course_id = ?
      `,
      [userId, courseId]
    );

    const totalLessons = lessonStats[0].total_lessons || 0;
    const viewedLessons = lessonStats[0].viewed_lessons || 0;
    const canTakeTest = totalLessons > 0 && viewedLessons >= totalLessons;

    const [questions] = await db.query(
      "SELECT id, question FROM questions WHERE course_id = ? ORDER BY id ASC",
      [courseId]
    );

    for (const q of questions) {
      const [answers] = await db.query(
        "SELECT id, answer FROM answers WHERE question_id = ?",
        [q.id]
      );
      q.answers = answers;
    }

    res.json({
      alreadyPassed: attemptsLeft === 0,
      attemptsUsed,
      attemptsLeft,
      attempts: formattedAttempts,
      lastResult: formattedAttempts[0] || null,
      canTakeTest,
      totalLessons,
      viewedLessons,
      questions: attemptsLeft > 0 && canTakeTest ? questions : [],
    });
  } catch (err) {
    console.error("getStudentTest error:", err);
    res.status(500).json({ message: "Ошибка получения теста" });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const { answers } = req.body;
    const [lessons] = await db.query(
  "SELECT id, title FROM lessons WHERE course_id = ? ORDER BY position ASC",
  [courseId]
);

    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Тест проходит только студент",
      });
    }

    const [attempts] = await db.query(
      "SELECT * FROM test_results WHERE user_id = ? AND course_id = ?",
      [userId, courseId]
    );

    if (attempts.length >= 3) {
      return res.status(400).json({
        message: "Вы использовали все 3 попытки",
      });
    }

    const attemptNumber = attempts.length + 1;

    const [lessonStats] = await db.query(
      `
      SELECT 
        COUNT(l.id) AS total_lessons,
        COUNT(lp.id) AS viewed_lessons
      FROM lessons l
      LEFT JOIN lesson_progress lp
        ON lp.lesson_id = l.id 
        AND lp.user_id = ?
        AND lp.viewed = 1
      WHERE l.course_id = ?
      `,
      [userId, courseId]
    );

    const totalLessons = lessonStats[0].total_lessons || 0;
    const viewedLessons = lessonStats[0].viewed_lessons || 0;

    if (totalLessons === 0 || viewedLessons < totalLessons) {
      return res.status(403).json({
        message: "Сначала нужно отметить все уроки просмотренными",
      });
    }

    const [questions] = await db.query(
      "SELECT id, question FROM questions WHERE course_id = ?",
      [courseId]
    );

    if (questions.length === 0) {
      return res.status(400).json({
        message: "В тесте пока нет вопросов",
      });
    }

    let score = 0;
    const details = [];

    for (const q of questions) {
      const selectedAnswerId = answers[q.id];

      const [answerRows] = await db.query(
        "SELECT id, answer, is_correct FROM answers WHERE question_id = ?",
        [q.id]
      );

      const correct = answerRows.find((a) => Number(a.is_correct) === 1);
      const selected = answerRows.find(
        (a) => Number(a.id) === Number(selectedAnswerId)
      );

      if (!correct) continue;

      const isCorrect = Number(selectedAnswerId) === Number(correct.id);

      if (isCorrect) score++;

      details.push({
        questionId: q.id,
        question: q.question,
        selectedAnswerId: selectedAnswerId || null,
        selectedAnswer: selected ? selected.answer : "Ответ не выбран",
        correctAnswerId: correct.id,
        correctAnswer: correct.answer,
        isCorrect,
      });
    }

    const maxScore = questions.length;
    const wrongItems = details.filter((item) => !item.isCorrect);
    const ai_feedback = await generateAiFeedback(wrongItems, lessons);

    await db.query(
      `
      INSERT INTO test_results 
      (user_id, course_id, score, max_score, ai_feedback, attempt_number, details_json) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        courseId,
        score,
        maxScore,
        ai_feedback,
        attemptNumber,
        JSON.stringify(details),
      ]
    );

    const progress = await recalculateProgressAfterTest(userId, courseId);

    res.json({
      message: "Тест завершен",
      score,
      maxScore,
      attemptNumber,
      attemptsLeft: 3 - attemptNumber,
      details,
      ai_feedback,
      progress,
    });
  } catch (err) {
    console.error("submitTest error:", err);
    res.status(500).json({ message: "Ошибка отправки теста" });
  }
};

exports.getStudentGrades = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT 
        c.id AS course_id,
        c.title AS course_title,
        c.image,
        e.progress,
        e.completed,

        tr.id AS result_id,
        tr.score,
        tr.max_score,
        tr.ai_feedback,
        tr.attempt_number,
        tr.created_at
      FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      LEFT JOIN test_results tr 
        ON tr.user_id = e.user_id AND tr.course_id = e.course_id
      WHERE e.user_id = ?
      ORDER BY c.created_at DESC, tr.attempt_number ASC
      `,
      [userId]
    );

    const grouped = {};

    rows.forEach((row) => {
      if (!grouped[row.course_id]) {
        grouped[row.course_id] = {
          course_id: row.course_id,
          course_title: row.course_title,
          image: row.image,
          progress: row.progress || 0,
          completed: row.completed || 0,
          attempts: [],
          best_score: null,
          best_max_score: null,
          last_attempt: null,
        };
      }

      if (row.result_id) {
        const attempt = {
          id: row.result_id,
          score: row.score,
          max_score: row.max_score,
          ai_feedback: row.ai_feedback,
          attempt_number: row.attempt_number || 1,
          created_at: row.created_at,
        };

        grouped[row.course_id].attempts.push(attempt);

        if (
          grouped[row.course_id].best_score === null ||
          row.score > grouped[row.course_id].best_score
        ) {
          grouped[row.course_id].best_score = row.score;
          grouped[row.course_id].best_max_score = row.max_score;
        }

        grouped[row.course_id].last_attempt = attempt;
      }
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error("getStudentGrades error:", err);
    res.status(500).json({ message: "Ошибка получения оценок" });
  }
};

exports.updateCorrectAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answerId } = req.body;

    if (req.user.role !== "teacher") {
      return res.status(403).json({
        message: "Менять правильный ответ может только преподаватель",
      });
    }

    const [answers] = await db.query(
      "SELECT * FROM answers WHERE question_id = ?",
      [questionId]
    );

    const exists = answers.some(
      (answer) => Number(answer.id) === Number(answerId)
    );

    if (!exists) {
      return res.status(400).json({
        message: "Этот ответ не относится к данному вопросу",
      });
    }

    await db.query("UPDATE answers SET is_correct = 0 WHERE question_id = ?", [
      questionId,
    ]);

    await db.query(
      "UPDATE answers SET is_correct = 1 WHERE id = ? AND question_id = ?",
      [answerId, questionId]
    );

    res.json({ message: "Правильный ответ обновлен" });
  } catch (err) {
    console.error("updateCorrectAnswer error:", err);
    res.status(500).json({
      message: "Ошибка обновления правильного ответа",
    });
  }
};