const db = require("../config/db");

exports.getTeacherStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.group_name,

        c.id AS course_id,
        c.title AS course,

        e.progress,
        e.completed,
        e.updated_at,

        tr.score,
        tr.max_score,
        tr.attempt_number
      FROM enrollments e
      JOIN users u ON u.id = e.user_id
      JOIN courses c ON c.id = e.course_id

      LEFT JOIN test_results tr
        ON tr.id = (
          SELECT tr2.id
          FROM test_results tr2
          WHERE tr2.user_id = e.user_id
            AND tr2.course_id = e.course_id
          ORDER BY 
            COALESCE(tr2.attempt_number, 1) DESC,
            tr2.created_at DESC,
            tr2.id DESC
          LIMIT 1
        )

      WHERE c.teacher_id = ?
      ORDER BY e.updated_at DESC
      `,
      [teacherId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getTeacherStudents error:", err);
    res.status(500).json({ message: "Ошибка получения студентов" });
  }
};