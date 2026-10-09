const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createQuestion,
  getTeacherTest,
  deleteQuestion,
  getStudentTest,
  submitTest,
  getStudentGrades,
  updateCorrectAnswer,
} = require("../controllers/testController");

router.post("/:courseId/questions", auth, createQuestion);
router.get("/:courseId/teacher", auth, getTeacherTest);
router.delete("/questions/:questionId", auth, deleteQuestion);
router.patch("/questions/:questionId/correct", auth, updateCorrectAnswer);
router.get("/student/grades", auth, getStudentGrades);
router.get("/:courseId/student", auth, getStudentTest);
router.post("/:courseId/submit", auth, submitTest);


module.exports = router;