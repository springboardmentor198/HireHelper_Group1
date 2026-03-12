import { useState, useEffect } from "react"
import axios from "axios"
import {
  FaSearch,
  FaBell,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaTrash 
} from "react-icons/fa"

const dummyTasks = [
  {
    _id: "dummy_1",
    category: "Home Repair",
    title: "Fix Leaky Faucet",
    description: "Need help fixing a leaky kitchen faucet. The water keeps dripping.",
    location: "Downtown, New York",
    date: "2026-12-15",
    time: "10:00 AM",
    user: "John Smith",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
  },
  {
    _id: "dummy_2",
    category: "Moving",
    title: "Help Moving Furniture",
    description: "Need assistance moving heavy furniture to the second floor.",
    location: "Brooklyn, New York",
    date: "2026-12-16",
    time: "2:00 PM",
    user: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd"
  },
  {
    _id: "dummy_3",
    category: "Gardening",
    title: "Garden Cleanup",
    description: "Looking for help cleaning up the backyard garden before winter.",
    location: "Queens, New York",
    date: "2026-12-17",
    time: "9:00 AM",
    user: "Mike Davis",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d"
  }
]

export default function Feed() {
  const [tasks, setTasks] = useState(dummyTasks)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token")
        
        // 1. Decode your token to find out your specific User ID
        let myUserId = null;
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          myUserId = payload.id; 
        }
        
        const response = await axios.get("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        // 2. Filter the tasks: Keep only tasks where the OWNER ID does NOT match your ID
        const otherPeoplesTasks = response.data.filter(task => {
          // Checks if the task's owner ID matches your decoded ID
          const taskOwnerId = typeof task.owner === 'object' && task.owner !== null ? task.owner._id : task.owner;
          return taskOwnerId !== myUserId;
        });

        // 3. Set state with the filtered tasks
        setTasks([...otherPeoplesTasks, ...dummyTasks])
        setLoading(false)
      } catch (error) {
        console.error(" Error fetching tasks:", error)
        setLoading(false) 
      }
    }

    fetchTasks()
  }, [])

  const handleDelete = async (taskId) => {
    if (typeof taskId === "string" && taskId.startsWith("dummy")) {
      alert("You cannot delete the example community tasks!");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token")
      
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setTasks(tasks.filter(task => task._id !== taskId))
      alert("Task deleted successfully 🗑️")

    } catch (error) {
      console.error(" Error deleting task:", error)
      if (error.response && error.response.status === 401) {
        alert("You are not authorized to delete someone else's task!")
      } else {
        alert("Failed to delete task. Please try again.")
      }
    }
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "40px" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "5px" }}>Feed</h2>
          <p style={{ color: "#64748b" }}>Find tasks that need help</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#f1f5f9", padding: "8px 15px", borderRadius: "25px", width: "250px" }}>
            <FaSearch style={{ marginRight: "8px", color: "#64748b" }} />
            <input placeholder="Search tasks..." style={{ border: "none", outline: "none", background: "transparent", width: "100%" }} />
          </div>

          <div style={{ background: "#fef3c7", padding: "10px", borderRadius: "50%" }}>
            <FaBell color="#f59e0b" />
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ fontSize: "18px", color: "#64748b" }}>Syncing live tasks... ⏳</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
          {tasks.map(task => (
            <div key={task._id} style={cardStyle}>

              {/* IMAGE LOGIC UPDATED HERE */}
              <div style={{ position: "relative" }}>
                <img 
                  src={
                    task.image 
                      ? task.image // Uses hardcoded dummy image URL
                      : task.taskImage 
                        ? `http://localhost:5000${task.taskImage}` 
                        : "https://images.unsplash.com/photo-1581578731548-c64695cc6952" 
                  } 
                  alt="task" 
                  style={{ width: "100%", height: "180px", objectFit: "cover" }} 
                />
                <span style={badgeStyle}>{task.category}</span>
              </div>

              <div style={cardContentStyle}>
                <h3 style={titleStyle}>{task.title}</h3>
                <p style={descStyle}>{task.description}</p>

                <div style={{ flexGrow: 1 }}>
                  <div style={infoRow}><FaMapMarkerAlt size={13} /><span>{task.location}</span></div>
                  <div style={infoRow}><FaCalendarAlt size={13} /><span>{task.date} • {task.time}</span></div>
                  <div style={infoRow}><FaUser size={13} /><span>{task.owner?.name || task.user || "Community Member"}</span></div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                  <button style={buttonStyle}>
                    Offer Help
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(task._id)}
                    style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px", padding: "5px" }}
                    title="Delete Task"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const cardStyle = { background: "white", borderRadius: "15px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", overflow: "hidden", display: "flex", flexDirection: "column", height: "480px" }
const cardContentStyle = { padding: "20px", display: "flex", flexDirection: "column", height: "100%" }
const badgeStyle = { position: "absolute", top: "12px", left: "12px", background: "#6366f1", color: "white", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }
const titleStyle = { fontSize: "18px", fontWeight: "600", marginBottom: "8px" }
const descStyle = { fontSize: "14px", color: "#64748b", marginBottom: "15px", height: "45px", overflow: "hidden" }
const infoRow = { display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "13px", marginBottom: "8px" }
const buttonStyle = { width: "120px", padding: "8px", borderRadius: "8px", border: "none", background: "#6366f1", color: "white", fontWeight: "600", cursor: "pointer" }