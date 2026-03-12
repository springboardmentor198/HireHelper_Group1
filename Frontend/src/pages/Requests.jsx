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