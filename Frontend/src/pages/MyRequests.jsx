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