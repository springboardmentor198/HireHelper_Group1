import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // 🔐 if no token → go to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ✅ if token exists → allow page
  return children;
}