const db = require("../config/db");

exports.getPublicCourses = async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.image,
        u.name AS teacher_name
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 3
    `);

    res.json(courses);
  } catch (err) {
    console.error("getPublicCourses error:", err);
    res.status(500).json({ message: "Ошибка получения публичных курсов" });
  }
};

exports.getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [courses] = await db.query(
      "SELECT * FROM courses WHERE teacher_id = ? ORDER BY created_at DESC",
      [teacherId]
    );

    res.json(courses);
  } catch (err) {
    console.error("getTeacherCourses error:", err);
    res.status(500).json({ message: "Ошибка получения курсов" });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (req.user.role !== "teacher") {
      return res.status(403).json({
        message: "Курсы может создавать только преподаватель",
      });
    }

    await db.query(
      "INSERT INTO courses (title, description, image, teacher_id) VALUES (?, ?, ?, ?)",
      [title, description || null, image || null, req.user.id]
    );

    res.json({ message: "Курс создан" });
  } catch (err) {
    console.error("createCourse error:", err);
    res.status(500).json({ message: "Ошибка создания курса" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM courses WHERE id = ? AND teacher_id = ?", [
      id,
      req.user.id,
    ]);

    res.json({ message: "Курс удален" });
  } catch (err) {
    console.error("deleteCourse error:", err);
    res.status(500).json({ message: "Ошибка удаления курса" });
  }
};

exports.getAllCoursesForStudent = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Каталог курсов доступен только студенту",
      });
    }

    const [courses] = await db.query(
      `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.image,
        u.name AS teacher_name,
        e.id AS enrollment_id
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.id
      LEFT JOIN enrollments e 
        ON e.course_id = c.id AND e.user_id = ?
      ORDER BY c.created_at DESC
      `,
      [userId]
    );

    res.json(courses);
  } catch (err) {
    console.error("getAllCoursesForStudent error:", err);
    res.status(500).json({ message: "Ошибка получения курсов для студента" });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Записаться может только студент",
      });
    }

    await db.query(
      "INSERT IGNORE INTO enrollments (user_id, course_id, progress, completed) VALUES (?, ?, 0, 0)",
      [userId, courseId]
    );

    res.json({ message: "Курс добавлен в мои курсы" });
  } catch (err) {
    console.error("enrollCourse error:", err);
    res.status(500).json({ message: "Ошибка записи на курс" });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Мои курсы доступны только студенту",
      });
    }

    const [courses] = await db.query(
      `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.image,
        u.name AS teacher_name,
        e.progress,
        e.completed
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE e.user_id = ?
      ORDER BY e.created_at DESC
      `,
      [userId]
    );

    res.json(courses);
  } catch (err) {
    console.error("getMyCourses error:", err);
    res.status(500).json({ message: "Ошибка получения моих курсов" });
  }
};