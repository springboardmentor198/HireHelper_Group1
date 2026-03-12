import { useState, useEffect } from "react"
import axios from "axios"
// 1. Added FaTrash here
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaTrash } from "react-icons/fa"

function AddTask() {
  const [formData, setFormData] = useState({
    title: "", category: "", location: "", date: "", time: "", description: ""
  });
  const [file, setFile] = useState(null);
  const [myTasks, setMyTasks] = useState([]);

  const fetchMyTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/tasks/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyTasks(response.data);
    } catch (error) {
      console.error("Error fetching my tasks:", error);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("date", formData.date);
      data.append("time", formData.time);
      data.append("description", formData.description);
      
      if (file) {
        data.append("taskImage", file); 
      }

      await axios.post(
        "http://localhost:5000/api/tasks",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Task Posted Successfully with Image! 🚀");
      fetchMyTasks(); 
      setFormData({ title: "", category: "", location: "", date: "", time: "", description: "" });
      setFile(null);
      document.getElementById("taskImageInput").value = "";

    } catch (error) {
      console.error("ERROR:", error);
      alert("Error posting task");
    }
  };

  // 2. Added the handleDelete function
  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove the task from the screen instantly
      setMyTasks(myTasks.filter(task => task._id !== taskId));
      alert("Task deleted successfully 🗑️");

    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  return (
    <div className="addtask-wrapper" style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
      <div className="page-header" style={{ marginBottom: "40px" }}>
        <h1>My Tasks</h1>
        <p>Manage your created tasks and ask for help from the community</p>
      </div>

      {myTasks.length > 0 && (
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(3, 1fr)",
          gap:"30px",
          marginBottom: "50px"
        }}>
          {myTasks.map(req => (
            <div key={req._id} style={cardStyle}>
              
              <div style={{ position:"relative" }}>
                <img
                  src={req.taskImage ? `http://localhost:5000${req.taskImage}` : "https://images.unsplash.com/photo-1507089947368-19c1da9775ae"} 
                  alt={req.title}
                  style={{ width:"100%", height:"180px", objectFit:"cover" }}
                />
                <span style={categoryStyle}>{req.category}</span>
                <span style={statusStyle}>{req.status || "Waiting"}</span>
              </div>

              <div style={cardBodyStyle}>
                <h3 style={titleStyle}>{req.title}</h3>
                <p style={descStyle}>{req.description}</p>
                <div style={{ flexGrow:1 }}>
                  <p style={infoRow}><FaMapMarkerAlt/> {req.location}</p>
                  <p style={infoRow}><FaCalendarAlt/> {req.date} • {req.time}</p>
                  <p style={infoRow}><FaUser/> Requested by You</p>
                </div>
                
                {/*3. Added the flex container and the Delete Button */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                  <button style={buttonStyle}>⏳ Waiting for Helper</button>
                  
                  <button 
                    onClick={() => handleDelete(req._id)}
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

      {/* THE FORM */}
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Create a New Task</h2>

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
        <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>

        <label>Upload Task Image (Optional)</label>
        <input 
          id="taskImageInput"
          type="file" 
          name="taskImage" 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ 
            marginBottom: "20px", padding: "10px", border: "1px dashed #6366f1", borderRadius: "8px", width: "100%" 
          }}
        />

        <div className="center-btn">
          <button type="submit" className="submit-btn">
            🚀 Post Task
          </button>
        </div>
      </form>
    </div>
  );
}

const cardStyle = { background:"white", borderRadius:"15px", boxShadow:"0 8px 25px rgba(0,0,0,0.05)", overflow:"hidden", display:"flex", flexDirection:"column", height:"480px" }
const cardBodyStyle = { padding:"20px", display:"flex", flexDirection:"column", height:"100%" }
const categoryStyle = { position:"absolute", top:"12px", left:"12px", background:"#6366f1", color:"white", padding:"6px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:"600" }
const statusStyle = { position:"absolute", top:"12px", right:"12px", background:"#f59e0b", color:"white", padding:"6px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:"600" }
const titleStyle = { fontSize:"18px", fontWeight:"600", marginBottom:"8px" }
const descStyle = { fontSize:"14px", color:"#64748b", marginBottom:"15px", height:"45px", overflow:"hidden" }
const infoRow = { display:"flex", alignItems:"center", gap:"8px", color:"#64748b", fontSize:"13px", marginBottom:"8px" }
const buttonStyle = { width:"180px", padding:"8px", borderRadius:"8px", border:"none", background:"#f59e0b", color:"white", fontWeight:"600", cursor:"pointer" }

export default AddTask;