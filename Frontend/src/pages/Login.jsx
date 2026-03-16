import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
// Notice we don't need FaGoogle anymore since the official button includes it!
import { useState, useEffect } from "react"
import logo from "../assets/logo.png"

// ✅ 1. Import the official Google component
import { GoogleLogin } from "@react-oauth/google"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const API = "http://localhost:5000"

  // 🔥 REMOVE SCROLLBAR
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // --- STANDARD LOGIN ---
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Enter email and password")
        return
      }

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("LOGIN RESPONSE:", data)

      if (!res.ok) {
        alert(data.message || "Login failed")
        return
      }

      navigate("/otp", { state: { email } })

    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

  // ✅ 2. NEW: GOOGLE LOGIN HANDLER
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the secure ID token to your backend
        body: JSON.stringify({ token: credentialResponse.credential }),
      })

      const data = await res.json()

      if (res.ok) {
        // Save the token and go straight to the feed!
        localStorage.setItem("token", data.token)
        navigate("/dashboard/feed")
      } else {
        alert(data.msg || "Google login failed")
      }
    } catch (err) {
      console.error("Google Login Error:", err)
      alert("Server error during Google login")
    }
  }

  return (
    <div
      className="auth-wrapper"
      style={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        <div
          className="auth-card"
          style={{
            textAlign: "center",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(15px)",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            width: "350px",
            color: "white"
          }}
        >

          <div style={{
            width: "85px",
            height: "85px",
            borderRadius: "50%",
            border: "3px solid #030d0f",
            overflow: "hidden",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 10px auto"
          }}>
            <img 
              src={logo} 
              alt="HireHelper Logo" 
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scale(2.8)"
              }} 
            />
          </div>
          
          <h1 style={{ marginTop: "10px", fontWeight: "600" }}>
            Hire Helper
          </h1>

          <p style={{ marginBottom: "20px", color: "#cbd5e1" }}>
            Sign in to your Hire-a-Helper Account
          </p>

          <input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "none",
              boxSizing: "border-box"
            }}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "5px",
              borderRadius: "8px",
              border: "none",
              boxSizing: "border-box"
            }}
          />

          <div style={{ textAlign: "right", marginBottom: "15px" }}>
            <Link
              to="/forgot-password"
              style={{
                color: "#38bdf8",
                fontSize: "14px",
                textDecoration: "none"
              }}
            >
              Forgot Password?
            </Link>
          </div>

          <button
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "15px"
            }}
            onClick={handleLogin}
          >
            Sign In
          </button>

          {/* ✅ 3. REPLACED CUSTOM BUTTON WITH OFFICIAL GOOGLE COMPONENT */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google login window closed or failed.")}
              text="sign_in_with"
              theme="outline"
              size="large"
              width="270" // Matches the container width perfectly
            />
          </div>

          <Link
            to="/register"
            style={{ color: "#38bdf8", textDecoration: "none" }}
          >
            Don’t have an account? Sign up
          </Link>

        </div>

      </motion.div>
    </div>
  )
}

export default Login