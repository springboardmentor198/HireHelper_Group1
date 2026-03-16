import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { FaCalendarAlt, FaMapMarkerAlt, FaTrash, FaArrowLeft } from "react-icons/fa"

export default function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [view, setView] = useState("form") // "form" | "tasks"

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    date: "",
    time: "",
    description: ""
  })

  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:5000/api/tasks/my", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setTasks(response.data)
      } catch (error) {
        console.error("Error fetching my tasks:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMyTasks()
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const data = new FormData()
      data.append("title", formData.title)
      data.append("category", formData.category)
      data.append("location", formData.location)
      data.append("date", formData.date)
      data.append("time", formData.time)
      data.append("description", formData.description)
      if (file) data.append("taskImage", file)

      const response = await axios.post("http://localhost:5000/api/tasks", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })

      const createdTask = response.data?.task
      if (createdTask) setTasks((prev) => [createdTask, ...prev])

      alert("Task added to My Tasks ✅")
      setFormData({ title: "", category: "", location: "", date: "", time: "", description: "" })
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      console.error("Error posting task:", error)
      alert("Error posting task")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Delete this task from My Tasks?")
    if (!confirmDelete) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks((prev) => prev.filter((t) => t._id !== taskId))
      alert("Task deleted 🗑️")
    } catch (error) {
      console.error("Error deleting task:", error)
      alert("Failed to delete task")
    }
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "40px" }}>

      {/* HEADER - always visible */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px"
      }}>
        <div>
          {view === "tasks" && (
            <button
              onClick={() => setView("form")}
              style={{
                background: "none",
                border: "none",
                color: "#6366f1",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
                padding: 0
              }}
            >
              <FaArrowLeft size={11} /> Back to Add Task
            </button>
          )}
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>
            {view === "form" ? "Add Tasks" : "My Tasks"}
          </h1>
          <p style={{ color: "#64748b", margin: 0, marginTop: "4px" }}>
            {view === "form"
              ? "Create and manage tasks you posted"
              : `${tasks.length} task${tasks.length !== 1 ? "s" : ""} you have posted`}
          </p>
        </div>

        {/* My Tasks Button - always visible */}
        <button
          onClick={() => setView(view === "form" ? "tasks" : "form")}
          style={{
            background: view === "tasks" ? "#6366f1" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
            transition: "background 0.2s"
          }}
        >
          {view === "tasks" ? "＋ Add Task" : `My Tasks${tasks.length > 0 ? ` (${tasks.length})` : ""}`}
        </button>
      </div>

      {/* FORM VIEW */}
      {view === "form" && (
        <div className="addtask-wrapper" style={{ padding: 0 }}>
          <form className="form-card" onSubmit={handleSubmit}>
            <h2 style={{ marginTop: 0 }}>Add a Task</h2>

            <label>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />

            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required />

            <label>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />

            <div className="row">
              <div>
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div>
                <label>Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>

            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />

            <label>Upload Task Image (Optional)</label>
            <input
              ref={fileInputRef}
              type="file"
              name="taskImage"
              onChange={handleFileChange}
              accept="image/*"
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px dashed #6366f1",
                borderRadius: "8px",
                width: "100%"
              }}
            />

            <div className="center-btn">
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? "Posting..." : "🚀 Add to My Tasks"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TASKS VIEW */}
      {view === "tasks" && (
        <>
          {loading ? (
            <p style={{ fontSize: "18px", color: "#64748b" }}>Loading your tasks... ⏳</p>
          ) : tasks.length === 0 ? (
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: "60px 20px",
              textAlign: "center",
              color: "#94a3b8",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
            }}>
              <div style={{ fontSize: "52px", marginBottom: "12px" }}>📋</div>
              <p style={{ fontWeight: 700, fontSize: "16px", margin: 0 }}>No tasks yet</p>
              <p style={{ fontSize: "13px", marginTop: "6px" }}>Go back and add your first task</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "22px"
            }}>
              {tasks.map((task) => (
                <div
                  key={task._id}
                  style={{
                    background: "white",
                    borderRadius: 15,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={
                        task.taskImage
                          ? `http://localhost:5000${task.taskImage}`
                          : "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
                      }
                      alt="task"
                      style={{ width: "100%", height: "170px", objectFit: "cover" }}
                    />
                    <span style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: "#6366f1",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {task.category}
                    </span>
                  </div>

                  <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{task.title}</h3>
                      <p style={{ fontSize: 14, color: "#64748b", marginTop: 6, marginBottom: 0 }}>
                        {task.description}
                      </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13 }}>
                        <FaMapMarkerAlt size={13} />
                        <span>{task.location}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13 }}>
                        <FaCalendarAlt size={13} />
                        <span>{task.date} • {task.time}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                      <button
                        onClick={() => handleDelete(task._id)}
                        style={{
                          background: "transparent",
                          border: "1px solid #fee2e2",
                          color: "#ef4444",
                          cursor: "pointer",
                          padding: "8px 10px",
                          borderRadius: 10,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          fontWeight: 700
                        }}
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}