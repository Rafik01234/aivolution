const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const lessonRoutes = require("./src/routes/lessonRoutes");
const testRoutes = require("./src/routes/testRoutes");
const aiRoutes = require("./src/routes/aiRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");
const userRoutes = require("./src/routes/userRoutes");
const app = express();




app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "AIvolution API работает",
    status: "success",
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server started on http://localhost:${process.env.PORT || 5000}`);
});

