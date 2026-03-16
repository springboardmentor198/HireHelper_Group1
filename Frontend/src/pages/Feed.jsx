import { useState, useEffect, useRef } from "react"
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

const dummyNotifications = [
  {
    id: 1,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Brigid Dawson",
    action: "requested your task",
    task: "Clean Backyard",
    time: "4 hours ago",
    read: false
  },
  {
    id: 2,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "John Dwyer",
    action: "requested your task",
    task: "Tutoring Math",
    time: "Yesterday",
    read: false
  },
  {
    id: 3,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Shannon Shaw",
    action: "has been marked the task",
    task: "Move Furniture",
    extraText: "completed",
    time: "4 days ago",
    read: true
  },
  {
    id: 4,
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Tim Hellman",
    action: "requested your task",
    task: "Fix Leaky Faucet",
    time: "Tuesday",
    read: true
  }
]

export default function Feed() {
  const [tasks, setTasks] = useState(dummyTasks)
  const [loading, setLoading] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(dummyNotifications)
  const notifRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:5000/api/tasks/feed", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTasks([...response.data, ...dummyTasks])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching tasks:", error)
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])
  // FETCH LIVE NOTIFICATIONS
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:5000/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        // Format backend notifications to match your UI structure
        const liveNotifs = response.data.map(n => ({
          id: n._id,
          avatar: "https://ui-avatars.com/api/?name=Alert&background=f59e0b&color=fff", // Alert icon
          name: "System Update",
          action: n.message, // Uses the message we generated in the backend
          task: null, // TTHIS REMOVES THE EMPTY "" QUOTES
          time: new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          read: n.isRead
        }))

        setNotifications([...liveNotifs, ...dummyNotifications])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }
    fetchNotifications()
  }, [])
  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleDelete = async (taskId) => {
    if (typeof taskId === "string" && taskId.startsWith("dummy")) {
      alert("You cannot delete the example community tasks!")
      return
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this task?")
    if (!confirmDelete) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(tasks.filter(task => task._id !== taskId))
      alert("Task deleted successfully!")
    } catch (error) {
      console.error("Error deleting task:", error)
      if (error.response && error.response.status === 401) {
        alert("You are not authorized to delete someone else's task!")
      } else {
        alert("Failed to delete task. Please try again.")
      }
    }
  }

  //  FUNCTION ADDED HERE TO HANDLE THE REQUEST
  const handleOfferHelp = async (taskId) => {
    // Prevent requesting dummy tasks that aren't in the database
    if (typeof taskId === "string" && taskId.startsWith("dummy")) {
      alert("This is an example task. Please offer help on real tasks!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`http://localhost:5000/requests/${taskId}`, 
        { message: "I would like to help with this task!" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Check if the backend said it was already requested
      if (response.data.msg === "Already requested") {
        alert("You have already sent a request for this task!");
      } else {
        alert("Success! Request sent to the task owner.");
      }
    } catch (error) {
      console.error("Error offering help:", error);
      alert("Failed to send request. Make sure you are logged in.");
    }
  };

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

          {/* NOTIFICATION BELL */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: "#fef3c7",
                border: "none",
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <FaBell color="#f59e0b" size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "#7c3aed",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "11px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION PANEL */}
            {showNotifications && (
              <div style={{
                position: "absolute",
                top: "50px",
                right: "0",
                width: "380px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                zIndex: 1000,
                overflow: "hidden"
              }}>
                {/* Panel Header */}
                <div style={{
                  background: "#7c3aed",
                  padding: "16px 20px"
                }}>
                  <h3 style={{ color: "white", margin: 0, fontSize: "18px", fontWeight: "600" }}>
                    Notifications
                  </h3>
                </div>

                {/* Notification Items */}
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        padding: "14px 20px",
                        borderBottom: "1px solid #f1f5f9",
                        gap: "12px",
                        background: notif.read ? "white" : "#fafafa"
                      }}
                    >
                      <img
                        src={notif.avatar}
                        alt={notif.name}
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 4px", fontSize: "14px", lineHeight: "1.4", color: "#1e293b" }}>
                          <strong>{notif.name}</strong>{" "}
                          {notif.action}{" "}
                          <strong>"{notif.task}"</strong>
                          {notif.extraText ? ` ${notif.extraText}` : ""}
                        </p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <div style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          background: "#7c3aed",
                          flexShrink: 0,
                          marginTop: "4px"
                        }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Mark All as Read */}
                <div style={{ borderTop: "1px solid #f1f5f9" }}>
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "white",
                      border: "none",
                      color: "#7c3aed",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      borderRadius: "0 0 12px 12px"
                    }}
                    onMouseEnter={e => e.target.style.background = "#f5f3ff"}
                    onMouseLeave={e => e.target.style.background = "white"}
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TASK GRID */}
      {loading ? (
        <p style={{ fontSize: "18px", color: "#64748b" }}>Syncing live tasks... ⏳</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
          {tasks.map(task => (
            <div key={task._id} style={cardStyle}>
              <div style={{ position: "relative" }}>
                <img
                  src={
                    task.image
                      ? task.image
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
                  <div style={infoRow}><FaUser size={13} /><span>{task.user || "Community Member"}</span></div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                  
                  {/* Added onClick handler */}
                  <button 
                    onClick={() => handleOfferHelp(task._id)} 
                    style={buttonStyle}
                  >
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