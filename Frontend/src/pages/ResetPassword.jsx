import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()

  const [newPassword, setNewPassword] = useState("")

  const email = location.state?.email

  const handleReset = async () => {
    if (!newPassword) {
      alert("Enter new password")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Password updated successfully")
        navigate("/")
      } else {
        alert(data.message || "Error resetting password")
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
      <div style={{
        background: "rgba(255,255,255,0.05)",
        padding: "40px",
        borderRadius: "20px",
        width: "350px",
        color: "white",
        textAlign: "center"
      }}>
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
            borderRadius: "8px",
            border: "none"
          }}
        />

        <button
          onClick={handleReset}
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
          Update Password
        </button>
      </div>
    </div>
  )
}

export default ResetPassword