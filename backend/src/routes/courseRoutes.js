const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getTeacherCourses,
  getPublicCourses,
  getAllCoursesForStudent,
  enrollCourse,
  getMyCourses,
  createCourse,
  deleteCourse,
} = require("../controllers/courseController");

router.get("/public", getPublicCourses);

router.get("/student/all", auth, getAllCoursesForStudent);
router.post("/student/enroll", auth, enrollCourse);
router.get("/student/my", auth, getMyCourses);

router.get("/", auth, getTeacherCourses);
router.post("/", auth, createCourse);
router.delete("/:id", auth, deleteCourse);

module.exports = router;