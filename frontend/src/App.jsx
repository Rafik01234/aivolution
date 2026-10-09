import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";

import AdminUsers from "./pages/admin/AdminUsers";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherCourseView from "./pages/teacher/TeacherCourseView";
import TeacherStudents from "./pages/teacher/TeacherStudents";

import StudentCourses from "./pages/student/StudentCourses";
import MyCourses from "./pages/student/MyCourses";
import Grades from "./pages/student/Grades";
import CourseView from "./pages/student/CourseView";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

        <Route
          path="/courses"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TeacherCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TeacherCourseView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/students"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TeacherStudents />
            </ProtectedRoute>
          }
        />
<Route path="/student" element={<Navigate to="/student/courses" replace />} />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-courses"
          element={
            <ProtectedRoute roles={["student"]}>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/course/:id"
          element={
            <ProtectedRoute roles={["student"]}>
              <CourseView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/grades"
          element={
            <ProtectedRoute roles={["student"]}>
              <Grades />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;