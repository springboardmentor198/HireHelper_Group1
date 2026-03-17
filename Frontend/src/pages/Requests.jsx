<<<<<<< HEAD
import { useState, useEffect } from "react"
import axios from "axios"

const initialRequests = [
  {
    id: 1,
    name: "Rahul Kumar",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    message: "I have gardening tools and experience with backyard cleanups.",
    requestedOn: "2 March 2026",
    status: null
  },
  {
    id: 2,
    name: "Amit Das",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    message: "I can help complete the task quickly and efficiently.",
    requestedOn: "1 March 2026",
    status: null
  },
  {
    id: 3,
    name: "Hilary Rojas",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    message: "I live nearby and I am available on the scheduled date.",
    requestedOn: "1 March 2026",
    status: null
  }
]

const task = {
  title: "Clean Backyard",
  location: "Bhubaneswar",
  startTime: "14 March, 10:00 AM"
}

export default function Request() {
  const [requests, setRequests] = useState(initialRequests)
  const [animating, setAnimating] = useState(null)

 // Fetch backend requests and combine them with your initialRequests
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
          status: req.status === "pending" ? null : req.status
        }))

        setRequests([...initialRequests, ...realRequests])
      } catch (error) {
        console.error("Error fetching requests:", error)
      }
    }
    fetchRequests()
  }, [])

  // Added the axios request to tell the backend about the change
  const handleAction = async (id, action) => {
    setAnimating({ id, action })
    
    // Only send to backend if it's a real database ID (ignores your dummy IDs 1, 2, 3)
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
    }, 400)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rq-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%);
          padding: 48px 32px;
        }

        .rq-page-header { margin-bottom: 28px; }

        .rq-page-title {
          font-family: 'Sora', sans-serif;
          font-size: 30px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.5px;
        }

        .rq-page-subtitle {
          margin-top: 5px; font-size: 14px; color: #64748b;
        }

        /* Task Card */
        .rq-task-card {
          background: white;
          border-radius: 18px;
          padding: 18px 22px;
          margin-bottom: 24px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(99,102,241,0.08);
          display: flex; align-items: center; gap: 14px;
          position: relative; overflow: hidden;
          transition: box-shadow 0.3s;
        }

        .rq-task-card:hover {
          box-shadow: 0 8px 32px rgba(99,102,241,0.14);
        }

        .rq-task-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0; width: 4px;
          background: linear-gradient(180deg, #6366f1, #8b5cf6);
        }

        .rq-task-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }

        .rq-task-name {
          font-family: 'Sora', sans-serif;
          font-size: 17px; font-weight: 700;
          color: #1e293b; margin-bottom: 6px;
        }

        .rq-task-meta { display: flex; gap: 18px; flex-wrap: wrap; }

        .rq-task-meta-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 13px; color: #64748b; font-weight: 500;
        }

        .rq-badge {
          margin-left: auto;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          color: #6d28d9;
          font-size: 11px; font-weight: 700;
          padding: 4px 12px; border-radius: 20px;
          white-space: nowrap; font-family: 'Sora', sans-serif;
        }

        /* Request List */
        .rq-list { display: flex; flex-direction: column; gap: 12px; }

        .rq-card {
          background: white;
          border-radius: 16px;
          padding: 16px 20px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          display: flex; align-items: center; gap: 14px;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        .rq-card:hover {
          box-shadow: 0 8px 28px rgba(99,102,241,0.13);
          border-color: #c7d2fe;
          transform: translateY(-2px);
        }

        .rq-card.accepted {
          border-color: #86efac;
          background: linear-gradient(135deg, #f0fdf4, white);
        }

        .rq-card.rejected {
          border-color: #fca5a5;
          background: linear-gradient(135deg, #fff1f2, white);
          opacity: 0.72;
        }

        .rq-card.pulse { animation: pulse 0.4s ease; }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(0.98); }
        }

        .rq-avatar {
          width: 50px; height: 50px;
          border-radius: 50%; object-fit: cover; flex-shrink: 0;
          border: 2.5px solid #e0e7ff;
          transition: border-color 0.3s, transform 0.2s;
        }

        .rq-card:hover .rq-avatar { border-color: #a5b4fc; transform: scale(1.05); }
        .rq-card.accepted .rq-avatar { border-color: #86efac; }
        .rq-card.rejected .rq-avatar { border-color: #fca5a5; }

        .rq-info { flex: 1; min-width: 0; }

        .rq-name {
          font-family: 'Sora', sans-serif;
          font-size: 15px; font-weight: 600;
          color: #0f172a; margin-bottom: 3px;
        }

        .rq-msg {
          font-size: 13px; color: #475569;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 3px;
        }

        .rq-date { font-size: 12px; color: #94a3b8; font-weight: 500; }
        .rq-date strong { color: #6366f1; }

        .rq-actions { display: flex; gap: 8px; flex-shrink: 0; }

        .btn {
          padding: 9px 18px;
          border-radius: 10px; border: none;
          font-size: 13px; font-weight: 700;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
          letter-spacing: 0.2px;
        }

        .btn:active { transform: scale(0.92) !important; }

        .btn-accept {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          box-shadow: 0 3px 12px rgba(34,197,94,0.35);
        }

        .btn-accept:hover {
          transform: translateY(-2px) scale(1.06);
          box-shadow: 0 6px 20px rgba(34,197,94,0.5);
        }

        .btn-reject {
          background: linear-gradient(135deg, #f43f5e, #e11d48);
          color: white;
          box-shadow: 0 3px 12px rgba(244,63,94,0.35);
        }

        .btn-reject:hover {
          transform: translateY(-2px) scale(1.06);
          box-shadow: 0 6px 20px rgba(244,63,94,0.5);
        }

        .status-badge {
          padding: 9px 16px; border-radius: 10px;
          font-size: 13px; font-weight: 700;
          font-family: 'Sora', sans-serif;
          letter-spacing: 0.3px;
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        .status-accepted { background: #dcfce7; color: #15803d; }
        .status-rejected { background: #ffe4e6; color: #be123c; }

        /* Summary */
        .summary-bar {
          margin-top: 20px;
          background: white;
          border-radius: 14px;
          padding: 13px 20px;
          border: 1.5px solid #e2e8f0;
          display: flex; align-items: center; justify-content: space-between;
          font-size: 13px; color: #64748b;
        }

        .summary-stats { display: flex; gap: 20px; }

        .stat { display: flex; align-items: center; gap: 6px; }

        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot-p { background: #6366f1; }
        .dot-a { background: #22c55e; }
        .dot-r { background: #f43f5e; }
      `}</style>

      <div className="rq-root">

        <div className="rq-page-header">
          <h1 className="rq-page-title">Request</h1>
          <p className="rq-page-subtitle">People who requested your tasks</p>
        </div>

        <div className="rq-task-card">
          <div className="rq-task-icon">📌</div>
          <div>
            <div className="rq-task-name">Task: {task.title}</div>
            <div className="rq-task-meta">
              <div className="rq-task-meta-item">📍 Location: {task.location}</div>
              <div className="rq-task-meta-item">🕙 Start Time: {task.startTime}</div>
            </div>
          </div>
          <div className="rq-badge">{requests.length} Requests</div>
        </div>

        <div className="rq-list">
          {requests.map(req => (
            <div
              key={req.id}
              className={`rq-card ${req.status || ""} ${animating?.id === req.id ? "pulse" : ""}`}
            >
              <img src={req.avatar} alt={req.name} className="rq-avatar" />

              <div className="rq-info">
                <div className="rq-name">{req.name}</div>
                <div className="rq-msg">💬 {req.message}</div>
                <div className="rq-date">Requested On: <strong>{req.requestedOn}</strong></div>
              </div>

              <div className="rq-actions">
                {req.status === null ? (
                  <>
                    <button className="btn btn-accept" onClick={() => handleAction(req.id, "accepted")}>
                      ✓ Accept
                    </button>
                    <button className="btn btn-reject" onClick={() => handleAction(req.id, "rejected")}>
                      ✕ Reject
                    </button>
                  </>
                ) : (
                  <div className={`status-badge status-${req.status}`}>
                    {req.status === "accepted" ? "✓ Accepted" : "✕ Rejected"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="summary-bar">
          <span style={{ fontWeight: 600, color: "#0f172a", fontFamily: "Sora, sans-serif" }}>Summary</span>
          <div className="summary-stats">
            <div className="stat"><div className="dot dot-p"></div>Pending: {requests.filter(r => r.status === null).length}</div>
            <div className="stat"><div className="dot dot-a"></div>Accepted: {requests.filter(r => r.status === "accepted").length}</div>
            <div className="stat"><div className="dot dot-r"></div>Rejected: {requests.filter(r => r.status === "rejected").length}</div>
          </div>
        </div>

      </div>
    </>
  )
}
=======
import { useState } from "react"
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaCheck, FaTimes } from "react-icons/fa"

function Requests() {
  // 1. Converted your array into state so the UI updates when buttons are clicked
  const [requests, setRequests] = useState([
    {
      id:1,
      category:"Home Repair",
      title:"Fix Bedroom Light",
      description:"You requested help to fix the flickering bedroom ceiling light.",
      location:"Your Home, New York",
      date:"Dec 22, 2024 • 10:00 AM",
      requestedFrom:"John Smith",
      image:"https://images.unsplash.com/photo-1524758631624-e2822e304c36",
      status:"Pending"
    },
    {
      id:2,
      category:"Delivery",
      title:"Weekly Groceries",
      description:"You requested a helper to pick up and deliver your weekly groceries.",
      location:"Supermart to Your Home",
      date:"Dec 23, 2024 • 6:00 PM",
      requestedFrom:"Anna Lee",
      image:"https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      status:"Accepted"
    },
    {
      id:3,
      category:"Tech Support",
      title:"Laptop Setup",
      description:"You requested someone to configure your new work laptop and install tools.",
      location:"Your Office, New York",
      date:"Dec 24, 2024 • 3:30 PM",
      requestedFrom:"Mark Taylor",
      image:"https://images.unsplash.com/photo-1492724441997-5dc865305da7",
      status:"Completed"
    }
  ])

  // 2. Handler functions to update the status
  const handleAccept = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "Accepted" } : req
    ))
  }

  const handleReject = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: "Rejected" } : req
    ))
  }

  return (
    <div style={{ background:"#f8fafc", minHeight:"100vh", padding:"40px" }}>

      {/* HEADER */}
      <div style={{ marginBottom:"40px" }}>
        <h1 style={{ fontSize:"28px", fontWeight:"700" }}>Requests</h1>
        <p style={{ color:"#64748b" }}>Requests you have sent to others</p>
      </div>

      {/* GRID */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(3, 1fr)",
        gap:"30px"
      }}>
        {requests.map(req => (
          <div key={req.id} style={cardStyle}>

            {/* IMAGE */}
            <div style={{ position:"relative" }}>
              <img
                src={req.image}
                alt={req.title}
                style={{
                  width:"100%",
                  height:"180px",
                  objectFit:"cover"
                }}
              />
              <span style={categoryStyle}>{req.category}</span>
              <span style={{
                ...statusStyle,
                background: getStatusColor(req.status)
              }}>
                {req.status}
              </span>
            </div>

            {/* BODY */}
            <div style={cardBodyStyle}>
              <h3 style={titleStyle}>{req.title}</h3>

              <p style={descStyle}>{req.description}</p>

              <div style={{ flexGrow:1 }}>
                <p style={infoRow}><FaMapMarkerAlt/> {req.location}</p>
                <p style={infoRow}><FaCalendarAlt/> {req.date}</p>
                <p style={infoRow}><FaUser/> Requested from {req.requestedFrom}</p>
              </div>

              {/* 🔥 CONDITIONAL BUTTONS */}
              {req.status === "Pending" ? (
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button onClick={() => handleAccept(req.id)} style={acceptBtnStyle}>
                    <FaCheck /> Accept
                  </button>
                  <button onClick={() => handleReject(req.id)} style={rejectBtnStyle}>
                    <FaTimes /> Reject
                  </button>
                </div>
              ) : (
                <button style={buttonStyle}>
                  View Details
                </button>
              )}

            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

/* ================= STYLES ================= */

const cardStyle = {
  background:"white",
  borderRadius:"15px",
  boxShadow:"0 8px 25px rgba(0,0,0,0.05)",
  overflow:"hidden",
  display:"flex",
  flexDirection:"column",
  height:"480px"
}

const cardBodyStyle = {
  padding:"20px",
  display:"flex",
  flexDirection:"column",
  height:"100%"
}

const categoryStyle = {
  position:"absolute",
  top:"12px",
  left:"12px",
  background:"#6366f1",
  color:"white",
  padding:"6px 12px",
  borderRadius:"20px",
  fontSize:"12px",
  fontWeight:"600"
}

const statusStyle = {
  position:"absolute",
  top:"12px",
  right:"12px",
  color:"white",
  padding:"6px 12px",
  borderRadius:"20px",
  fontSize:"12px",
  fontWeight:"600",
  transition: "background 0.3s ease" 
}

const titleStyle = {
  fontSize:"18px",
  fontWeight:"600",
  marginBottom:"8px"
}

const descStyle = {
  fontSize:"14px",
  color:"#64748b",
  marginBottom:"15px",
  height:"45px",
  overflow:"hidden"
}

const infoRow = {
  display:"flex",
  alignItems:"center",
  gap:"8px",
  color:"#64748b",
  fontSize:"13px",
  marginBottom:"8px"
}
const buttonStyle = {
  marginTop:"15px",
  width:"100%", 
  padding:"8px",
  borderRadius:"8px",
  border:"none",
  background:"#f1f5f9",
  color:"#475569",
  fontWeight:"600",
  cursor:"pointer"
}
const acceptBtnStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  padding:"8px",
  borderRadius:"8px",
  border:"none",
  background:"#10b981", 
  fontWeight:"600",
  cursor:"pointer",
  transition: "opacity 0.2s"
}
const rejectBtnStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  padding:"8px",
  borderRadius:"8px",
  border:"none",
  background:"#ef4444", 
  color:"white",
  fontWeight:"600",
  cursor:"pointer",
  transition: "opacity 0.2s"
}
function getStatusColor(status){
  if(status === "Pending") return "#f59e0b"
  if(status === "Accepted") return "#10b981"
  if(status === "Completed") return "#6366f1"
  if(status === "Rejected") return "#ef4444" 
  return "#64748b"
}
export default Requests
>>>>>>> 442c2d2f73bac3395bbbcfc42f6f688dab31ce75
