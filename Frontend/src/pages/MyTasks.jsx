import { useEffect, useRef, useState } from "react"
import axios from "axios"
import {
  FaCalendarAlt, FaMapMarkerAlt, FaTrash,
  FaChevronLeft, FaChevronRight,
  FaTimes, FaTag, FaPlus, FaListUl, FaClock,
  FaCheckCircle, FaImage, FaMoneyBillWave, FaTools,
  FaUsers, FaShieldAlt, FaStar, FaHandshake, FaExclamationTriangle,
  FaThumbsUp, FaComments, FaPhone
} from "react-icons/fa"

function getTaskStatus(task) {
  if (task.status) return task.status
  const taskDate = new Date(`${task.date}T${task.time || "00:00"}`)
  const now = new Date()
  const diffDays = (taskDate - now) / (1000 * 60 * 60 * 24)
  if (diffDays < 0) return "completed"
  if (diffDays < 3) return "pending"
  return "open"
}

const statusConfig = {
  open:      { label: "Open",      bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6", glow: "rgba(59,130,246,0.25)" },
  pending:   { label: "Pending",   bg: "#fef3c7", color: "#b45309", dot: "#f59e0b", glow: "rgba(245,158,11,0.25)" },
  assigned:  { label: "Assigned",  bg: "#e0e7ff", color: "#4f46e5", dot: "#6366f1", glow: "rgba(99,102,241,0.25)" },
  completed: { label: "Completed", bg: "#dcfce7", color: "#15803d", dot: "#22c55e", glow: "rgba(34,197,94,0.25)" },
}

function StarRating({ rating }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <FaStar key={i} size={10} color={i <= Math.round(rating) ? "#f59e0b" : "#e2e8f0"} />
      ))}
      <span style={{ fontSize: 11, color: "#64748b", marginLeft: 3, fontWeight: 600 }}>{rating}</span>
    </span>
  )
}

// ─── TRUNCATE HELPER ─────────────────────────────────────────────────
function truncateText(text, limit = 110) {
  if (!text) return { short: "", hasMore: false }
  if (text.length <= limit) return { short: text, hasMore: false }
  const trimmed = text.slice(0, limit).replace(/\s+\S*$/, "")
  return { short: trimmed, hasMore: true }
}

// ─── TRUNCATED DESCRIPTION with inline "more details" anchor ─────────
function TruncatedDescription({ text, onOpenDetail, style = {} }) {
  const { short, hasMore } = truncateText(text, 110)
  return (
    <p style={{ fontSize: 11.5, color: "#64748b", margin: 0, lineHeight: 1.7, ...style }}>
      {short}
      {hasMore && (
        <>
          {"... "}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenDetail() }}
            style={{
              color: "#6366f1", fontWeight: 700, fontSize: 11,
              textDecoration: "none", borderBottom: "1.5px solid #c7d2fe",
              paddingBottom: 1, transition: "color 0.15s, border-color 0.15s"
            }}
            onMouseEnter={e => { e.target.style.color = "#4f46e5"; e.target.style.borderColor = "#6366f1" }}
            onMouseLeave={e => { e.target.style.color = "#6366f1"; e.target.style.borderColor = "#c7d2fe" }}
          >
            more details
          </a>
        </>
      )}
    </p>
  )
}

function ImageSlider({ images, height = 148 }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)
  const imgs = images && images.length > 0 ? images : [null]

  useEffect(() => {
    if (imgs.length <= 1) return
    timerRef.current = setInterval(() => setCurrent(p => (p + 1) % imgs.length), 3000)
    return () => clearInterval(timerRef.current)
  }, [imgs.length])

  const prev = (e) => { e.stopPropagation(); clearInterval(timerRef.current); setCurrent(p => (p - 1 + imgs.length) % imgs.length) }
  const next = (e) => { e.stopPropagation(); clearInterval(timerRef.current); setCurrent(p => (p + 1) % imgs.length) }

  const getImgSrc = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"
    if (img.startsWith("http")) return img
    return `http://localhost:5000${img}`
  }

  return (
    <div style={{ position: "relative", width: "100%", height, overflow: "hidden" }}>
      {imgs.map((img, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0, opacity: i === current ? 1 : 0,
          transition: "opacity 0.6s ease", zIndex: i === current ? 1 : 0
        }}>
          <img src={getImgSrc(img)} alt="" style={{ width: "100%", height, objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)" }} />
        </div>
      ))}
      {imgs.length > 1 && (
        <>
          <button onClick={prev} style={arrowBtn("left")}><FaChevronLeft size={8} /></button>
          <button onClick={next} style={arrowBtn("right")}><FaChevronRight size={8} /></button>
          <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, zIndex: 10 }}>
            {imgs.map((_, i) => (
              <div key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                style={{ width: i === current ? 16 : 5, height: 5, borderRadius: 3, background: i === current ? "white" : "rgba(255,255,255,0.4)", transition: "all 0.3s", cursor: "pointer" }} />
            ))}
          </div>
          {/* Photo count badge */}
          <div style={{
            position: "absolute", top: 6, right: 32, zIndex: 10,
            background: "rgba(0,0,0,0.55)", color: "white",
            fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
            backdropFilter: "blur(4px)"
          }}>
            {current + 1}/{imgs.length}
          </div>
        </>
      )}
    </div>
  )
}

const arrowBtn = (side) => ({
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  [side]: 7, zIndex: 10, background: "rgba(0,0,0,0.38)", border: "none",
  color: "white", borderRadius: "50%", width: 22, height: 22,
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
})

// ─── FULL DETAIL MODAL ────────────────────────────────────────────────
function TaskDetailModal({ task, onClose, onComplete, onDelete }) {
  const status = getTaskStatus(task)
  const sc = statusConfig[status] || statusConfig.open
  const [activeImg, setActiveImg] = useState(0)

  const imgs = (() => {
    if (Array.isArray(task.taskImages) && task.taskImages.length > 0) return task.taskImages
    if (typeof task.taskImages === "string") return [task.taskImages]
    if (task.taskImage) return [task.taskImage]
    if (task.image) return [task.image]
    return ["https://images.unsplash.com/photo-1581578731548-c64695cc6952"]
  })()

  const getImgSrc = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
    if (img.startsWith("http")) return img
    return `http://localhost:5000${img}`
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(8,10,20,0.72)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, backdropFilter: "blur(12px)"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes modalIn{from{opacity:0;transform:translateY(24px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        .modal-scroll::-webkit-scrollbar{width:4px}
        .modal-scroll::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
        .maction-btn{flex:1;padding:11px 8px;border-radius:12px;border:none;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-family:'DM Sans',sans-serif;transition:all 0.18s;}
        .maction-btn:hover{transform:translateY(-2px);filter:brightness(1.08);}
        .review-chip{background:#f8fafc;border-radius:12px;padding:12px;border:1px solid #f1f5f9;}
        .info-pill{display:flex;align-items:center;gap:7px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:9px 13px;font-size:12px;color:#334155;font-weight:500;}
        .msection-head{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;display:flex;align-items:center;gap:6px;}
      `}</style>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 22, width: "100%", maxWidth: 520,
        maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
        animation: "modalIn 0.28s cubic-bezier(0.22,1,0.36,1) both",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        {/* IMAGE */}
        <div style={{ position: "relative", height: 200, flexShrink: 0, overflow: "hidden", background: "#0f172a" }}>
          <img src={getImgSrc(imgs[activeImg])} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)" }} />
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12, zIndex: 10,
            background: "rgba(255,255,255,0.2)", border: "none", color: "white",
            borderRadius: "50%", width: 32, height: 32, display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)"
          }}><FaTimes size={12} /></button>
          <span style={{ position: "absolute", top: 12, left: 12, background: sc.bg, color: sc.color, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />{sc.label}
          </span>
          <span style={{ position: "absolute", top: 42, left: 12, background: "#6366f1", color: "white", padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>{task.category}</span>
          <div style={{ position: "absolute", bottom: 12, left: 16, right: 16 }}>
            <h2 style={{ margin: 0, color: "white", fontSize: 20, fontWeight: 800, fontFamily: "'Syne', sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{task.title}</h2>
          </div>
          {imgs.length > 1 && (
            <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", gap: 4 }}>
              {imgs.map((_, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{
                  width: i === activeImg ? 16 : 6, height: 6, borderRadius: 3,
                  background: i === activeImg ? "white" : "rgba(255,255,255,0.4)",
                  cursor: "pointer", transition: "all 0.2s"
                }} />
              ))}
            </div>
          )}
        </div>

        {/* BODY */}
        <div className="modal-scroll" style={{ overflowY: "auto", flex: 1 }}>
          {/* OWNER STRIP */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg,#fafafe,#f8fafc)" }}>
            <div style={{ position: "relative" }}>
              <img src={task.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.user || "Me")}&background=6366f1&color=fff&size=80`} alt=""
                style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2.5px solid #e0e7ff" }} />
              <span style={{ position: "absolute", bottom: -2, right: -2, background: "#22c55e", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                <FaCheckCircle size={8} color="white" />
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{task.user || "You (Task Owner)"}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
                <StarRating rating={task.userRating || 4.5} />
                <span style={{ fontSize: 11, color: "#64748b" }}><FaHandshake size={9} style={{ marginRight: 3 }} />{task.jobsDone || 0} jobs done</span>
              </div>
            </div>
            <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, display: "flex", alignItems: "center", gap: 3 }}>
              <FaShieldAlt size={7} /> Verified
            </span>
          </div>

          <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 18 }}>
            {/* FULL DESCRIPTION (no truncation in modal) */}
            <div>
              <p className="msection-head">📝 Full Description</p>
              <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.75, margin: 0 }}>{task.description}</p>
            </div>

            {/* TASK DETAILS GRID */}
            <div>
              <p className="msection-head">📋 Task Details</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div className="info-pill"><FaClock size={12} color="#6366f1" /><div><div style={{ fontSize: 10, color: "#94a3b8" }}>Duration</div><div style={{ fontWeight: 700 }}>{task.duration || "Flexible"}</div></div></div>
                <div className="info-pill"><FaUsers size={12} color="#6366f1" /><div><div style={{ fontSize: 10, color: "#94a3b8" }}>People Needed</div><div style={{ fontWeight: 700 }}>{task.peopleNeeded || 1} person{(task.peopleNeeded || 1) > 1 ? "s" : ""}</div></div></div>
                <div className="info-pill"><FaTools size={12} color="#6366f1" /><div><div style={{ fontSize: 10, color: "#94a3b8" }}>Tools Required</div><div style={{ fontWeight: 600, fontSize: 11 }}>{task.toolsRequired || "None specified"}</div></div></div>
                <div className="info-pill"><FaCalendarAlt size={12} color="#6366f1" /><div><div style={{ fontSize: 10, color: "#94a3b8" }}>Schedule</div><div style={{ fontWeight: 700, fontSize: 11 }}>{task.date} • {task.time}</div></div></div>
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <p className="msection-head"><FaMapMarkerAlt size={9} /> Location</p>
              <div style={{ background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)", border: "1px solid #bae6fd", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FaMapMarkerAlt size={14} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0c4a6e" }}>{task.location}</div>
                  {task.distance && <div style={{ fontSize: 11, color: "#0284c7" }}>{task.distance} away</div>}
                </div>
              </div>
            </div>

            {/* BUDGET */}
            {(task.budget || task.budgetType) && (
              <div>
                <p className="msection-head"><FaMoneyBillWave size={9} /> Budget & Payment</p>
                <div style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #bbf7d0", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FaMoneyBillWave size={14} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: "#15803d" }}>{task.budget || "Negotiable"}</div>
                      <div style={{ fontSize: 11, color: "#16a34a" }}>{task.budgetType || "Fixed"}</div>
                    </div>
                  </div>
                  <div style={{ background: "white", border: "1px solid #bbf7d0", borderRadius: 8, padding: "5px 10px", fontSize: 11, color: "#15803d", fontWeight: 600 }}>{task.payment || "Cash / Online"}</div>
                </div>
              </div>
            )}

            {/* ALL PHOTOS GRID */}
            {imgs.length > 0 && (
              <div>
                <p className="msection-head"><FaImage size={9} /> Task Photos ({imgs.length})</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {imgs.map((img, i) => (
                    <div key={i} onClick={() => setActiveImg(i)} style={{
                      position: "relative", width: "100%", paddingBottom: "75%",
                      borderRadius: 10, overflow: "hidden",
                      border: i === activeImg ? "2.5px solid #6366f1" : "2px solid #e2e8f0",
                      cursor: "pointer", transition: "all 0.2s",
                      boxShadow: i === activeImg ? "0 0 0 3px rgba(99,102,241,0.2)" : "none",
                      flexShrink: 0
                    }}>
                      <img src={getImgSrc(img)} alt="" style={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%", objectFit: "cover"
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {task.reviews && task.reviews.length > 0 && (
              <div>
                <p className="msection-head"><FaThumbsUp size={9} /> Reviews</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {task.reviews.map((rev, i) => (
                    <div key={i} className="review-chip">
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <img src={rev.avatar} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
                        <span style={{ fontWeight: 700, fontSize: 12, color: "#0f172a" }}>{rev.name}</span>
                        <span style={{ marginLeft: "auto" }}><StarRating rating={rev.rating} /></span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontStyle: "italic" }}>"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SAFETY */}
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
              <FaShieldAlt size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#15803d" }}>✅ Your Task — Verified Account</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>You posted this task. Manage it from your dashboard anytime.</div>
              </div>
            </div>
            <div style={{ height: 4 }} />
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div style={{ padding: "14px 18px", borderTop: "1px solid #f1f5f9", background: "white", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="maction-btn" style={{ background: "#f1f5f9", color: "#64748b", flex: "0 0 42px", padding: 0 }}
              onClick={() => alert("Manage requests from the Requests tab!")}><FaComments size={14} /></button>
            {status === "assigned" && (
              <button className="maction-btn" style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white" }}
                onClick={() => { onClose(); onComplete(task._id) }}>
                <FaCheckCircle size={11} /> Mark Complete
              </button>
            )}
            <button className="maction-btn" style={{ background: "#fef2f2", color: "#ef4444", border: "1.5px solid #fecaca" }}
              onClick={() => { onClose(); onDelete(task._id) }}>
              <FaTrash size={11} /> Delete Task
            </button>
            <button className="maction-btn" style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)", color: "white", boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}
              onClick={onClose}>✕ Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── FIELD LABEL ─────────────────────────────────────────────────────
function Field({ label, children, icon }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.5px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
        {icon && <span style={{ color: "#6366f1" }}>{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
export default function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [view, setView] = useState("form")
  const [selectedTask, setSelectedTask] = useState(null)
  const [formData, setFormData] = useState({ title: "", category: "", location: "", date: "", time: "", description: "" })
  const [files, setFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:5000/api/tasks/my", { headers: { Authorization: `Bearer ${token}` } })
        setTasks(res.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchTasks()
  }, [])

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleFileChange = (e) => {
    const sel = Array.from(e.target.files)
    setFiles(p => [...p, ...sel])
    setPreviewUrls(p => [...p, ...sel.map(f => URL.createObjectURL(f))])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeFile = (i) => {
    setFiles(f => f.filter((_, j) => j !== i))
    setPreviewUrls(u => u.filter((_, j) => j !== i))
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const data = new FormData()
      Object.entries(formData).forEach(([k, v]) => data.append(k, v))
      files.forEach(f => data.append("taskImages", f))
      const res = await axios.post("http://localhost:5000/api/tasks", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      })
      const created = res.data?.task
      if (created) setTasks(p => [created, ...p])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      setFormData({ title: "", category: "", location: "", date: "", time: "", description: "" })
      setFiles([]); setPreviewUrls([])
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (e) { console.error(e); alert("Error posting task") }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } })
      setTasks(p => p.filter(t => t._id !== taskId))
    } catch (e) { console.error(e); alert("Failed to delete") }
  }

  const handleComplete = async (taskId) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/complete`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      window.location.reload()
    } catch (e) { console.error(e); alert("Failed to complete.") }
  }

  const categories = ["Cleaning", "Gardening", "Moving", "Cooking", "Teaching", "Repairs", "Shopping", "Other"]

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "14px 12px 32px", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(14px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes successPop{0%{opacity:0;transform:scale(0.8) translateY(10px)}60%{transform:scale(1.05)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.5}}

        .finput{padding:10px 13px;border-radius:10px;border:1.5px solid #e2e8f0;font-size:13px;outline:none;color:#0f172a;width:100%;font-family:'Plus Jakarta Sans',sans-serif;transition:border-color 0.2s,box-shadow 0.2s;background:#fafafa;}
        .finput:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.12);background:white;}
        .finput::placeholder{color:#cbd5e1;}

        .cat-chip{padding:6px 13px;border-radius:20px;border:1.5px solid #e2e8f0;font-size:11.5px;font-weight:600;cursor:pointer;transition:all 0.18s;background:white;color:#64748b;font-family:'Plus Jakarta Sans',sans-serif;}
        .cat-chip:hover{border-color:#a5b4fc;color:#4f46e5;background:#eef2ff;}
        .cat-chip.selected{background:#4f46e5;color:white;border-color:#4f46e5;}

        .task-card{background:white;border-radius:14px;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden;display:flex;flex-direction:column;border:1.5px solid #f1f5f9;transition:transform 0.22s ease,box-shadow 0.22s ease,border-color 0.22s;animation:cardIn 0.35s ease both;cursor:pointer;}
        .task-card:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(99,102,241,0.12);border-color:#c7d2fe;}
        .click-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;background:rgba(99,102,241,0.1);transition:opacity 0.2s;z-index:3;font-size:12px;font-weight:700;color:#4f46e5;}
        .task-card:hover .click-overlay{opacity:1;}

        .del-btn{background:transparent;border:1.5px solid #fecaca;color:#ef4444;cursor:pointer;padding:5px 11px;border-radius:8px;display:inline-flex;align-items:center;gap:4px;font-weight:700;font-size:11px;transition:all 0.17s;font-family:inherit;}
        .del-btn:hover{background:#fef2f2;border-color:#f87171;}
        .done-btn{background:linear-gradient(135deg,#22c55e,#16a34a);color:white;border:none;padding:5px 11px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;font-weight:700;font-size:11px;transition:opacity 0.17s;font-family:inherit;}
        .done-btn:hover{opacity:0.85;}

        .nav-tab{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:8px;border:none;font-size:12.5px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.2s;}
        .nav-tab.active{background:white;color:#0f172a;box-shadow:0 2px 8px rgba(0,0,0,0.08);}
        .nav-tab.inactive{background:transparent;color:#64748b;}
        .nav-tab.inactive:hover{color:#0f172a;background:rgba(255,255,255,0.5);}

        .submit-btn{padding:12px;border-radius:11px;border:none;font-size:14px;font-weight:800;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.2s;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;}
        .submit-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 24px rgba(99,102,241,0.4);}
        .submit-btn:active:not(:disabled){transform:scale(0.97);}

        .img-preview{position:relative;border-radius:9px;overflow:hidden;border:2px solid #e0e7ff;transition:all 0.2s;}
        .img-preview:hover{border-color:#f87171;}

        .success-banner{background:linear-gradient(135deg,#d1fae5,#a7f3d0);border:1.5px solid #6ee7b7;border-radius:11px;padding:12px 16px;display:flex;align-items:center;gap:10px;animation:successPop 0.4s cubic-bezier(0.34,1.56,0.64,1);}

        .form-section{background:white;border-radius:14px;border:1.5px solid #e2e8f0;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,0.04);}
        .section-title{font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;display:flex;align-items:center;gap:6px;}
      `}</style>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onComplete={handleComplete}
          onDelete={handleDelete}
        />
      )}

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, animation: "fadeSlide 0.3s ease" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#0f172a", letterSpacing: "-0.5px" }}>
            {view === "form" ? "Add Task" : "My Tasks"}
          </h1>
          <p style={{ color: "#94a3b8", margin: "2px 0 0", fontSize: 12, fontWeight: 500 }}>
            {view === "form" ? "Post a new task for helpers nearby" : `${tasks.length} task${tasks.length !== 1 ? "s" : ""} posted`}
          </p>
        </div>
        <div style={{ background: "#f1f5f9", borderRadius: 10, padding: 3, display: "flex", gap: 2 }}>
          <button className={`nav-tab ${view === "form" ? "active" : "inactive"}`} onClick={() => setView("form")}>
            <FaPlus size={10} /> Add
          </button>
          <button className={`nav-tab ${view === "tasks" ? "active" : "inactive"}`} onClick={() => setView("tasks")}>
            <FaListUl size={10} /> Tasks
            {tasks.length > 0 && (
              <span style={{ background: "#6366f1", color: "white", borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 800 }}>{tasks.length}</span>
            )}
          </button>
        </div>
      </div>

      {success && (
        <div className="success-banner" style={{ marginBottom: 12 }}>
          <FaCheckCircle size={18} color="#16a34a" />
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#065f46" }}>Task posted successfully! 🎉</div>
            <div style={{ fontSize: 11, color: "#059669" }}>Helpers nearby can now see your task</div>
          </div>
        </div>
      )}

      {/* ═══ FORM VIEW ═══ */}
      {view === "form" && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeSlide 0.3s ease" }}>
          <div className="form-section">
            <p className="section-title">📋 Task Info</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Field label="Task Title" icon={<FaTag size={9} />}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="finput" placeholder="e.g. Clean my backyard" />
              </Field>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.5px", textTransform: "uppercase" }}>Category</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {categories.map(cat => (
                    <button key={cat} type="button"
                      className={`cat-chip ${formData.category === cat ? "selected" : ""}`}
                      onClick={() => setFormData(p => ({ ...p, category: p.category === cat ? "" : cat }))}
                    >{cat}</button>
                  ))}
                </div>
                <input type="text" name="category" value={formData.category} onChange={handleChange} className="finput" placeholder="Or type custom category..." />
              </div>
            </div>
          </div>

          <div className="form-section">
            <p className="section-title">📍 Location & Time</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Field label="Location" icon={<FaMapMarkerAlt size={9} />}>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required className="finput" placeholder="e.g. Bhubaneswar, Odisha" />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Date" icon={<FaCalendarAlt size={9} />}>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required className="finput" />
                </Field>
                <Field label="Time" icon={<FaClock size={9} />}>
                  <input type="time" name="time" value={formData.time} onChange={handleChange} required className="finput" />
                </Field>
              </div>
            </div>
          </div>

          <div className="form-section">
            <p className="section-title">📝 Description</p>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="finput"
              placeholder="Describe what help you need, tools required, any special instructions..." style={{ resize: "vertical", minHeight: 80 }} />
          </div>

          <div className="form-section">
            <p className="section-title"><FaImage size={10} /> Photos</p>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ border: "2px dashed #c7d2fe", borderRadius: 10, padding: "14px", textAlign: "center", cursor: "pointer", background: "#f5f3ff", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "#eef2ff" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#c7d2fe"; e.currentTarget.style.background = "#f5f3ff" }}
            >
              <FaImage size={20} color="#a5b4fc" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#6366f1" }}>Click to upload photos</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Multiple images allowed</div>
              <input ref={fileInputRef} type="file" name="taskImages" onChange={handleFileChange} accept="image/*" multiple style={{ display: "none" }} />
            </div>
            {previewUrls.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: 8, marginTop: 10 }}>
                {previewUrls.map((url, i) => (
                  <div key={i} className="img-preview" style={{ aspectRatio: "1", height: "auto" }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <button type="button" onClick={() => removeFile(i)} style={{
                      position: "absolute", top: -5, right: -5, background: "#ef4444",
                      border: "2px solid white", color: "white", borderRadius: "50%",
                      width: 18, height: 18, fontSize: 8,
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={submitting} className="submit-btn"
            style={{
              background: submitting ? "linear-gradient(135deg,#a5b4fc,#93c5fd)" : "linear-gradient(135deg,#4f46e5,#6366f1,#3b82f6)",
              color: "white", boxShadow: submitting ? "none" : "0 4px 18px rgba(99,102,241,0.35)",
              cursor: submitting ? "not-allowed" : "pointer",
            }}>
            {submitting ? <><span style={{ animation: "shimmer 1s infinite" }}>⏳</span> Posting Task...</> : <><FaPlus size={12} /> Post Task</>}
          </button>
        </form>
      )}

      {/* ═══ TASKS GRID ═══ */}
      {view === "tasks" && (
        <div style={{ animation: "fadeSlide 0.3s ease" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
              <div style={{ fontSize: 32, marginBottom: 8, animation: "shimmer 1s infinite" }}>⏳</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Loading your tasks...</div>
            </div>
          ) : tasks.length === 0 ? (
            <div style={{ background: "white", borderRadius: 16, padding: "40px 20px", textAlign: "center", color: "#94a3b8", border: "1.5px solid #f1f5f9" }}>
              <div style={{ fontSize: 42, marginBottom: 10 }}>📋</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#cbd5e1", marginBottom: 6 }}>No tasks yet</div>
              <div style={{ fontSize: 12 }}>Post your first task to get help</div>
              <button onClick={() => setView("form")} style={{ marginTop: 14, background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "white", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                <FaPlus size={10} style={{ marginRight: 6 }} /> Add First Task
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {tasks.map((task, idx) => {
                const status = getTaskStatus(task)
                const sc = statusConfig[status] || statusConfig.open
                const imgs = task.taskImages?.length > 0 ? task.taskImages : task.taskImage ? [task.taskImage] : []

                return (
                  <div
                    key={task._id}
                    className="task-card"
                    style={{ animationDelay: `${idx * 50}ms` }}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div style={{ position: "relative" }}>
                      <ImageSlider images={imgs} />
                      <span style={{
                        position: "absolute", top: 8, left: 8, zIndex: 5,
                        background: "rgba(15,23,42,0.75)", color: "white",
                        padding: "3px 9px", borderRadius: 999, fontSize: 10, fontWeight: 700, backdropFilter: "blur(6px)"
                      }}>{task.category}</span>
                      <span style={{
                        position: "absolute", top: 8, right: 8, zIndex: 5,
                        background: sc.bg, color: sc.color, padding: "3px 8px", borderRadius: 999,
                        fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 4,
                        boxShadow: `0 2px 8px ${sc.glow}`
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot }} />{sc.label}
                      </span>
                      <div className="click-overlay">🔍 View Details</div>
                    </div>

                    <div style={{ padding: "11px 13px 12px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                      <h3 style={{ fontSize: 13.5, fontWeight: 800, margin: 0, color: "#0f172a", lineHeight: 1.3 }}>{task.title}</h3>

                      {/* ── TRUNCATED DESCRIPTION with inline "more details" anchor ── */}
                      <TruncatedDescription
                        text={task.description}
                        onOpenDetail={() => setSelectedTask(task)}
                      />

                      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: "auto" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                          <FaMapMarkerAlt size={9} color="#6366f1" />
                          <span style={{ color: "#475569", fontWeight: 500 }}>{task.location}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                          <FaCalendarAlt size={9} color="#6366f1" />
                          <span style={{ color: "#475569", fontWeight: 500 }}>{task.date} • {task.time}</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 6, paddingTop: 8, borderTop: "1px solid #f8fafc" }}
                        onClick={e => e.stopPropagation()}>
                        {status === "assigned" && (
                          <button className="done-btn" onClick={() => handleComplete(task._id)}>
                            <FaCheckCircle size={9} /> Complete
                          </button>
                        )}
                        <button className="del-btn" onClick={() => handleDelete(task._id)}>
                          <FaTrash size={9} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}