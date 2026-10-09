const db = require("../config/db");

exports.getUsers = async (req, res) => {
  try {
    const { search = "", role = "all" } = req.query;

    let sql = `
      SELECT id, name, email, role, group_name, created_at
      FROM users
      WHERE (name LIKE ? OR email LIKE ?)
    `;

    const params = [`%${search}%`, `%${search}%`];

    if (role !== "all") {
      sql += " AND role = ?";
      params.push(role);
    }

    sql += " ORDER BY created_at DESC";

    const [users] = await db.query(sql, params);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка получения пользователей" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Недопустимая роль" });
    }

    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);

    res.json({ message: "Роль обновлена" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка обновления роли" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id) {
      return res.status(400).json({ message: "Нельзя удалить самого себя" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ message: "Пользователь удален" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка удаления пользователя" });
  }
};

exports.deleteManyUsers = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Не выбраны пользователи" });
    }

    const filteredIds = ids.filter((id) => Number(id) !== req.user.id);

    if (filteredIds.length === 0) {
      return res.status(400).json({ message: "Нельзя удалить самого себя" });
    }

    await db.query("DELETE FROM users WHERE id IN (?)", [filteredIds]);

    res.json({ message: "Выбранные пользователи удалены" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка массового удаления" });
  }
};

exports.getStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const [[total]] = await db.query(
      "SELECT COUNT(*) AS count FROM users"
    );

    const [[students]] = await db.query(
      "SELECT COUNT(*) AS count FROM users WHERE role = 'student'"
    );

    const [[teachers]] = await db.query(
      "SELECT COUNT(*) AS count FROM users WHERE role = 'teacher'"
    );

    res.json({
      total: total.count,
      students: students.count,
      teachers: teachers.count,
    });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ message: "Ошибка статистики" });
  }
};