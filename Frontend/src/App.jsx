import { Routes, Route, Navigate } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Otp from "./pages/Otp"
import Dashboard from "./pages/Dashboard"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

import Feed from "./pages/Feed"
import Requests from "./pages/Requests"
import MyRequests from "./pages/MyRequests"
import MyTasks from "./pages/MyTasks"
import Settings from "./pages/Settings"

import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>

        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ---------------- PROTECTED DASHBOARD ---------------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* ✅ Default route -> Feed */}
          <Route index element={<Navigate to="feed" replace />} />

          <Route path="feed" element={<Feed />} />
          <Route path="requests" element={<Requests />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Optional: Unknown route redirect */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </div>
  )
}

export default App