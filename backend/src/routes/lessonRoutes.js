const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  markLessonViewed,
} = require("../controllers/lessonController");

router.post("/progress/viewed", auth, markLessonViewed);

router.get("/:courseId", auth, getLessons);
router.post("/:courseId", auth, createLesson);
router.put("/:id", auth, updateLesson);
router.delete("/:id", auth, deleteLesson);

module.exports = router;