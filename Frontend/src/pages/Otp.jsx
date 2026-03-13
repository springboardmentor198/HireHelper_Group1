import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import { FaUnlockAlt } from "react-icons/fa"

function Otp() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [otp, setOtp] = useState("")

  const email = location.state?.email
  const from = location.state?.from   // 🔥 IMPORTANT ADD

  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter the OTP code.")
      return
    }

    if (!email) {
      alert("Email not found. Please register or log in again.")
      navigate("/")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok && data.token) {

        // 🔥 CONDITION ADDED HERE
        if (from === "forgot") {
          navigate("/reset-password", { state: { email } })
        } else {
          localStorage.setItem("token", data.token)
          navigate("/dashboard")
        }

      } else {
        alert(data.msg || "Invalid or expired OTP")
      }

    } catch (error) {
      console.error("Verification failed:", error)
      alert("Cannot connect to server.")
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
            width: "370px",
            color: "white"
          }}
        >
          <FaUnlockAlt size={75} color="#38bdf8" />

          <h1 style={{ marginTop: "10px", fontWeight: "600" }}>
            Verify Account
          </h1>

          <p style={{ marginBottom: "20px", color: "#cbd5e1" }}>
            We sent a 6-digit code to {email || "your email"}
          </p>

          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              borderRadius: "8px",
              border: "none",
              textAlign: "center",
              fontSize: "20px",
              letterSpacing: "4px"
            }}
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
              marginTop: "10px"
            }}
            onClick={handleVerify}
          >
            Verify
          </button>

        </div>

      </motion.div>
    </div>
  )
}

export default Otp