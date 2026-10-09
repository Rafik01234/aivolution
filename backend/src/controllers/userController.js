const db = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT 
        id, name, email, role, group_name, avatar, specialization, bio
      FROM users 
      WHERE id = ?
      `,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Ошибка получения профиля" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, group_name, avatar, specialization, bio } = req.body;

    await db.query(
      `
      UPDATE users 
      SET name = ?, group_name = ?, avatar = ?, specialization = ?, bio = ?
      WHERE id = ?
      `,
      [
        name,
        group_name || null,
        avatar || null,
        specialization || null,
        bio || null,
        userId,
      ]
    );

    const [rows] = await db.query(
      `
      SELECT 
        id, name, email, role, group_name, avatar, specialization, bio
      FROM users 
      WHERE id = ?
      `,
      [userId]
    );

    res.json({
      message: "Профиль обновлен",
      user: rows[0],
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Ошибка обновления профиля" });
  }
};