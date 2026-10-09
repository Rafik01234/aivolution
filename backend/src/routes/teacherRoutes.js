const express = require("express");
const router = express.Router();
const { getTeacherStudents } = require("../controllers/teacherController");
const auth = require("../middleware/authMiddleware");

router.get("/students", auth, getTeacherStudents);

module.exports = router;