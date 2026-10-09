const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// регистрация
exports.register = async (req, res) => {
  try {
    const { name, email, password, group_name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email уже существует" });
    }

    await db.query(
  "INSERT INTO users (name, email, password, role, group_name) VALUES (?, ?, ?, 'student', ?)",
  [name, email, hashedPassword, group_name && group_name.trim() !== "" ? group_name : null,]
);

    res.json({ message: "Регистрация успешна" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// логин
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};