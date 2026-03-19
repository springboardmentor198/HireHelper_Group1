import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { FaUserPlus } from "react-icons/fa"

// ✅ 1. Import the Google Login component
import { GoogleLogin } from "@react-oauth/google"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields.")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.msg)
        navigate("/otp", { state: { email: email } })
      } else {
        alert(data.msg)
      }
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Cannot connect to server.")
    }
  }

  // ✅ 2. Add the Google Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      })

      const data = await res.json()

      if (res.ok) {
        // Save the token and go straight to the feed!
        localStorage.setItem("token", data.token)
        navigate("/dashboard/feed")
      } else {
        alert(data.msg || "Google registration failed")
      }
    } catch (err) {
      console.error("Google Auth Error:", err)
      alert("Server error during Google registration")
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

        {/* 🔥 3D Removed */}
        <div
          className="auth-card"
          style={{
            textAlign: "center",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(15px)",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            width: "370px",
            color: "white"
          }}
        >
          <FaUserPlus size={75} color="#38bdf8" />

          <h1 style={{ marginTop: "10px", fontWeight: "600" }}>
            Create Your Account
          </h1>

          <p style={{ marginBottom: "20px", color: "#cbd5e1" }}>
            Join the Hire-Helper Community
          </p>

          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "10px",
              marginBottom: "15px"
            }}
            onClick={handleRegister}
          >
            Create Account
          </button>

          {/* ✅ 3. Add the Google Button Component */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google signup window closed or failed.")}
              text="signup_with" // Sets the text to "Sign up with Google"
              theme="outline"
              size="large"
              width="290" // Perfectly matches the width of your inputs inside the 370px card!
            />
          </div>

          <Link
            to="/login"
            style={{ color: "#38bdf8", textDecoration: "none", display: "block" }}
          >
            Already have an account? Sign in
          </Link>

        </div>

      </motion.div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "none",
  boxSizing: "border-box" // Added to keep inputs from overflowing
}

export default Register