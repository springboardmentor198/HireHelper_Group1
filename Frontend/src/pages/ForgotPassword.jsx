import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")

  const handleForgot = async () => {
    if (!email) {
      alert("Enter your email")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("OTP sent to your email")
        navigate("/otp", { state: { email, from: "forgot" } })
      } else {
        alert(data.message || "Error")
      }

    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{
          background: "rgba(255,255,255,0.05)",
          padding: "40px",
          borderRadius: "20px",
          width: "350px",
          color: "white",
          textAlign: "center"
        }}>
          <h2>Forgot Password</h2>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
              borderRadius: "8px",
              border: "none"
            }}
          />

          <button
            onClick={handleForgot}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
              color: "white"
            }}
          >
            Send OTP
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword