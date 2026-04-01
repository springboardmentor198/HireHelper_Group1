import { useState, useEffect } from "react"
import axios from "axios"

const initialRequests = [
  {
    id: 1,
    name: "Rahul Kumar",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    message: "I have gardening tools and experience with backyard cleanups.",
    requestedOn: "2 March 2026",
    status: null,
    rating: 4.8,
    tasksCompleted: 24
  },
  {
    id: 2,
    name: "Amit Das",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    message: "I can help complete the task quickly and efficiently.",
    requestedOn: "1 March 2026",
    status: null,
    rating: 4.5,
    tasksCompleted: 17
  },
  {
    id: 3,
    name: "Hilary Rojas",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    message: "I live nearby and I am available on the scheduled date.",
    requestedOn: "1 March 2026",
    status: null,
    rating: 4.9,
    tasksCompleted: 41
  }
]

const task = {
  title: "Clean Backyard",
  location: "Bhubaneswar",
  startTime: "14 March, 10:00 AM"
}

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill={i <= Math.round(rating) ? "#f59e0b" : "#e2e8f0"}>
          <path d="M6 1l1.39 2.82L10.5 4.3l-2.25 2.19.53 3.1L6 8.02l-2.78 1.57.53-3.1L1.5 4.3l3.11-.48z" />
        </svg>
      ))}
      <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, marginLeft: 2 }}>{rating}</span>
    </div>
  )
}

function ConfirmModal({ action, name, onConfirm, onCancel }) {
  const isAccept = action === "accepted"
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.2s ease"
    }}>
      <div style={{
        background: "white", borderRadius: 24, padding: "36px 32px",
        width: 340, boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
        animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        textAlign: "center"
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
          background: isAccept ? "linear-gradient(135deg,#d1fae5,#a7f3d0)" : "linear-gradient(135deg,#fee2e2,#fecaca)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28
        }}>
          {isAccept ? "✓" : "✕"}
        </div>
        <h3 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8
        }}>
          {isAccept ? "Accept Request?" : "Reject Request?"}
        </h3>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>
          {isAccept
            ? `You're about to accept ${name}'s request. They'll be notified immediately.`
            : `You're about to reject ${name}'s request. This cannot be undone.`}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #e2e8f0",
            background: "white", color: "#64748b", fontSize: 14, fontWeight: 600,
            fontFamily: "'Bricolage Grotesque', sans-serif", cursor: "pointer",
            transition: "all 0.2s"
          }}
            onMouseEnter={e => e.target.style.background = "#f8fafc"}
            onMouseLeave={e => e.target.style.background = "white"}
          >Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "12px", borderRadius: 12, border: "none",
            background: isAccept
              ? "linear-gradient(135deg,#22c55e,#16a34a)"
              : "linear-gradient(135deg,#f43f5e,#e11d48)",
            color: "white", fontSize: 14, fontWeight: 700,
            fontFamily: "'Bricolage Grotesque', sans-serif", cursor: "pointer",
            boxShadow: isAccept ? "0 4px 16px rgba(34,197,94,0.4)" : "0 4px 16px rgba(244,63,94,0.4)",
            transition: "all 0.2s"
          }}
            onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.target.style.transform = "translateY(0)"}
          >
            {isAccept ? "Yes, Accept" : "Yes, Reject"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Request() {
  const [requests, setRequests] = useState(initialRequests)
  const [animating, setAnimating] = useState(null)
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)
  const [filter, setFilter] = useState("all")
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:5000/requests/received", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const realRequests = res.data.map(req => ({
          id: req._id,
          name: req.helperId?.name || "Community Member",
          avatar: "https://randomuser.me/api/portraits/men/11.jpg",
          message: req.message || "I would like to help with this task!",
          requestedOn: new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          status: req.status === "pending" ? null : req.status,
          rating: 4.5,
          tasksCompleted: 10
        }))
        setRequests(prev => [...prev, ...realRequests])
      } catch (error) {
        console.error("Error fetching requests:", error)
      }
    }
    fetchRequests()
  }, [])

  const showToast = (msg, type) => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAction = async (id, action) => {
    setModal(null)
    setAnimating({ id, action })
    if (typeof id === "string") {
      try {
        const token = localStorage.getItem("token")
        const endpoint = action === "accepted" ? "accept" : "reject"
        await axios.put(`http://localhost:5000/requests/${endpoint}/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } catch (error) {
        console.error("Error updating status:", error)
      }
    }
    setTimeout(() => {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r))
      setAnimating(null)
      showToast(
        action === "accepted" ? "✓ Request accepted successfully!" : "Request rejected.",
        action
      )
    }, 400)
  }

  const filtered = requests.filter(r => {
    if (filter === "pending") return r.status === null
    if (filter === "accepted") return r.status === "accepted"
    if (filter === "rejected") return r.status === "rejected"
    return true
  })

  const pending = requests.filter(r => r.status === null).length
  const accepted = requests.filter(r => r.status === "accepted").length
  const rejected = requests.filter(r => r.status === "rejected").length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.5) } to { opacity: 1; transform: scale(1) } }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes toastSlide { from { opacity: 0; transform: translateX(40px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(0.97)} }
        @keyframes expandDown { from { opacity: 0; max-height: 0 } to { opacity: 1; max-height: 200px } }

        .rq-root {
          font-family: 'Instrument Sans', sans-serif;
          min-height: 100vh;
          background: #f1f5f9;
          padding: 16px 12px 32px;
          position: relative;
        }

        /* Ambient blobs */
        .rq-root::before, .rq-root::after {
          content: '';
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .rq-root::before {
          width: 400px; height: 400px;
          background: rgba(99,102,241,0.10);
          top: -120px; right: -80px;
        }
        .rq-root::after {
          width: 320px; height: 320px;
          background: rgba(34,197,94,0.08);
          bottom: 0; left: -60px;
        }

        .rq-wrap { position: relative; z-index: 1; max-width: 100%; margin: 0; }

        /* Header */
        .rq-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
        .rq-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 26px; font-weight: 800;
          color: #0f172a; letter-spacing: -1px; line-height: 1.1;
        }
        .rq-title span { color: #6366f1; }
        .rq-subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; font-weight: 500; }

        /* Stat pills */
        .rq-stats { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
        .stat-pill {
          display: flex; align-items: center; gap: 7px;
          background: white; border-radius: 50px;
          padding: 7px 14px; font-size: 12px; font-weight: 700;
          font-family: 'Bricolage Grotesque', sans-serif;
          border: 1.5px solid #e2e8f0; cursor: pointer;
          transition: all 0.2s; color: #475569; user-select: none;
        }
        .stat-pill:hover { border-color: #c7d2fe; transform: translateY(-1px); }
        .stat-pill.active-all { background: #0f172a; color: white; border-color: #0f172a; }
        .stat-pill.active-pending { background: #ede9fe; color: #6d28d9; border-color: #c4b5fd; }
        .stat-pill.active-accepted { background: #d1fae5; color: #065f46; border-color: #6ee7b7; }
        .stat-pill.active-rejected { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
        .stat-dot { width: 7px; height: 7px; border-radius: 50%; }
        .stat-count {
          background: rgba(0,0,0,0.1); color: inherit;
          border-radius: 20px; padding: 1px 7px; font-size: 11px;
        }

        /* Task card */
        .rq-task-card {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
          border-radius: 16px; padding: 14px 16px; margin-bottom: 12px;
          box-shadow: 0 8px 32px rgba(99,102,241,0.28);
          position: relative; overflow: hidden;
        }
        .rq-task-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 90% 20%, rgba(255,255,255,0.08) 0%, transparent 60%);
        }
        .rq-task-card::after {
          content: '';
          position: absolute; top: -40px; right: -30px;
          width: 160px; height: 160px; border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .rq-task-top { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .rq-task-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.2);
        }
        .rq-task-label { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
        .rq-task-name {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 20px; font-weight: 800; color: white; margin-top: 2px;
        }
        .rq-task-meta { display: flex; gap: 16px; flex-wrap: wrap; }
        .rq-meta-chip {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.1); border-radius: 8px;
          padding: 5px 11px; font-size: 12px; color: rgba(255,255,255,0.85); font-weight: 500;
          border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(8px);
        }
        .rq-count-badge {
          position: absolute; top: 18px; right: 18px;
          background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.25);
          color: white; font-size: 11px; font-weight: 800;
          padding: 5px 12px; border-radius: 20px;
          font-family: 'Bricolage Grotesque', sans-serif;
          backdrop-filter: blur(8px);
        }

        /* Request cards */
        .rq-list { display: flex; flex-direction: column; gap: 8px; }

        .rq-card {
          background: white; border-radius: 18px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.34,1.2,0.64,1);
          animation: cardIn 0.4s ease both;
        }
        .rq-card:hover {
          box-shadow: 0 10px 36px rgba(99,102,241,0.13);
          border-color: #c7d2fe; transform: translateY(-2px);
        }
        .rq-card.accepted { border-color: #6ee7b7; }
        .rq-card.rejected { border-color: #fca5a5; opacity: 0.75; }
        .rq-card.animating { animation: pulse 0.4s ease; }

        .rq-card-top {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; cursor: pointer;
        }

        .rq-avatar-wrap { position: relative; flex-shrink: 0; }
        .rq-avatar {
          width: 52px; height: 52px; border-radius: 14px; object-fit: cover;
          border: 2px solid #e0e7ff; transition: all 0.2s;
        }
        .rq-card:hover .rq-avatar { border-color: #a5b4fc; }
        .rq-card.accepted .rq-avatar { border-color: #6ee7b7; }
        .rq-card.rejected .rq-avatar { border-color: #fca5a5; }
        .rq-online-dot {
          position: absolute; bottom: 2px; right: 2px;
          width: 11px; height: 11px; border-radius: 50%;
          background: #22c55e; border: 2px solid white;
        }

        .rq-info { flex: 1; min-width: 0; }
        .rq-name {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 2px;
        }
        .rq-meta-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
        .rq-tasks-chip {
          font-size: 11px; color: #6366f1; font-weight: 700;
          background: #ede9fe; padding: 2px 8px; border-radius: 6px;
        }
        .rq-msg {
          font-size: 13px; color: #64748b;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 280px;
        }
        .rq-date { font-size: 11px; color: #94a3b8; font-weight: 500; margin-top: 2px; }
        .rq-date strong { color: #6366f1; }

        /* Action area - RIGHT SIDE */
        .rq-actions-col {
          display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
          flex-shrink: 0; padding-left: 8px;
        }

        .btn-act {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 16px; border-radius: 10px; border: none;
          font-size: 12px; font-weight: 700;
          font-family: 'Bricolage Grotesque', sans-serif; cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
          min-width: 110px; justify-content: center; letter-spacing: 0.2px;
        }
        .btn-act:hover { transform: translateY(-2px) scale(1.04); }
        .btn-act:active { transform: scale(0.93) !important; }

        .btn-accept {
          background: linear-gradient(135deg, #22c55e, #15803d);
          color: white; box-shadow: 0 3px 14px rgba(34,197,94,0.4);
        }
        .btn-accept:hover { box-shadow: 0 6px 22px rgba(34,197,94,0.55); }

        .btn-reject {
          background: white; color: #f43f5e;
          border: 1.5px solid #fca5a5 !important;
          box-shadow: 0 2px 8px rgba(244,63,94,0.1);
        }
        .btn-reject:hover {
          background: #fff1f2; box-shadow: 0 6px 18px rgba(244,63,94,0.2);
          border-color: #f43f5e !important;
        }

        .status-badge {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 16px; border-radius: 10px;
          font-size: 12px; font-weight: 800;
          font-family: 'Bricolage Grotesque', sans-serif;
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
          min-width: 110px; justify-content: center;
        }
        .status-accepted { background: #d1fae5; color: #065f46; }
        .status-rejected { background: #fee2e2; color: #991b1b; }

        /* Expand section */
        .rq-expand {
          padding: 0 18px 16px;
          border-top: 1px solid #f1f5f9;
          animation: expandDown 0.3s ease;
          overflow: hidden;
        }
        .rq-expand-msg {
          font-size: 13.5px; color: #475569; line-height: 1.7;
          padding-top: 12px; font-style: italic;
          background: #f8fafc; border-radius: 10px; padding: 12px 14px;
          border-left: 3px solid #6366f1; margin-bottom: 8px;
        }

        /* Left accent bar */
        .rq-accent {
          width: 4px; align-self: stretch; border-radius: 0 0 0 18px;
          flex-shrink: 0;
          background: linear-gradient(180deg, #6366f1, #8b5cf6);
          transition: background 0.3s;
        }
        .rq-card.accepted .rq-accent { background: linear-gradient(180deg, #22c55e, #16a34a); }
        .rq-card.rejected .rq-accent { background: linear-gradient(180deg, #f43f5e, #e11d48); }

        .rq-inner { display: flex; flex: 1; flex-direction: column; }

        /* Toast */
        .toast {
          position: fixed; bottom: 28px; right: 24px; z-index: 1000;
          padding: 14px 20px; border-radius: 14px;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 14px; font-weight: 700;
          box-shadow: 0 12px 40px rgba(0,0,0,0.18);
          animation: toastSlide 0.35s cubic-bezier(0.34,1.56,0.64,1);
          display: flex; align-items: center; gap: 10px;
          max-width: 300px;
        }
        .toast-accepted { background: linear-gradient(135deg,#22c55e,#15803d); color: white; }
        .toast-rejected { background: linear-gradient(135deg,#f43f5e,#e11d48); color: white; }

        /* Empty state */
        .empty {
          text-align: center; padding: 48px 24px;
          color: #94a3b8; font-size: 14px;
        }
        .empty-icon { font-size: 48px; margin-bottom: 12px; }
        .empty-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 18px; font-weight: 700; color: #cbd5e1; margin-bottom: 6px; }

        /* Progress bar */
        .rq-progress { margin-bottom: 12px; }
        .rq-progress-label { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 6px; }
        .rq-progress-bar { height: 6px; background: #e2e8f0; border-radius: 10px; overflow: hidden; display: flex; }
        .rq-progress-seg { height: 100%; transition: width 0.5s ease; }
        .seg-a { background: linear-gradient(90deg,#22c55e,#16a34a); }
        .seg-r { background: linear-gradient(90deg,#f43f5e,#e11d48); }
        .seg-p { background: #e2e8f0; }
      `}</style>

      {modal && (
        <ConfirmModal
          action={modal.action}
          name={modal.name}
          onConfirm={() => handleAction(modal.id, modal.action)}
          onCancel={() => setModal(null)}
        />
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "accepted" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="rq-root">
        <div className="rq-wrap">

          {/* Header */}
          <div className="rq-header">
            <div>
              <h1 className="rq-title">Help <span>Requests</span></h1>
              <p className="rq-subtitle">People who want to help with your task</p>
            </div>
          </div>

          {/* Task Card */}
          <div className="rq-task-card">
            <div className="rq-count-badge">📬 {requests.length} Requests</div>
            <div className="rq-task-top">
              <div className="rq-task-icon">🧹</div>
              <div>
                <div className="rq-task-label">Active Task</div>
                <div className="rq-task-name">{task.title}</div>
              </div>
            </div>
            <div className="rq-task-meta">
              <div className="rq-meta-chip">📍 {task.location}</div>
              <div className="rq-meta-chip">🕙 {task.startTime}</div>
            </div>
          </div>

          {/* Progress bar */}
          {requests.length > 0 && (
            <div className="rq-progress">
              <div className="rq-progress-label">
                <span>Response Progress</span>
                <span>{Math.round(((accepted + rejected) / requests.length) * 100)}% reviewed</span>
              </div>
              <div className="rq-progress-bar">
                <div className="rq-progress-seg seg-a" style={{ width: `${(accepted / requests.length) * 100}%` }} />
                <div className="rq-progress-seg seg-r" style={{ width: `${(rejected / requests.length) * 100}%` }} />
              </div>
            </div>
          )}

          {/* Filter Pills */}
          <div className="rq-stats">
            {[
              { key: "all", label: "All", count: requests.length, dotColor: "#6366f1" },
              { key: "pending", label: "Pending", count: pending, dotColor: "#f59e0b" },
              { key: "accepted", label: "Accepted", count: accepted, dotColor: "#22c55e" },
              { key: "rejected", label: "Rejected", count: rejected, dotColor: "#f43f5e" },
            ].map(({ key, label, count, dotColor }) => (
              <button
                key={key}
                className={`stat-pill ${filter === key ? `active-${key}` : ""}`}
                onClick={() => setFilter(key)}
              >
                <div className="stat-dot" style={{ background: dotColor }} />
                {label}
                <span className="stat-count">{count}</span>
              </button>
            ))}
          </div>

          {/* Request List */}
          <div className="rq-list">
            {filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No requests here</div>
                <div>Nothing to show in this category</div>
              </div>
            ) : (
              filtered.map((req, i) => (
                <div
                  key={req.id}
                  className={`rq-card ${req.status || ""} ${animating?.id === req.id ? "animating" : ""}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div style={{ display: "flex" }}>
                    <div className="rq-accent" />
                    <div className="rq-inner">
                      <div className="rq-card-top" onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}>
                        <div className="rq-avatar-wrap">
                          <img src={req.avatar} alt={req.name} className="rq-avatar" />
                          {req.status === null && <div className="rq-online-dot" />}
                        </div>

                        <div className="rq-info">
                          <div className="rq-name">{req.name}</div>
                          <div className="rq-meta-row">
                            <StarRating rating={req.rating} />
                            <span className="rq-tasks-chip">⚡ {req.tasksCompleted} tasks</span>
                          </div>
                          <div className="rq-msg">💬 {req.message}</div>
                          <div className="rq-date">Requested: <strong>{req.requestedOn}</strong></div>
                        </div>

                        {/* RIGHT SIDE ACTIONS */}
                        <div className="rq-actions-col" onClick={e => e.stopPropagation()}>
                          {req.status === null ? (
                            <>
                              <button
                                className="btn-act btn-accept"
                                onClick={() => setModal({ id: req.id, action: "accepted", name: req.name })}
                              >
                                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                  <path d="M2 7l3.5 3.5L12 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Accept
                              </button>
                              <button
                                className="btn-act btn-reject"
                                onClick={() => setModal({ id: req.id, action: "rejected", name: req.name })}
                              >
                                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                  <path d="M1 1l10 10M11 1L1 11" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                Reject
                              </button>
                            </>
                          ) : (
                            <div className={`status-badge status-${req.status}`}>
                              {req.status === "accepted"
                                ? <><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 4" stroke="#065f46" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Accepted</>
                                : <><svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#991b1b" strokeWidth="2" strokeLinecap="round"/></svg> Rejected</>
                              }
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expandable detail */}
                      {expandedId === req.id && (
                        <div className="rq-expand">
                          <div className="rq-expand-msg">"{req.message}"</div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>
                            Click anywhere on the card to collapse ↑
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  )
}