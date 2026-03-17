<<<<<<< HEAD
import { useState, useEffect } from "react"
import axios from "axios"

const initialRequests = [
  { id: 1, task: "Clean Backyard",   location: "Bhubaneswar", owner: "Rahul",  date: "2 March 2026",  status: "Pending"  },
  { id: 2, task: "Fix Leaky Faucet", location: "Patna",       owner: "Anita",  date: "25 Feb 2026",   status: "Accepted" },
  { id: 3, task: "Move Furniture",   location: "Rourkela",    owner: "Vikram", date: "18 Feb 2026",   status: "Rejected" },
  { id: 4, task: "Tutoring Math",    location: "Cuttack",     owner: "Amit",   date: "12 Jan 2026",   status: "Accepted" },
  { id: 5, task: "Repair Kitchen",   location: "Mumbai",      owner: "Samir",  date: "3 March 2026",  status: "Pending"  },
]

const statusStyle = {
  Pending:  { bg: "#fef3c7", color: "#b45309", dot: "#f59e0b" },
  Accepted: { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  Rejected: { bg: "#ffe4e6", color: "#be123c", dot: "#f43f5e" },
}

const taskIcons = {
  "Clean Backyard":   "🌿",
  "Fix Leaky Faucet": "🔧",
  "Move Furniture":   "📦",
  "Tutoring Math":    "📐",
  "Repair Kitchen":   "🍳",
}

export default function MyRequests() {
  const [requests,setRequests] = useState(initialRequests)
  const [filter, setFilter] = useState("All")
  //  Fetch the live requests you sent to other users
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:5000/requests/my", {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        // Format the backend data to match your table's structure
        const liveRequests = res.data.map(req => {
          // Capitalize the first letter of status so your CSS colors work ("accepted" -> "Accepted")
          const formattedStatus = req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1) : "Pending";
          
          return {
            id: req._id,
            task: req.taskId?.title || "Task",
            location: req.taskId?.location || "Remote",
            owner: req.taskId?.owner?.name || "Member",
            date: new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: formattedStatus
          }
        })

        // Combine your dummy data with the real live data
        setRequests([...initialRequests, ...liveRequests])
      } catch (error) {
        console.error("Error fetching my requests:", error)
      }
    }
    
    fetchMyRequests()
  }, [])
  const filtered = filter === "All" ? requests : requests.filter(r => r.status === filter)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .mr-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%);
          padding: 48px 36px;
        }

        .mr-header { margin-bottom: 24px; }
        .mr-title {
          font-family: 'Sora', sans-serif;
          font-size: 28px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.5px;
        }
        .mr-subtitle { margin-top: 5px; font-size: 14px; color: #64748b; }

        .mr-stats { display: flex; gap: 12px; margin-bottom: 22px; flex-wrap: wrap; }

        .stat-card {
          flex: 1; min-width: 90px;
          background: white; border-radius: 14px;
          padding: 14px 18px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: all 0.2s;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,102,241,0.1); }
        .stat-num { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 700; line-height: 1; }
        .stat-label { font-size: 12px; color: #94a3b8; margin-top: 4px; font-weight: 500; }

        .mr-filters { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }

        .filter-pill {
          padding: 6px 16px; border-radius: 20px;
          border: 1.5px solid #e2e8f0; background: white;
          font-size: 13px; font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer; color: #64748b;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .filter-pill:hover { border-color: #a5b4fc; color: #4f46e5; transform: translateY(-1px); }
        .fp-All      { background: #1e293b !important; color: white !important; border-color: #1e293b !important; box-shadow: 0 4px 12px rgba(30,41,59,0.25); }
        .fp-Pending  { background: #fef3c7 !important; color: #b45309 !important; border-color: #fde68a !important; }
        .fp-Accepted { background: #dcfce7 !important; color: #15803d !important; border-color: #86efac !important; }
        .fp-Rejected { background: #ffe4e6 !important; color: #be123c !important; border-color: #fca5a5 !important; }

        .mr-card {
          background: white; border-radius: 20px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 4px 24px rgba(99,102,241,0.07);
          overflow: hidden;
        }

        table { width: 100%; border-collapse: collapse; }

        thead tr {
          background: linear-gradient(135deg, #f8faff, #f3f0ff);
          border-bottom: 1.5px solid #e2e8f0;
        }

        thead th {
          padding: 14px 20px;
          font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 700;
          color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;
          text-align: left;
        }
        thead th:last-child { text-align: center; }

        tbody tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s;
          animation: fadeRow 0.35s ease both;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #f8faff; }

        @keyframes fadeRow {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        tbody td {
          padding: 15px 20px;
          font-size: 14px; color: #1e293b; font-weight: 500;
          vertical-align: middle;
        }
        tbody td:last-child { text-align: center; }

        .task-cell { display: flex; align-items: center; gap: 10px; }

        .task-icon-sm {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
          transition: transform 0.2s;
        }
        tbody tr:hover .task-icon-sm { transform: scale(1.1) rotate(-5deg); }

        .task-name { font-weight: 600; color: #0f172a; }
        .loc-cell { color: #475569; font-size: 13px; }
        .date-cell { color: #64748b; font-size: 13px; white-space: nowrap; }

        .owner-cell { display: flex; align-items: center; gap: 8px; }
        .owner-av {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: white;
          font-family: 'Sora', sans-serif; flex-shrink: 0;
        }

        .status-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 13px; border-radius: 20px;
          font-size: 12px; font-weight: 700;
          font-family: 'Sora', sans-serif;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
          white-space: nowrap;
        }
        tbody tr:hover .status-pill { transform: scale(1.08); }

        .empty { padding: 48px; text-align: center; }
        .empty-icon { font-size: 40px; margin-bottom: 10px; }
        .empty-text { font-size: 15px; font-family: 'Sora', sans-serif; font-weight: 600; color: #475569; }
        .empty-sub  { font-size: 13px; color: #94a3b8; margin-top: 4px; }
      `}</style>

      <div className="mr-root">
        <div className="mr-header">
          <h1 className="mr-title">My Requests</h1>
          <p className="mr-subtitle">Track all the tasks you requested to help</p>
        </div>

        <div className="mr-stats">
          {[
            { label: "Total",    count: requests.length,                                      color: "#6366f1" },
            { label: "Pending",  count: requests.filter(r => r.status === "Pending").length,  color: "#f59e0b" },
            { label: "Accepted", count: requests.filter(r => r.status === "Accepted").length, color: "#22c55e" },
            { label: "Rejected", count: requests.filter(r => r.status === "Rejected").length, color: "#f43f5e" },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-num" style={{ color: s.color }}>{s.count}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mr-filters">
          {["All", "Pending", "Accepted", "Rejected"].map(f => (
            <button
              key={f}
              className={`filter-pill ${filter === f ? `fp-${f}` : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "All" ? "All Requests" : f}
            </button>
          ))}
        </div>

        <div className="mr-card">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Location</th>
                <th>Owner</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty">
                      <div className="empty-icon">📭</div>
                      <div className="empty-text">No {filter} requests</div>
                      <div className="empty-sub">Try a different filter</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((req, i) => {
                const s = statusStyle[req.status]
                return (
                  <tr key={req.id} style={{ animationDelay: `${i * 55}ms` }}>
                    <td>
                      <div className="task-cell">
                        <div className="task-icon-sm">{taskIcons[req.task] || "📌"}</div>
                        <span className="task-name">{req.task}</span>
                      </div>
                    </td>
                    <td className="loc-cell">📍 {req.location}</td>
                    <td>
                      <div className="owner-cell">
                        <div className="owner-av">{req.owner[0]}</div>
                        {req.owner}
                      </div>
                    </td>
                    <td className="date-cell">📅 {req.date}</td>
                    <td>
                      <span className="status-pill" style={{ background: s.bg, color: s.color }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0 }} />
                        {req.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
=======
import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa"

function MyRequests() {

  const requests = [
    {
      id:1,
      category:"Cleaning",
      title:"Deep Clean Kitchen",
      description:"Full kitchen deep clean including oven, fridge, and cabinets.",
      location:"Your Home, New York",
      date:"Dec 26, 2024 • 9:00 AM",
      requestedBy:"You",
      image:"https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
      status:"Waiting"
    },
    {
      id:2,
      category:"Painting",
      title:"Paint Bedroom",
      description:"Need help painting a small bedroom. Paint and tools will be provided.",
      location:"Your Home, Brooklyn",
      date:"Dec 27, 2024 • 1:00 PM",
      requestedBy:"You",
      image:"https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      status:"Waiting"
    },
    {
      id:3,
      category:"Assembly",
      title:"Assemble Wardrobe",
      description:"Need a helper to assemble a flat-pack wardrobe and secure it to the wall.",
      location:"Your Apartment, Queens",
      date:"Dec 28, 2024 • 4:30 PM",
      requestedBy:"You",
      image:"https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
      status:"Waiting"
    }
  ]

  return (
    <div style={{ background:"#f8fafc", minHeight:"100vh", padding:"40px" }}>

      {/* HEADER */}
      <div style={{ marginBottom:"40px" }}>
        <h1 style={{ fontSize:"28px", fontWeight:"700" }}>My Requests</h1>
        <p style={{ color:"#64748b" }}>
          Tasks you have created and are waiting for helpers
        </p>
      </div>

      {/* GRID */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(3, 1fr)",  // 🔥 3 fixed cards
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
              <span style={statusStyle}>{req.status}</span>
            </div>

            {/* BODY */}
            <div style={cardBodyStyle}>
              <h3 style={titleStyle}>{req.title}</h3>

              {/* 🔥 Fixed description height */}
              <p style={descStyle}>{req.description}</p>

              <div style={{ flexGrow:1 }}>
                <p style={infoRow}><FaMapMarkerAlt/> {req.location}</p>
                <p style={infoRow}><FaCalendarAlt/> {req.date}</p>
                <p style={infoRow}><FaUser/> Requested by {req.requestedBy}</p>
              </div>

              <button style={buttonStyle}>
                ⏳ Waiting for Helper
              </button>
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
  height:"480px"  // 🔥 Fixed equal height
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
  background:"#f59e0b",
  color:"white",
  padding:"6px 12px",
  borderRadius:"20px",
  fontSize:"12px",
  fontWeight:"600"
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
  height:"45px",   // 🔥 Fixed description height
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
  width:"180px",
  padding:"8px",
  borderRadius:"8px",
  border:"none",
  background:"#f59e0b",
  color:"white",
  fontWeight:"600",
  cursor:"pointer"
}

export default MyRequests
>>>>>>> 442c2d2f73bac3395bbbcfc42f6f688dab31ce75
