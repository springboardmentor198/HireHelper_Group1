import { useState } from "react"
import axios from "axios"

function AddTask() {

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    date: "",
    time: "",
    description: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    //  TRACER LOGS ADDED HERE
    console.log("STEP 1: Button clicked! Form data:", formData);

    try {
      const token = localStorage.getItem("token")
      console.log("STEP 2: Token retrieved:", token ? "Token exists" : "No token");
      console.log(" STEP 3: Attempting to contact backend...");

      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log(" STEP 4: Backend replied!", response.data);
      alert("Task Posted Successfully 🚀")

      // Clear form
      setFormData({
        title: "",
        category: "",
        location: "",
        date: "",
        time: "",
        description: ""
      })

    } catch (error) {
      console.error("❌ ERROR: Catch block triggered!", error)
      alert("Error posting task")
    }
  }

  return (
    <div className="addtask-wrapper">
      <div className="page-header">
        <h1>Add Task</h1>
        <p>Create a new task and get help from the community</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>

        <h2>Create a New Task</h2>

        <label>Title</label>
        <input 
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <input 
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input 
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <div className="row">
          <div>
            <label>Date</label>
            <input 
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required 
            />
          </div>

          <div>
            <label>Time</label>
            <input 
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <div className="center-btn">
          <button type="submit" className="submit-btn">
            🚀 Post Task
          </button>
        </div>

      </form>
    </div>
  )
}

export default AddTask