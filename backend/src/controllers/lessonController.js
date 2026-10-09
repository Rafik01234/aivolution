const db = require("../config/db");

const recalculateProgress = async (userId, courseId) => {
  const [lessonsCount] = await db.query(
    "SELECT COUNT(*) AS total FROM lessons WHERE course_id = ?",
    [courseId]
  );

  const totalLessons = lessonsCount[0].total;

  const [viewedCount] = await db.query(
    `
    SELECT COUNT(*) AS viewed
    FROM lesson_progress lp
    JOIN lessons l ON lp.lesson_id = l.id
    WHERE lp.user_id = ? AND l.course_id = ? AND lp.viewed = 1
    `,
    [userId, courseId]
  );

  const viewedLessons = viewedCount[0].viewed;

  let progress = 0;

  if (totalLessons > 0) {
    progress = Math.round((viewedLessons / totalLessons) * 70);
  }

  await db.query(
    "UPDATE enrollments SET progress = ? WHERE user_id = ? AND course_id = ?",
    [progress, userId, courseId]
  );

  return progress;
};

exports.getLessons = async (req, res) => {
  try {
    const { courseId } = req.params;

    const [lessons] = await db.query(
      "SELECT * FROM lessons WHERE course_id = ? ORDER BY position ASC, order_index ASC, id ASC",
      [courseId]
    );

    res.json(lessons);
  } catch (err) {
    console.error("getLessons error:", err);
    res.status(500).json({ message: "Ошибка получения уроков" });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, video_url } = req.body;

    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Добавлять уроки может только преподаватель" });
    }

    if (!title || !video_url) {
      return res.status(400).json({ message: "Заполните название и YouTube ссылку" });
    }

    const [count] = await db.query(
      "SELECT COUNT(*) as total FROM lessons WHERE course_id = ?",
      [courseId]
    );

    const position = count[0].total + 1;

    await db.query(
      "INSERT INTO lessons (course_id, title, video_url, position, order_index) VALUES (?, ?, ?, ?, ?)",
      [courseId, title, video_url, position, position]
    );

    res.json({ message: "Урок добавлен" });
  } catch (err) {
    console.error("createLesson error:", err);
    res.status(500).json({ message: "Ошибка добавления урока", error: err.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, video_url } = req.body;

    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Редактировать уроки может только преподаватель" });
    }

    if (!title || !video_url) {
      return res.status(400).json({ message: "Заполните название и YouTube ссылку" });
    }

    await db.query(
      "UPDATE lessons SET title = ?, video_url = ? WHERE id = ?",
      [title, video_url, id]
    );

    res.json({ message: "Урок обновлен" });
  } catch (err) {
    console.error("updateLesson error:", err);
    res.status(500).json({ message: "Ошибка редактирования урока" });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Удалять уроки может только преподаватель" });
    }

    await db.query("DELETE FROM lessons WHERE id = ?", [id]);

    res.json({ message: "Урок удален" });
  } catch (err) {
    console.error("deleteLesson error:", err);
    res.status(500).json({ message: "Ошибка удаления урока" });
  }
};

exports.markLessonViewed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId, courseId } = req.body;

    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Прогресс доступен только студенту" });
    }

    await db.query(
      `
      INSERT INTO lesson_progress (user_id, lesson_id, viewed)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE viewed = 1, viewed_at = CURRENT_TIMESTAMP
      `,
      [userId, lessonId]
    );

    const progress = await recalculateProgress(userId, courseId);

    res.json({ message: "Урок отмечен как просмотренный", progress });
  } catch (err) {
    console.error("markLessonViewed error:", err);
    res.status(500).json({ message: "Ошибка сохранения прогресса" });
  }
};