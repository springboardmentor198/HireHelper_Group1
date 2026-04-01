import { Link, Outlet, useNavigate } from "react-router-dom"

function Dashboard() {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "250px",
        background: "#0f172a",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column"
      }}>

        <h2 style={{ marginBottom: "30px" }}>HireHelper</h2>

        <Link style={linkStyle} to="feed">Feed</Link>
        <Link style={linkStyle} to="requests">Requests</Link>
        <Link style={linkStyle} to="my-requests">My Requests</Link>
        
        <Link style={linkStyle} to="my-tasks"> My Tasks</Link>
        <Link style={linkStyle} to="settings">Settings</Link>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: "red",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        background: "#f1f5f9",
        padding: "30px",
        overflowY: "auto"
      }}>
        <Outlet />
      </div>

    </div>
  )
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  marginBottom: "15px",
  padding: "8px",
  borderRadius: "6px",
  background: "#1e293b"
}

export default Dashboard