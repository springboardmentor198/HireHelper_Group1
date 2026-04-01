import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaUserShield, FaBolt, FaWallet, FaHeadset, FaGooglePlay, FaApple, FaSearch } from "react-icons/fa"
import heroImg from "../assets/industrial-manpower-service-provider-pic-removebg-preview.png"
import w1 from "../assets/w1.jpeg"
import w2 from "../assets/w2.jpeg"
import w3 from "../assets/w3.jpeg"

// 👇 REPLACE THIS with your actual worker image URL
const WORKER_IMG_URL = "https://YOUR_WORKER_IMAGE_LINK_HERE"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" }
  })
}

const categories = [
  { label: "Cleaning Service", emoji: "🧹" },
  { label: "Electrician",      emoji: "⚡" },
  { label: "Plumber",          emoji: "🔧" },
  { label: "AC Service",       emoji: "❄️" },
  { label: "Carpenter",        emoji: "🪚" },
  { label: "TV Service",       emoji: "📺" },
]

function Home() {
  return (
    <div className="home-wrapper">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --primary: #5b21b6;
          --primary-light: #7c3aed;
          --accent: #f59e0b;
          --dark: #0f0a1e;
          --text: #1e1b2e;
          --muted: #64748b;
          --bg: #f8f7ff;
          --white: #ffffff;
          --card-shadow: 0 8px 32px rgba(91,33,182,0.10);
          --hover-shadow: 0 20px 60px rgba(91,33,182,0.18);
        }
        body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }

        /* NAVBAR */
        .navbar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 60px;
          background: rgba(255,255,255,0.85); backdrop-filter: blur(16px);
          position: sticky; top: 0; z-index: 100;
          border-bottom: 1px solid rgba(91,33,182,0.08);
        }
        .logo {
          font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .nav-links { display: flex; align-items: center; gap: 20px; }
        .nav-links a { font-weight: 500; color: var(--text); text-decoration: none; font-size: 0.95rem; transition: color 0.2s; }
        .nav-links a:hover { color: var(--primary); }
        .nav-btn {
          background: linear-gradient(135deg, var(--primary), var(--primary-light)) !important;
          color: white !important; padding: 10px 24px; border-radius: 50px;
          font-weight: 600 !important; transition: transform 0.2s, box-shadow 0.2s !important;
          box-shadow: 0 4px 14px rgba(91,33,182,0.3);
        }
        .nav-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(91,33,182,0.4) !important; }

        /* ===== HERO - PURPLE STYLE ===== */
        .hero-section {
          display: flex; align-items: center; justify-content: space-between;
          padding: 60px 60px 0; min-height: 90vh;
          background: linear-gradient(135deg, #4c1d95 0%, #5b21b6 40%, #6d28d9 100%);
          position: relative; overflow: hidden;
        }
        .hero-section::before {
          content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%;
          background: rgba(255,255,255,0.04); bottom: -150px; left: -80px; pointer-events: none;
          border: 2px solid rgba(255,255,255,0.08);
        }
        .hero-section::after {
          content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%;
          background: rgba(245,158,11,0.12); bottom: 80px; left: 300px; pointer-events: none;
          border: 2px solid rgba(245,158,11,0.15);
        }
        .hero-left { max-width: 520px; z-index: 2; padding-bottom: 60px; }
        .hero-left h1 {
          font-family: 'Syne', sans-serif; font-size: clamp(2.2rem, 3.5vw, 3.2rem);
          font-weight: 800; line-height: 1.15; color: white; letter-spacing: -1px; margin-bottom: 20px;
        }
        .hero-left p { font-size: 1.05rem; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 36px; }

        .app-btns { display: flex; gap: 16px; flex-wrap: wrap; }
        .app-btn {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255,255,255,0.25); color: white;
          padding: 12px 22px; border-radius: 50px; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; transition: all 0.25s; text-decoration: none;
        }
        .app-btn:hover { background: white; color: var(--primary); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .app-btn svg { font-size: 1.2rem; }

        /* Phone Mockup */
        .hero-right { flex: 1; display: flex; justify-content: flex-end; align-items: flex-end; z-index: 2; padding-top: 30px; }
        .phone-mockup {
          background: white; border-radius: 28px 28px 0 0;
          width: 360px; padding: 20px;
          box-shadow: 0 -10px 60px rgba(0,0,0,0.3);
          min-height: 460px;
        }
        .phone-search {
          display: flex; align-items: center; gap: 10px;
          border: 1.5px solid #e5e7eb; border-radius: 12px;
          padding: 12px 16px; margin-bottom: 22px; color: #9ca3af;
        }
        .phone-search span { font-size: 0.95rem; }
        .phone-label { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; color: #111; margin-bottom: 16px; }
        .phone-cats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .phone-cat {
          border: 1.5px solid #f3f4f6; border-radius: 14px;
          padding: 18px 14px; text-align: center; cursor: pointer;
          transition: all 0.25s; background: #fafafa;
        }
        .phone-cat:hover { border-color: var(--primary-light); background: #f5f0ff; transform: scale(1.03); }
        .phone-cat .cat-emoji { font-size: 1.8rem; margin-bottom: 8px; }
        .phone-cat span { font-size: 0.82rem; font-weight: 600; color: #374151; display: block; }

        /* TRUST */
        .trust-section {
          display: flex; justify-content: center; gap: 0;
          padding: 0 60px; margin-top: -30px; position: relative; z-index: 2;
        }
        .trust-box {
          background: var(--white); border-radius: 20px; padding: 28px 50px; text-align: center;
          box-shadow: var(--card-shadow); border: 1.5px solid rgba(91,33,182,0.07);
          transition: all 0.3s ease; flex: 1; max-width: 220px; margin: 0 10px;
        }
        .trust-box:hover { transform: translateY(-6px); box-shadow: var(--hover-shadow); border-color: rgba(91,33,182,0.2); }
        .trust-box h3 { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: var(--primary); margin-bottom: 6px; }
        .trust-box p { color: var(--muted); font-size: 0.9rem; font-weight: 500; }

        /* REDEFINE */
        .redefine-section {
          display: flex; align-items: center; gap: 60px; padding: 90px 60px;
          background: linear-gradient(135deg, #0f0a1e 0%, #1e0a3c 100%);
          position: relative; overflow: hidden;
        }
        .redefine-section::before {
          content: ''; position: absolute; width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%);
          top: -200px; right: -100px; pointer-events: none;
        }
        .redefine-left { flex: 1; z-index: 1; }
        .redefine-left h2 {
          font-family: 'Syne', sans-serif; font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 800; color: white; line-height: 1.2; letter-spacing: -0.5px;
        }
        .redefine-left h2 span {
          background: linear-gradient(135deg, #a78bfa, #f59e0b);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .redefine-right { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1; z-index: 1; }
        .redefine-card { padding: 28px; border-radius: 18px; transition: all 0.3s ease; border: 1.5px solid transparent; }
        .redefine-card:hover { transform: translateY(-6px) scale(1.02); border-color: rgba(255,255,255,0.15); }
        .redefine-card h3 { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; margin-bottom: 6px; }
        .redefine-card p { font-size: 0.92rem; color: rgba(255,255,255,0.65); font-weight: 500; }
        .rc-green { background: rgba(16,185,129,0.12); } .rc-green h3 { color: #34d399; }
        .rc-yellow { background: rgba(245,158,11,0.12); } .rc-yellow h3 { color: #fbbf24; }
        .rc-purple { background: rgba(167,139,250,0.12); } .rc-purple h3 { color: #a78bfa; }
        .rc-orange { background: rgba(251,146,60,0.12); } .rc-orange h3 { color: #fb923c; }

        /* ===== HOW IT WORKS ===== */
        .how-section {
          display: flex; align-items: center; gap: 60px;
          padding: 90px 60px; background: #eeeaf8;
        }
        .how-left { flex: 1; }
        .how-left h2 { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: var(--dark); margin-bottom: 40px; letter-spacing: -0.5px; }
        .how-steps { display: flex; flex-direction: column; gap: 36px; }
        .how-step { display: flex; align-items: flex-start; gap: 20px; }
        .step-num {
          min-width: 52px; height: 52px; border-radius: 50%;
          background: white; border: 2px solid rgba(91,33,182,0.15);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800;
          color: var(--dark); box-shadow: 0 4px 16px rgba(91,33,182,0.1);
          transition: all 0.3s;
        }
        .how-step:hover .step-num { background: var(--primary); color: white; border-color: var(--primary); transform: scale(1.1); }
        .step-text h4 { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 700; color: var(--dark); margin-bottom: 6px; }
        .step-text p { color: var(--muted); font-size: 0.92rem; line-height: 1.6; max-width: 360px; }
        .how-right { flex: 1; display: flex; justify-content: flex-end; }
        .how-right img {
          max-width: 420px; width: 100%;
          filter: drop-shadow(0 20px 40px rgba(91,33,182,0.15));
          transition: transform 0.4s;
        }
        .how-right img:hover { transform: translateY(-8px); }

        /* CATEGORIES */
        .categories-section { padding: 90px 60px; background: var(--bg); text-align: center; }
        .categories-section h2 { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; color: var(--dark); margin-bottom: 50px; letter-spacing: -0.5px; }
        .categories-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; max-width: 900px; margin: 0 auto; }
        .category-card {
          background: var(--white); border-radius: 16px; padding: 28px 20px;
          border: 1.5px solid rgba(91,33,182,0.08); cursor: pointer;
          transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .category-card::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          opacity: 0; transition: opacity 0.3s; z-index: 0;
        }
        .category-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(91,33,182,0.2); }
        .category-card:hover::after { opacity: 1; }
        .category-card:hover h3 { color: white; }
        .category-card h3 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: var(--text); position: relative; z-index: 1; transition: color 0.3s; }

        /* WHY */
        .why-section { padding: 90px 60px; background: linear-gradient(135deg, #faf9ff, #f0ebff); text-align: center; }
        .why-section h2 { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; color: var(--dark); margin-bottom: 50px; letter-spacing: -0.5px; }
        .why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 900px; margin: 0 auto; }
        .why-card { background: var(--white); border-radius: 20px; padding: 36px 24px; border: 1.5px solid rgba(91,33,182,0.08); transition: all 0.3s ease; }
        .why-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(91,33,182,0.15); border-color: rgba(91,33,182,0.25); background: linear-gradient(135deg, #faf8ff, #f3edff); }
        .why-card svg { color: var(--primary); margin-bottom: 16px; transition: transform 0.3s; }
        .why-card:hover svg { transform: scale(1.2) rotate(-5deg); }
        .why-card h4 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: var(--text); }

        /* WORKERS */
        .workers-section { padding: 90px 60px; background: var(--bg); text-align: center; }
        .workers-section h2 { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; color: var(--dark); margin-bottom: 10px; letter-spacing: -0.5px; }
        .workers-subtitle { color: var(--muted); margin-bottom: 50px; font-size: 1rem; }
        .workers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; max-width: 960px; margin: 0 auto; }
        .worker-card { background: var(--white); border-radius: 24px; overflow: hidden; border: 1.5px solid rgba(91,33,182,0.08); transition: all 0.35s ease; box-shadow: var(--card-shadow); }
        .worker-card:hover { transform: translateY(-10px); box-shadow: 0 24px 70px rgba(91,33,182,0.18); border-color: rgba(91,33,182,0.2); }
        .worker-img-wrapper { position: relative; height: 200px; overflow: hidden; }
        .worker-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .worker-card:hover .worker-img { transform: scale(1.06); }
        .verified-badge { position: absolute; top: 12px; left: 12px; background: linear-gradient(135deg, #10b981, #059669); color: white; font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 50px; }
        .worker-rating { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px); color: white; font-size: 0.8rem; font-weight: 600; padding: 4px 10px; border-radius: 50px; }
        .worker-body { padding: 22px; text-align: left; }
        .worker-title { margin-bottom: 8px; }
        .worker-title h3 { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 700; color: var(--dark); }
        .worker-job { color: var(--primary); font-size: 0.88rem; font-weight: 500; }
        .worker-exp { color: var(--muted); font-size: 0.82rem; display: block; margin-bottom: 16px; }
        .book-btn { width: 100%; background: linear-gradient(135deg, var(--primary), var(--primary-light)); color: white; border: none; padding: 12px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.25s; }
        .book-btn:hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(91,33,182,0.35); }

        /* ===== JOIN PARTNER SECTION ===== */
        .partner-section {
          display: flex; align-items: center; gap: 0;
          background: #f5f3ff; min-height: 500px; overflow: hidden;
        }
        .partner-img-side {
          flex: 1; min-height: 500px; position: relative; overflow: hidden;
        }
        .partner-img-side img {
          width: 100%; height: 100%; object-fit: cover; object-position: top center;
          transition: transform 0.5s;
        }
        .partner-img-side:hover img { transform: scale(1.04); }
        .partner-content {
          flex: 1; padding: 60px 70px;
        }
        .partner-content h2 {
          font-family: 'Syne', sans-serif; font-size: clamp(1.8rem, 2.5vw, 2.8rem);
          font-weight: 800; color: var(--dark); margin-bottom: 20px; line-height: 1.2; letter-spacing: -0.5px;
        }
        .partner-content p { color: var(--muted); font-size: 1rem; line-height: 1.7; margin-bottom: 36px; max-width: 420px; }
        .register-btn {
          display: inline-block;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white; border: none; padding: 16px 40px; border-radius: 50px;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem;
          cursor: pointer; transition: all 0.3s; text-decoration: none;
          box-shadow: 0 8px 24px rgba(91,33,182,0.35); letter-spacing: 0.3px;
        }
        .register-btn:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(91,33,182,0.45); }

        /* FOOTER */
        .footer { background: var(--dark); color: rgba(255,255,255,0.75); padding: 60px 60px 30px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 50px; padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 30px; }
        .footer-grid h3 { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; background: linear-gradient(135deg, var(--primary-light), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 10px; }
        .footer-grid h4 { font-family: 'Syne', sans-serif; font-weight: 700; color: white; margin-bottom: 14px; font-size: 0.95rem; }
        .footer-grid p { font-size: 0.88rem; margin-bottom: 8px; cursor: pointer; transition: color 0.2s; }
        .footer-grid p:hover { color: white; }
        .footer-bottom { text-align: center; font-size: 0.82rem; color: rgba(255,255,255,0.35); }
      `}</style>

      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">HireHelper</div>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-btn">Get Started</Link>
        </div>
      </div>

      {/* ===== HERO - PURPLE + PHONE MOCKUP ===== */}
      <section className="hero-section">
        <motion.div className="hero-left" initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <h1>Instant Home Services at<br />Your Fingertips</h1>
          <p>Book professional home services with just a few clicks.<br />Experience quick, reliable, and hassle-free service from verified experts.</p>
          <div className="app-btns">
            <a className="app-btn" href="#"><FaGooglePlay /> Google Play</a>
            <a className="app-btn" href="#"><FaApple /> App Store</a>
          </div>
        </motion.div>

        <motion.div className="hero-right" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
          <div className="phone-mockup">
            <div className="phone-search">
              <FaSearch size={14} />
              <span>Search</span>
            </div>
            <div className="phone-label">Service near you</div>
            <div className="phone-cats">
              {categories.map((cat, i) => (
                <div key={i} className="phone-cat">
                  <div className="cat-emoji">{cat.emoji}</div>
                  <span>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* TRUST */}
      <section className="trust-section">
        {[
          { num: "10,000+", label: "Jobs Completed" },
          { num: "5,000+", label: "Active Workers" },
          { num: "4.8 ⭐", label: "Average Rating" }
        ].map((item, i) => (
          <motion.div key={i} className="trust-box" custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3>{item.num}</h3><p>{item.label}</p>
          </motion.div>
        ))}
      </section>

      {/* REDEFINE */}
      <section className="redefine-section">
        <motion.div className="redefine-left" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2>How We <span>Redefine</span><br />Home Services</h2>
        </motion.div>
        <div className="redefine-right">
          {[
            { num: "20,000+", label: "Bookings", cls: "rc-green" },
            { num: "5000+",   label: "Vendors",  cls: "rc-yellow" },
            { num: "50+",     label: "Services", cls: "rc-purple" },
            { num: "100+",    label: "Areas",    cls: "rc-orange" }
          ].map((item, i) => (
            <motion.div key={i} className={`redefine-card ${item.cls}`} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3>{item.num}</h3><p>{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-section">
        <motion.div className="how-left" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2>How HireHelper Works</h2>
          <div className="how-steps">
            {[
              { n: "1", title: "Search on HireHelper", desc: "In the search bar section, look for any home service you want to opt for." },
              { n: "2", title: "Select your nearby",   desc: "Add a location or enable automated tracking to find home services in your desired area." },
              { n: "3", title: "Book the service",     desc: "Choose your expert, pick a time slot, and confirm your booking in seconds." },
              { n: "4", title: "Get it done",          desc: "Your verified professional arrives on time and gets the job done with quality." }
            ].map((step, i) => (
              <motion.div key={i} className="how-step" custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="step-num">{step.n}</div>
                <div className="step-text">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
  className="how-right"
  initial={{ opacity: 0, x: 60 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
>
  <img
    src="/src/assets/worker_how_to_work-removebg-preview.png"
    alt="Worker"
    onError={(e) => { e.target.src = heroImg }}
  />
</motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Popular Categories</motion.h2>
        <div className="categories-grid">
          {["Electrician","Plumber","Cleaner","Driver","Carpenter","Painter","AC Technician","Home Appliance Repair"].map((cat, i) => (
            <motion.div key={i} className="category-card" custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h3>{cat}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="why-section">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Why Choose HireHelper?</motion.h2>
        <div className="why-grid">
          {[
            { icon: <FaUserShield size={35}/>, label: "Verified Workers" },
            { icon: <FaWallet size={35}/>,     label: "Affordable Prices" },
            { icon: <FaBolt size={35}/>,       label: "Fast Booking" },
            { icon: <FaHeadset size={35}/>,    label: "24/7 Support" }
          ].map((item, i) => (
            <motion.div key={i} className="why-card" custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {item.icon}<h4>{item.label}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TOP HELPERS */}
      <section className="workers-section">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Top Rated Helpers</motion.h2>
        <p className="workers-subtitle">Verified professionals with great ratings — ready for quick bookings.</p>
        <div className="workers-grid">
          {[
            { name: "Rani", job: "Electrician", rating: "4.8", exp: "5 Years", img: w1 },
            { name: "Ram",  job: "Plumber",     rating: "4.6", exp: "3 Years", img: w2 },
            { name: "Sai",  job: "Driver",      rating: "4.9", exp: "7 Years", img: w3 }
          ].map((worker, i) => (
            <motion.div key={i} className="worker-card" custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="worker-img-wrapper">
                <img src={worker.img} alt={worker.name} className="worker-img" />
                <span className="verified-badge">✓ Verified</span>
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== JOIN AS PARTNER ===== */}
      <section className="partner-section">
        <motion.div className="partner-img-side" initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <img src={WORKER_IMG_URL} alt="Service Partner" onError={(e) => { e.target.src = heroImg }} />
        </motion.div>

        <motion.div className="partner-content" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2>Join the Revolution :<br />Become a Service Partner</h2>
          <p>Elevate your professional journey by joining our dynamic network of service experts. Meet new customers and show off your skills in home services.</p>
          <Link to="/register" className="register-btn">Register Now</Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>HireHelper</h3>
            <p>Connecting skilled workers with customers easily.</p>
          </div>
          <div>
            <h4>Company</h4>
            <p>About Us</p><p>Contact</p><p>Privacy Policy</p><p>Terms</p>
          </div>
          <div>
            <h4>Follow Us</h4>
            <p>Instagram</p><p>Facebook</p><p>Twitter</p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 HireHelper. All Rights Reserved.</div>
      </footer>

    </div>
  )
}

export default Home