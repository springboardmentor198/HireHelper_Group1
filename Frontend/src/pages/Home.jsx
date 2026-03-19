import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaUserShield, FaBolt, FaWallet, FaHeadset } from "react-icons/fa"
import heroImg from "../assets/industrial-manpower-service-provider-pic-removebg-preview.png"
import w1 from "../assets/w1.jpeg"
import w2 from "../assets/w2.jpeg"
import w3 from "../assets/w3.jpeg"




function Home() {
  return (
    <div className="home-wrapper">

      {/* ================= NAVBAR ================= */}
      <div className="navbar">
        <div className="logo">HireHelper</div>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-btn">Get Started</Link>
        </div>
      </div>


      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">

        {/* LEFT */}
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            Find Skilled Workers <br />
            Near You Instantly
          </h1>

          <p>
            Electricians, Plumbers, Drivers, Cleaners & More —
            Hire trusted professionals in minutes.
          </p>

          <div className="search-box">
            <input type="text" placeholder="What service do you need?" />
            <input type="text" placeholder="Location" />
            <button>Search</button>
          </div>

          <div className="quick-categories">
            <span>Electrician</span>
            <span>Plumber</span>
            <span>Driver</span>
            <span>Cleaner</span>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={heroImg} alt="workers" />
        </motion.div>

      </section>


      {/* ================= TRUST SECTION ================= */}
      <section className="trust-section">
        <div className="trust-box">
          <h3>10,000+</h3>
          <p>Jobs Completed</p>
        </div>

        <div className="trust-box">
          <h3>5,000+</h3>
          <p>Active Workers</p>
        </div>

        <div className="trust-box">
          <h3>4.8⭐</h3>
          <p>Average Rating</p>
        </div>
      </section>


      {/* ================= CATEGORIES ================= */}
      <section className="categories-section">
        <h2>Popular Categories</h2>

        <div className="categories-grid">
          {["Electrician","Plumber","Cleaner","Driver","Carpenter","Painter", "AC Technician","Home Appliance Repair"].map((cat,index)=>(
            <div key={index} className="category-card">
              <h3>{cat}</h3>
            </div>
          ))}
        </div>
      </section>


      {/* ================= WHY CHOOSE ================= */}
      <section className="why-section">
        <h2>Why Choose HireHelper?</h2>

        <div className="why-grid">
          <div className="why-card">
            <FaUserShield size={35}/>
            <h4>Verified Workers</h4>
          </div>

          <div className="why-card">
            <FaWallet size={35}/>
            <h4>Affordable Prices</h4>
          </div>

          <div className="why-card">
            <FaBolt size={35}/>
            <h4>Fast Booking</h4>
          </div>

          <div className="why-card">
            <FaHeadset size={35}/>
            <h4>24/7 Support</h4>
          </div>
        </div>
      </section>

<<<<<<< HEAD
<<<<<<< HEAD
      {/* ================= TOP HELPERS ================= */}
      <section className="workers-section">
        <h2>Top Rated Helpers</h2>
        <p className="workers-subtitle">
          Verified professionals with great ratings — ready for quick bookings.
        </p>

        <div className="workers-grid">
          {[
            { name: "Rani", job: "Electrician", rating: "4.8", exp: "5 Years", img: w1 },
            { name: "Ram", job: "Plumber", rating: "4.6", exp: "3 Years", img: w2 },
            { name: "Sai", job: "Driver", rating: "4.9", exp: "7 Years", img: w3 }
          ].map((worker, index) => (
            <div key={index} className="worker-card">
              <div className="worker-img-wrapper">
                <img src={worker.img} alt={worker.name} className="worker-img" />
                <span className="verified-badge">Verified</span>
                <span className="worker-rating">⭐ {worker.rating}</span>
              </div>

              <div className="worker-body">
                <div className="worker-title">
                  <h3>{worker.name}</h3>
                  <p className="worker-job">{worker.job}</p>
                </div>

                <small className="worker-exp">{worker.exp} Experience</small>

                <button className="book-btn">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>
=======
=======
>>>>>>> 9342359e0ad5a1640f6c35dc9ac2d44135747b18

      <div className="workers-grid">
  {[
    {name:"Omkar", job:"Electrician", rating:"4.8", exp:"5 Years", img: w1},
    {name:"Ram", job:"Plumber", rating:"4.6", exp:"3 Years", img: w2},
    {name:"Sai", job:"Driver", rating:"4.9", exp:"7 Years", img: w3},
  ].map((worker,index)=>(

    <div key={index} className="worker-card">

      <div className="worker-img-wrapper">
        <img src={worker.img} alt={worker.name} className="worker-img"/>
        <span className="verified-badge">✔</span>
      </div>

      <h3>{worker.name}</h3>
      <p className="worker-job">{worker.job}</p>

      <div className="worker-rating">
        ⭐ {worker.rating}
      </div>

      <small className="worker-exp">
        {worker.exp} Experience
      </small>

      <button className="book-btn">Book Now</button>

    </div>

  ))}
</div>
<<<<<<< HEAD
>>>>>>> 442c2d2f73bac3395bbbcfc42f6f688dab31ce75
=======
>>>>>>> 9342359e0ad5a1640f6c35dc9ac2d44135747b18
      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div className="footer-grid">

          <div>
            <h3>HireHelper</h3>
            <p>Connecting skilled workers with customers easily.</p>
          </div>

          <div>
            <h4>Company</h4>
            <p>About Us</p>
            <p>Contact</p>
            <p>Privacy Policy</p>
            <p>Terms</p>
          </div>

          <div>
            <h4>Follow Us</h4>
            <p>Instagram</p>
            <p>Facebook</p>
            <p>Twitter</p>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 HireHelper. All Rights Reserved.
        </div>

      </footer>

    </div>
  )
}

export default Home