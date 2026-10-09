const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getUsers,
  updateUserRole,
  deleteUser,
  deleteManyUsers,
  getStats,
} = require("../controllers/adminController");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Доступ только для администратора" });
  }

  next();
};

router.get("/stats", auth, getStats);
router.get("/users", auth, adminOnly, getUsers);
router.patch("/users/:id/role", auth, adminOnly, updateUserRole);
router.delete("/users/:id", auth, adminOnly, deleteUser);
router.post("/users/delete-many", auth, adminOnly, deleteManyUsers);

module.exports = router;