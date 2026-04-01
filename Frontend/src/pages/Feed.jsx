import { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
  FaSearch, FaBell, FaMapMarkerAlt, FaCalendarAlt, FaUser,
  FaTrash, FaChevronLeft, FaChevronRight, FaTimes, FaStar,
  FaCheckCircle, FaShieldAlt, FaComments, FaPhone, FaHandshake,
  FaClock, FaMoneyBillWave, FaTools, FaUsers, FaExclamationTriangle,
  FaThumbsUp, FaTag
} from "react-icons/fa"

const dummyTasks = [
  {
    _id: "dummy_1",
    category: "Home Repair",
    title: "Fix Leaky Faucet",
    description: "Need help fixing a leaky kitchen faucet. The water keeps dripping and it's wasting a lot of water every day. Looking for an experienced plumber or handyman who has proper tools.",
    location: "Downtown, New York",
    date: "2026-12-15",
    time: "10:00 AM",
    user: "John Smith",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    budget: "₹500",
    budgetType: "Fixed",
    payment: "Cash / Online",
    duration: "2-3 hours",
    toolsRequired: "Wrench, Plumber tape, Spare faucet parts",
    peopleNeeded: 1,
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    userRating: 4.5,
    jobsDone: 12,
    verified: true,
    reviews: [
      { name: "Rahul K.", text: "Very clear instructions, paid on time!", rating: 5, avatar: "https://randomuser.me/api/portraits/men/44.jpg" },
      { name: "Priya S.", text: "Friendly person, work was straightforward.", rating: 4, avatar: "https://randomuser.me/api/portraits/women/22.jpg" }
    ]
  },
  {
    _id: "dummy_2",
    category: "Moving",
    title: "Help Moving Furniture",
    description: "Need assistance moving heavy furniture to the second floor. Includes a sofa, bed frame, wardrobe and 3 boxes. Elevator is available so it shouldn't be too tough.",
    location: "Brooklyn, New York",
    date: "2026-12-16",
    time: "2:00 PM",
    user: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
    budget: "₹800",
    budgetType: "Fixed",
    payment: "Online",
    duration: "3-4 hours",
    toolsRequired: "Trolley (optional), Lifting straps",
    peopleNeeded: 2,
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    userRating: 4.2,
    jobsDone: 7,
    verified: true,
    reviews: [
      { name: "Amit D.", text: "Good pay, easy work, very cooperative.", rating: 4, avatar: "https://randomuser.me/api/portraits/men/55.jpg" }
    ]
  },
  {
    _id: "dummy_3",
    category: "Gardening",
    title: "Garden Cleanup",
    description: "Looking for help cleaning up the backyard garden before winter. Includes raking leaves, trimming hedges and clearing old plant pots. Simple outdoor work.",
    location: "Queens, New York",
    date: "2026-12-17",
    time: "9:00 AM",
    user: "Mike Davis",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
    budget: "₹300",
    budgetType: "Fixed",
    payment: "Cash",
    duration: "2 hours",
    toolsRequired: "Rake, Gloves (provided)",
    peopleNeeded: 1,
    userAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
    userRating: 3.8,
    jobsDone: 3,
    verified: false,
    reviews: []
  }
]

const dummyNotifications = [
  { id: 1, avatar: "https://randomuser.me/api/portraits/women/44.jpg", name: "Brigid Dawson", action: "requested your task", task: "Clean Backyard", time: "4 hours ago", read: false },
  { id: 2, avatar: "https://randomuser.me/api/portraits/men/32.jpg", name: "John Dwyer", action: "requested your task", task: "Tutoring Math", time: "Yesterday", read: false },
  { id: 3, avatar: "https://randomuser.me/api/portraits/women/68.jpg", name: "Shannon Shaw", action: "has been marked the task", task: "Move Furniture", extraText: "completed", time: "4 days ago", read: true },
  { id: 4, avatar: "https://randomuser.me/api/portraits/men/75.jpg", name: "Tim Hellman", action: "requested your task", task: "Fix Leaky Faucet", time: "Tuesday", read: true }
]

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
  open:      { label: "Open",      bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6" },
  pending:   { label: "Pending",   bg: "#fef3c7", color: "#b45309", dot: "#f59e0b" },
  assigned:  { label: "Assigned",  bg: "#e0e7ff", color: "#4f46e5", dot: "#6366f1" },
  completed: { label: "Completed", bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
}

// ─── TRUNCATE HELPER ─────────────────────────────────────────────────
// Returns first ~120 chars ending at a word boundary, plus hasMore flag
function truncateText(text, limit = 120) {
  if (!text) return { short: "", hasMore: false }
  if (text.length <= limit) return { short: text, hasMore: false }
  const trimmed = text.slice(0, limit).replace(/\s+\S*$/, "")
  return { short: trimmed, hasMore: true }
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

// ─── FULL DETAIL MODAL ───────────────────────────────────────────────
function TaskDetailModal({ task, onClose, onOfferHelp }) {
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
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(8,10,20,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, backdropFilter: "blur(12px)"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes modalIn { from{opacity:0;transform:translateY(24px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        .modal-scroll::-webkit-scrollbar{width:4px}
        .modal-scroll::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
        .action-btn{
          flex:1; padding:11px 8px; border-radius:12px; border:none;
          font-size:12px; font-weight:700; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:6px;
          font-family:'DM Sans',sans-serif; transition:all 0.18s;
        }
        .action-btn:hover{transform:translateY(-2px);filter:brightness(1.08);}
        .review-chip{background:#f8fafc;border-radius:12px;padding:12px;border:1px solid #f1f5f9;}
        .info-pill{display:flex;align-items:center;gap:7px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:9px 13px;font-size:12px;color:#334155;font-weight:500;}
        .section-head{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;display:flex;align-items:center;gap:6px;}
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 22, width: "100%", maxWidth: 520,
          maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
          boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
          animation: "modalIn 0.28s cubic-bezier(0.22,1,0.36,1) both",
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        {/* IMAGE */}
        <div style={{ position: "relative", height: 200, flexShrink: 0, overflow: "hidden", background: "#0f172a" }}>
          <img src={getImgSrc(imgs[activeImg])} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)" }} />
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12, zIndex: 10,
            background: "rgba(255,255,255,0.2)", border: "none", color: "white",
            borderRadius: "50%", width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", backdropFilter: "blur(8px)"
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

        {/* SCROLLABLE BODY */}
        <div className="modal-scroll" style={{ overflowY: "auto", flex: 1 }}>
          {/* USER STRIP */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg,#fafafe,#f8fafc)" }}>
            <div style={{ position: "relative" }}>
              <img src={task.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.user || "User")}&background=6366f1&color=fff&size=80`} alt=""
                style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2.5px solid #e0e7ff" }} />
              {task.verified && (
                <span style={{ position: "absolute", bottom: -2, right: -2, background: "#22c55e", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                  <FaCheckCircle size={8} color="white" />
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{task.user || "Community Member"}</span>
                {task.verified && (
                  <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 999, display: "flex", alignItems: "center", gap: 3 }}>
                    <FaShieldAlt size={7} /> Verified
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3 }}>
                <StarRating rating={task.userRating || 4.0} />
                <span style={{ fontSize: 11, color: "#64748b" }}><FaHandshake size={9} style={{ marginRight: 3 }} />{task.jobsDone || 0} jobs done</span>
              </div>
            </div>
            {!task.verified && (
              <span style={{ background: "#fef3c7", color: "#b45309", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 999, display: "flex", alignItems: "center", gap: 3 }}>
                <FaExclamationTriangle size={7} /> Unverified
              </span>
            )}
          </div>

          <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <p className="section-head">📝 Task Description</p>
              <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.75, margin: 0 }}>{task.description}</p>
            </div>

            <div>
              <p className="section-head">📋 Task Details</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div className="info-pill"><FaClock size={12} color="#6366f1" /><div><div style={{ fontSize: 10, color: "#94a3b8" }}>Duration</div><div style={{ fontWeight: 700 }}>{task.duration || "Flexible"}</div></div></div>
                <div className="info-pill"><FaUsers size={12} color="#6366f1" /><div><div style={{ fontSize: 10, color: "#94a3b8" }}>People Needed</div><div style={{ fontWeight: 700 }}>{task.peopleNeeded || 1} person{task.peopleNeeded > 1 ? "s" : ""}</div></div></div>
                <div className="info-pill"><FaTools size={12} color="#6366f1" /><div><div style={{ fontSize: 10, color: "#94a3b8" }}>Tools Required</div><div style={{ fontWeight: 600, fontSize: 11 }}>{task.toolsRequired || "None specified"}</div></div></div>
                <div className="info-pill"><FaCalendarAlt size={12} color="#6366f1" /><div><div style={{ fontSize: 10, color: "#94a3b8" }}>Schedule</div><div style={{ fontWeight: 700, fontSize: 11 }}>{task.date} • {task.time}</div></div></div>
              </div>
            </div>

            <div>
              <p className="section-head"><FaMapMarkerAlt size={9} /> Location</p>
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

            <div>
              <p className="section-head"><FaMoneyBillWave size={9} /> Budget & Payment</p>
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

            {/* ALL PHOTOS GRID */}
            {imgs.length > 0 && (
              <div>
                <p className="section-head"><FaTag size={9} /> Task Photos ({imgs.length})</p>
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

            {task.reviews && task.reviews.length > 0 && (
              <div>
                <p className="section-head"><FaThumbsUp size={9} /> Reviews</p>
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

            <div style={{
              background: task.verified ? "#f0fdf4" : "#fff7ed",
              border: `1px solid ${task.verified ? "#bbf7d0" : "#fed7aa"}`,
              borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10
            }}>
              <FaShieldAlt size={16} color={task.verified ? "#22c55e" : "#f59e0b"} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 12, color: task.verified ? "#15803d" : "#b45309" }}>
                  {task.verified ? "✅ Verified Account" : "⚠️ Unverified Account"}
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                  {task.verified ? "This user's identity has been verified. Safe to proceed." : "Proceed with caution. Meet in public or bring a friend."}
                </div>
              </div>
            </div>
            <div style={{ height: 4 }} />
          </div>
        </div>

        {/* ACTION FOOTER */}
        <div style={{ padding: "14px 18px", borderTop: "1px solid #f1f5f9", background: "white", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="action-btn" style={{ background: "#f1f5f9", color: "#64748b", flex: "0 0 42px", padding: 0 }} onClick={() => alert("Chat feature coming soon!")}><FaComments size={14} /></button>
            <button className="action-btn" style={{ background: "#f0fdf4", color: "#15803d", flex: "0 0 42px", padding: 0 }} onClick={() => alert("Call feature coming soon!")}><FaPhone size={14} /></button>
            <button className="action-btn" style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "white", flex: "0 0 42px", padding: 0 }} onClick={onClose}><FaTimes size={14} /></button>
            <button className="action-btn" style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1,#3b82f6)", color: "white", flex: 1, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}
              onClick={() => { onClose(); onOfferHelp(task._id) }}>
              <FaHandshake size={12} /> Offer Help
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── IMAGE SLIDER ────────────────────────────────────────────────────
function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)
  const safeImages = Array.isArray(images) ? images : []
  const imgs = safeImages.length > 0 ? safeImages : [null]

  useEffect(() => {
    if (imgs.length <= 1) return
    timerRef.current = setInterval(() => setCurrent(prev => (prev + 1) % imgs.length), 3000)
    return () => clearInterval(timerRef.current)
  }, [imgs.length])

  const prev = (e) => { e.stopPropagation(); clearInterval(timerRef.current); setCurrent(prev => (prev - 1 + imgs.length) % imgs.length) }
  const next = (e) => { e.stopPropagation(); clearInterval(timerRef.current); setCurrent(prev => (prev + 1) % imgs.length) }

  const getImgSrc = (img) => {
    if (!img || typeof img !== "string") return "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
    if (img.startsWith("http")) return img
    return `http://localhost:5000${img}`
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden" }}>
      {imgs.map((img, i) => (
        <div key={i} style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          opacity: i === current ? 1 : 0, transition: "opacity 0.6s ease", zIndex: i === current ? 1 : 0
        }}>
          <img src={getImgSrc(img)} alt={`task-${i}`} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
        </div>
      ))}
      {imgs.length > 1 && (
        <>
          <button onClick={prev} style={sliderBtn("left")}><FaChevronLeft size={10} /></button>
          <button onClick={next} style={sliderBtn("right")}><FaChevronRight size={10} /></button>
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 10 }}>
            {imgs.map((_, i) => (
              <div key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                style={{ width: i === current ? 16 : 6, height: 6, borderRadius: 3, background: i === current ? "white" : "rgba(255,255,255,0.5)", transition: "all 0.3s", cursor: "pointer" }} />
            ))}
          </div>
          {/* Photo count badge */}
          <div style={{
            position: "absolute", top: 8, right: 48, zIndex: 10,
            background: "rgba(0,0,0,0.55)", color: "white",
            fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
            backdropFilter: "blur(4px)"
          }}>
            {current + 1} / {imgs.length}
          </div>
        </>
      )}
    </div>
  )
}

const sliderBtn = (side) => ({
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  [side]: 8, zIndex: 10, background: "rgba(0,0,0,0.45)", border: "none",
  color: "white", borderRadius: "50%", width: 26, height: 26,
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
})

// ─── TRUNCATED DESCRIPTION with inline "more details" anchor ─────────
function TruncatedDescription({ text, onOpenDetail }) {
  const { short, hasMore } = truncateText(text, 110)
  return (
    <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "15px", lineHeight: 1.6, margin: "0 0 15px" }}>
      {short}
      {hasMore && (
        <>
          {"... "}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenDetail() }}
            style={{
              color: "#6366f1", fontWeight: 700, fontSize: 13,
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

// ─── MAIN FEED COMPONENT ─────────────────────────────────────────────
export default function Feed() {
  const [tasks, setTasks] = useState(dummyTasks)
  const [loading, setLoading] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(dummyNotifications)
  const [selectedTask, setSelectedTask] = useState(null)
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
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:5000/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const liveNotifs = response.data.map(n => ({
          id: n._id,
          avatar: "https://ui-avatars.com/api/?name=Alert&background=f59e0b&color=fff",
          name: "System Update",
          action: n.message,
          task: null,
          time: new Date(n.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          read: n.isRead
        }))
        setNotifications([...liveNotifs, ...dummyNotifications])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }
    fetchNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMarkAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })))

  const handleDelete = async (taskId) => {
    if (typeof taskId === "string" && taskId.startsWith("dummy")) {
      alert("You cannot delete the example community tasks!")
      return
    }
    if (!window.confirm("Are you sure you want to delete this task?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } })
      setTasks(tasks.filter(task => task._id !== taskId))
      alert("Task deleted successfully!")
    } catch (error) {
      console.error("Error deleting task:", error)
      if (error.response?.status === 401) alert("You are not authorized to delete someone else's task!")
      else alert("Failed to delete task. Please try again.")
    }
  }

  const handleOfferHelp = async (taskId) => {
    if (typeof taskId === "string" && taskId.startsWith("dummy")) {
      alert("This is an example task. Please offer help on real tasks!")
      return
    }
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `http://localhost:5000/requests/${taskId}`,
        { message: "I would like to help with this task!" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.msg === "Already requested") alert("You have already sent a request for this task!")
      else alert("Success! Request sent to the task owner.")
    } catch (error) {
      console.error("Error offering help:", error)
      alert("Failed to send request. Make sure you are logged in.")
    }
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "40px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .feed-card {
          background: white; border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.05);
          overflow: hidden; display: flex; flex-direction: column;
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          border: 1.5px solid transparent;
        }
        .feed-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(99,102,241,0.14);
          border-color: #c7d2fe;
        }
        .offer-btn {
          width: 120px; padding: 8px; border-radius: 8px; border: none;
          background: #6366f1; color: white; font-weight: 600;
          cursor: pointer; transition: all 0.18s; font-family: inherit;
        }
        .offer-btn:hover { background: #4f46e5; transform: scale(1.04); }
        .del-btn-feed {
          background: transparent; border: none; color: #ef4444;
          cursor: pointer; font-size: 18px; padding: 5px;
          transition: transform 0.15s;
        }
        .del-btn-feed:hover { transform: scale(1.2); }
        .click-hint {
          position: absolute; inset: 0; display: flex; align-items: center;
          justify-content: center; opacity: 0;
          background: rgba(99,102,241,0.10);
          transition: opacity 0.2s; z-index: 3;
          font-size: 13px; font-weight: 700; color: #4f46e5;
          backdrop-filter: blur(2px);
        }
        .feed-card:hover .click-hint { opacity: 1; }
      `}</style>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onOfferHelp={handleOfferHelp}
        />
      )}

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
          <div style={{ position: "relative" }} ref={notifRef}>
            <button onClick={() => setShowNotifications(!showNotifications)} style={{
              background: "#fef3c7", border: "none", padding: "10px", borderRadius: "50%",
              cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <FaBell color="#f59e0b" size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: "-4px", right: "-4px",
                  background: "#7c3aed", color: "white", borderRadius: "50%",
                  width: "18px", height: "18px", fontSize: "11px", fontWeight: "700",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>{unreadCount}</span>
              )}
            </button>
            {showNotifications && (
              <div style={{ position: "absolute", top: "50px", right: "0", width: "380px", background: "white", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.15)", zIndex: 1000, overflow: "hidden" }}>
                <div style={{ background: "#7c3aed", padding: "16px 20px" }}>
                  <h3 style={{ color: "white", margin: 0, fontSize: "18px", fontWeight: "600" }}>Notifications</h3>
                </div>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {notifications.map((notif) => (
                    <div key={notif.id} style={{ display: "flex", alignItems: "flex-start", padding: "14px 20px", borderBottom: "1px solid #f1f5f9", gap: "12px", background: notif.read ? "white" : "#fafafa" }}>
                      <img src={notif.avatar} alt={notif.name} style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 4px", fontSize: "14px", lineHeight: "1.4", color: "#1e293b" }}>
                          <strong>{notif.name}</strong>{" "}{notif.action}{" "}
                          {notif.task && <strong>"{notif.task}"</strong>}
                          {notif.extraText ? ` ${notif.extraText}` : ""}
                        </p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>{notif.time}</p>
                      </div>
                      {!notif.read && <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#7c3aed", flexShrink: 0, marginTop: "4px" }} />}
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #f1f5f9" }}>
                  <button onClick={handleMarkAllRead} style={{ width: "100%", padding: "14px", background: "white", border: "none", color: "#7c3aed", fontSize: "14px", fontWeight: "500", cursor: "pointer", borderRadius: "0 0 12px 12px" }}
                    onMouseEnter={e => e.target.style.background = "#f5f3ff"}
                    onMouseLeave={e => e.target.style.background = "white"}>
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
          {tasks.map(task => {
            const status = getTaskStatus(task)
            const sc = statusConfig[status] || statusConfig.open
            let imgs = []
            if (Array.isArray(task.taskImages) && task.taskImages.length > 0) imgs = task.taskImages
            else if (typeof task.taskImages === "string") imgs = [task.taskImages]
            else if (task.taskImage) imgs = [task.taskImage]
            else if (task.image) imgs = [task.image]

            return (
              <div key={task._id} className="feed-card" onClick={() => setSelectedTask(task)}>
                <div style={{ position: "relative" }}>
                  <ImageSlider images={imgs} />
                  <span style={{ position: "absolute", top: "12px", left: "12px", background: "#6366f1", color: "white", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", zIndex: 4 }}>{task.category}</span>
                  <span style={{
                    position: "absolute", top: 12, right: 12, zIndex: 5,
                    background: sc.bg, color: sc.color, padding: "5px 11px", borderRadius: 999,
                    fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.dot }} />{sc.label}
                  </span>
                  <div className="click-hint">🔍 View Full Details</div>
                </div>

                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", margin: "0 0 8px" }}>{task.title}</h3>

                  {/* ── TRUNCATED DESCRIPTION with inline "more details" anchor ── */}
                  <TruncatedDescription text={task.description} onOpenDetail={() => setSelectedTask(task)} />

                  {task.userRating && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <img src={task.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.user || "U")}&background=6366f1&color=fff`} alt=""
                        style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} />
                      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{task.user || "Community Member"}</span>
                      <StarRating rating={task.userRating} />
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>
                      <FaMapMarkerAlt size={13} /><span>{task.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>
                      <FaCalendarAlt size={13} /><span>{task.date} • {task.time}</span>
                    </div>
                    {!task.userRating && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>
                        <FaUser size={13} /><span>{task.user || "Community Member"}</span>
                      </div>
                    )}
                    {task.budget && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#22c55e", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                        <FaMoneyBillWave size={13} /><span>{task.budget}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                    <button className="offer-btn" onClick={(e) => { e.stopPropagation(); handleOfferHelp(task._id) }}>Offer Help</button>
                    <button className="del-btn-feed" onClick={(e) => { e.stopPropagation(); handleDelete(task._id) }} title="Delete Task"><FaTrash /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}