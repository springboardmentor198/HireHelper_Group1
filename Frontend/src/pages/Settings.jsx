import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // ✅ ADDED AXIOS

const Settings = () => {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", bio: "",
  });
  const [photo, setPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ ADDED: To hold the actual file for the backend
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "default" });
  const [showPwModal, setShowPwModal] = useState(false);
  const [pw, setPw] = useState({ old: "", new1: "", new2: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew1, setShowNew1] = useState(false);
  const [showNew2, setShowNew2] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  // ✅ ADDED: Fetch user profile data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const user = res.data;
        // Split the single "name" string from DB into first and last name for the UI
        const nameParts = user.name ? user.name.split(" ") : ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setForm(prev => ({
          ...prev,
          firstName,
          lastName,
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || ""
        }));

        if (user.profilePicture) {
          setPhoto(`http://localhost:5000${user.profilePicture}`);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        showToast("Failed to load profile data", "error");
      }
    };
    fetchProfile();
  }, []);

  const showToast = (msg, type = "default") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "default" }), 2600);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhoto = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Please select an image file", "error"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("File must be under 5MB", "error"); return; }
    
    setSelectedFile(file); // ✅ ADDED: Save the file to send to backend later

    const reader = new FileReader();
    reader.onload = (e) => { setPhoto(e.target.result); showToast("Photo updated ✓", "success"); };
    reader.readAsDataURL(file);
  };

  // ✅ ADDED: Connect to the PUT /me route
  const saveAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      // Combine first and last name for the backend
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      formData.append("name", fullName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("bio", form.bio);
      // If they uploaded a new photo, append it
      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      await axios.put("http://localhost:5000/api/users/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" // Required for sending files
        }
      });

      setSaved(true);
      showToast("All changes saved successfully ✓", "success");
      setTimeout(() => setSaved(false), 2400);
    } catch (err) {
      console.error("Error saving profile:", err);
      showToast("Failed to save changes", "error");
    }
  };

  const handlePwSave = async () => {
    setPwError("");
    if (!pw.old) return setPwError("Enter your current password");
    if (pw.new1.length < 6) return setPwError("Password must be at least 6 characters");
    if (pw.new1 !== pw.new2) return setPwError("Passwords do not match");

    try {
      const token = localStorage.getItem("token");
      
      // Send the password change request to the backend
      await axios.put("http://localhost:5000/api/users/change-password", {
        oldPassword: pw.old,
        newPassword: pw.new1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // If successful, show the success UI
      setPwSuccess(true);
      setTimeout(() => {
        setShowPwModal(false);
        setPw({ old: "", new1: "", new2: "" });
        setPwSuccess(false);
        setPwError("");
        showToast("Password changed successfully!", "success");
      }, 1500);

    } catch (err) {
      // If the backend says the old password was wrong, show that error!
      console.error("Error changing password:", err);
      setPwError(err.response?.data?.msg || "Failed to change password");
    }
  };

  const closeModal = () => {
    setShowPwModal(false);
    setPwError("");
    setPwSuccess(false);
    setPw({ old: "", new1: "", new2: "" });
  };

  const getStrengthColor = (len, i) => {
    if (len < (i + 1) * 2) return "#e5e7eb";
    if (len < 4) return "#ef4444";
    if (len < 7) return "#f59e0b";
    return "#10b981";
  };

  const strengthLabel = (len) => {
    if (len === 0) return "";
    if (len < 4) return "Weak";
    if (len < 7) return "Fair";
    if (len < 10) return "Good";
    return "Strong";
  };

  const strengthLabelColor = (len) => {
    if (len < 4) return "#ef4444";
    if (len < 7) return "#f59e0b";
    return "#10b981";
  };

  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  const displayName = [form.firstName, form.lastName].filter(Boolean).join(" ") || "Your Name";

  const initials = [form.firstName?.[0], form.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(20px) scale(0.95); } to { opacity:1; transform:translateX(-50%) translateY(0) scale(1); } }
        @keyframes alertIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(14px); } to { opacity:1; transform:none; } }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }

        .sw {
          font-family: 'Manrope', sans-serif;
          background: #f1f5f9;
          min-height: 100vh;
          padding: 14px 12px 40px;
          color: #0f172a;
        }

        /* HEADER */
        .sw-header {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 14px; gap: 10px;
        }
        .sw-title {
          font-family: 'Sora', sans-serif;
          font-size: 22px; font-weight: 800;
          color: #0f172a; letter-spacing: -0.5px;
        }
        .sw-subtitle { font-size: 12px; color: #94a3b8; margin-top: 2px; font-weight: 500; }

        .btn-save-header {
          flex-shrink: 0; padding: 8px 18px;
          border-radius: 10px; border: none;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; font-family: 'Sora', sans-serif;
          font-size: 12.5px; font-weight: 700; cursor: pointer;
          box-shadow: 0 3px 12px rgba(99,102,241,0.35);
          transition: all 0.18s;
        }
        .btn-save-header:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.45); }
        .btn-save-header:active { transform: scale(0.96); }
        .btn-save-header.saved { background: linear-gradient(135deg,#10b981,#059669); box-shadow: 0 3px 12px rgba(16,185,129,0.35); animation: pulse 0.4s ease; }

        /* SECTION LABEL */
        .sw-section-label {
          font-family: 'Sora', sans-serif;
          font-size: 10px; font-weight: 800;
          color: #94a3b8; text-transform: uppercase;
          letter-spacing: 1.2px; margin: 14px 0 7px 2px;
          display: flex; align-items: center; gap: 6px;
        }
        .sw-section-label::after {
          content: ''; flex: 1; height: 1px; background: #e2e8f0;
        }

        /* CARD */
        .sw-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #e8edf5;
          padding: 16px; margin-bottom: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          animation: slideUp 0.3s ease both;
        }

        /* AVATAR */
        .av-row { display: flex; align-items: center; gap: 14px; }

        .av-wrap {
          position: relative; cursor: pointer; flex-shrink: 0;
          transition: transform 0.2s;
        }
        .av-wrap:hover { transform: scale(1.04); }

        .av-img {
          width: 68px; height: 68px; border-radius: 18px;
          background: linear-gradient(135deg, #e0e7ff, #ede9fe);
          border: 2.5px solid #c7d2fe;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; transition: border-color 0.2s;
          font-family: 'Sora', sans-serif;
          font-size: 20px; font-weight: 800; color: #6366f1;
        }
        .av-wrap:hover .av-img { border-color: #6366f1; }
        .av-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 16px; }

        .av-badge {
          position: absolute; bottom: -3px; right: -3px;
          width: 22px; height: 22px; border-radius: 8px;
          background: linear-gradient(135deg,#6366f1,#4f46e5);
          border: 2.5px solid #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(99,102,241,0.4);
        }

        .av-info { flex: 1; min-width: 0; }
        .av-name {
          font-family: 'Sora', sans-serif;
          font-size: 15px; font-weight: 700; color: #0f172a;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .av-hint { font-size: 11.5px; color: #94a3b8; margin-top: 2px; margin-bottom: 10px; }
        .av-btns { display: flex; gap: 7px; }

        .btn-upload {
          padding: 6px 12px; border-radius: 8px;
          border: 1.5px solid #e0e7ff;
          background: #f5f3ff; color: #6366f1;
          font-size: 11.5px; font-weight: 700;
          font-family: 'Manrope', sans-serif;
          cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
          transition: all 0.16s;
        }
        .btn-upload:hover { border-color: #6366f1; background: #ede9fe; }

        .btn-remove {
          padding: 6px 12px; border-radius: 8px;
          border: 1.5px solid #fce7e7; background: #fef2f2; color: #ef4444;
          font-size: 11.5px; font-weight: 700;
          font-family: 'Manrope', sans-serif;
          cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
          transition: all 0.16s;
        }
        .btn-remove:hover { border-color: #ef4444; background: #fee2e2; }
        .btn-remove:disabled { opacity: 0.35; cursor: not-allowed; }

        /* DROP ZONE */
        .drop-zone {
          border: 2px dashed #c7d2fe; border-radius: 10px;
          padding: 10px; text-align: center;
          cursor: pointer; transition: all 0.2s;
          background: #f5f3ff; margin-top: 10px;
          font-size: 11.5px; color: #6366f1; font-weight: 600;
        }
        .drop-zone.dragging { border-color: #6366f1; background: #ede9fe; }
        .drop-zone:hover { border-color: #6366f1; background: #ede9fe; }

        /* FORM */
        .sw-grid2 {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-bottom: 10px;
        }

        .sw-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
        .sw-field:last-child { margin-bottom: 0; }

        .sw-label {
          font-size: 10.5px; font-weight: 800; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.8px;
          display: flex; align-items: center; gap: 5px;
        }
        .sw-label-dot { width: 4px; height: 4px; border-radius: 50%; background: #6366f1; }

        .sw-input, .sw-textarea {
          width: 100%; padding: 9px 12px;
          border-radius: 10px; border: 1.5px solid #e8edf5;
          font-size: 13.5px; color: #0f172a;
          font-family: 'Manrope', sans-serif;
          background: #fafbfc; outline: none;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
        }
        .sw-input:focus, .sw-textarea:focus {
          border-color: #6366f1; background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .sw-input::placeholder, .sw-textarea::placeholder { color: #cbd5e1; }

        .sw-textarea { min-height: 76px; resize: vertical; line-height: 1.55; }

        /* CHAR COUNT */
        .char-count { font-size: 10.5px; color: #94a3b8; text-align: right; margin-top: 3px; }

        /* SECURITY */
        .sec-row {
          display: flex; align-items: center;
          justify-content: space-between; gap: 12px; flex-wrap: wrap;
        }
        .sec-left { display: flex; align-items: center; gap: 12px; }
        .sec-icon-box {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, #ede9fe, #e0e7ff);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sec-title-row { display: flex; align-items: center; gap: 7px; margin-bottom: 2px; }
        .sec-name { font-size: 14px; font-weight: 700; color: #0f172a; font-family: 'Sora', sans-serif; }
        .sec-badge {
          font-size: 10px; font-weight: 800;
          padding: 2px 9px; border-radius: 20px;
          background: #dcfce7; color: #15803d; letter-spacing: 0.3px;
        }
        .sec-meta { font-size: 11.5px; color: #94a3b8; font-weight: 500; }

        .btn-change-pw {
          padding: 8px 16px; border-radius: 9px;
          border: 1.5px solid #e0e7ff; background: #f5f3ff;
          color: #6366f1; font-size: 12px; font-weight: 700;
          font-family: 'Manrope', sans-serif; cursor: pointer;
          white-space: nowrap; transition: all 0.16s;
        }
        .btn-change-pw:hover { border-color: #6366f1; background: #ede9fe; }

        /* DANGER ZONE */
        .danger-row {
          display: flex; align-items: center;
          justify-content: space-between; gap: 10px;
        }
        .danger-label { font-size: 13.5px; font-weight: 700; color: #0f172a; font-family: 'Sora', sans-serif; margin-bottom: 2px; }
        .danger-desc { font-size: 11.5px; color: #94a3b8; }
        .btn-danger {
          padding: 7px 14px; border-radius: 9px;
          border: 1.5px solid #fecaca; background: #fef2f2;
          color: #ef4444; font-size: 12px; font-weight: 700;
          font-family: 'Manrope', sans-serif; cursor: pointer;
          white-space: nowrap; transition: all 0.16s; flex-shrink: 0;
        }
        .btn-danger:hover { border-color: #ef4444; background: #fee2e2; }

        /* TOAST */
        .sw-toast {
          position: fixed; bottom: 20px; left: 50%;
          transform: translateX(-50%) translateY(60px);
          padding: 10px 18px; border-radius: 30px;
          font-size: 13px; font-weight: 700;
          font-family: 'Manrope', sans-serif;
          white-space: nowrap; pointer-events: none; z-index: 9999;
          opacity: 0; transition: opacity 0.25s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 6px 24px rgba(0,0,0,0.15);
          display: flex; align-items: center; gap: 8px;
        }
        .sw-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        .sw-toast.default { background: #0f172a; color: white; }
        .sw-toast.success { background: linear-gradient(135deg,#10b981,#059669); color: white; }
        .sw-toast.error { background: linear-gradient(135deg,#ef4444,#dc2626); color: white; }

        /* MODAL */
        .sw-backdrop {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.5); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px; z-index: 9990;
          opacity: 0; pointer-events: none; transition: opacity 0.2s;
        }
        .sw-backdrop.open { opacity: 1; pointer-events: all; }

        .sw-modal {
          background: #fff; border-radius: 20px;
          border: 1.5px solid #e8edf5;
          padding: 22px; width: 100%; max-width: 380px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.15);
          opacity: 0; transform: scale(0.95) translateY(14px);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
        }
        .sw-backdrop.open .sw-modal { opacity: 1; transform: none; }

        .modal-head { margin-bottom: 16px; }
        .modal-title { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px; }
        .modal-sub { font-size: 12px; color: #94a3b8; margin-top: 3px; }

        .modal-field { margin-bottom: 11px; }
        .modal-field:last-of-type { margin-bottom: 0; }

        .pw-wrap { position: relative; }
        .pw-eye-btn {
          position: absolute; right: 11px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #cbd5e1; display: flex; align-items: center;
          padding: 2px; transition: color 0.15s;
        }
        .pw-eye-btn:hover { color: #6366f1; }

        .strength-row { display: flex; align-items: center; gap: 6px; margin-top: 7px; }
        .strength-bars { display: flex; gap: 3px; flex: 1; }
        .s-seg { flex: 1; height: 3px; border-radius: 2px; transition: background 0.25s; }
        .strength-txt { font-size: 11px; font-weight: 700; min-width: 36px; text-align: right; }

        .modal-alert {
          border-radius: 9px; padding: 9px 12px;
          font-size: 12px; font-weight: 700; margin-bottom: 12px;
          display: flex; align-items: center; gap: 7px;
          animation: alertIn 0.2s ease;
        }
        .alert-err { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .alert-ok  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

        .modal-actions { display: flex; gap: 8px; margin-top: 18px; }

        .btn-cancel {
          flex: 1; padding: 10px; border-radius: 10px;
          border: 1.5px solid #e8edf5; background: #f8fafc;
          font-size: 13px; font-weight: 700; color: #94a3b8;
          font-family: 'Manrope', sans-serif; cursor: pointer; transition: background 0.15s;
        }
        .btn-cancel:hover { background: #f1f5f9; }

        .btn-confirm {
          flex: 1; padding: 10px; border-radius: 10px; border: none;
          background: linear-gradient(135deg,#6366f1,#4f46e5); color: #fff;
          font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.18s;
          box-shadow: 0 3px 12px rgba(99,102,241,0.35);
        }
        .btn-confirm:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.45); }
        .btn-confirm:active { transform: scale(0.97); }

        @media (max-width: 480px) {
          .sw-grid2 { grid-template-columns: 1fr; }
          .sec-row { flex-direction: column; align-items: flex-start; }
          .danger-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="sw">

        {/* HEADER */}
        <div className="sw-header">
          <div>
            <div className="sw-title">Settings</div>
            <div className="sw-subtitle">Manage your profile & security</div>
          </div>
          <button className={`btn-save-header${saved ? " saved" : ""}`} onClick={saveAll}>
            {saved ? "✓ Saved!" : "Save changes"}
          </button>
        </div>

        {/* ── PROFILE PHOTO ── */}
        <div className="sw-section-label">Profile Photo</div>
        <div className="sw-card">
          <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }}
            onChange={(e) => handlePhoto(e.target.files[0])} />

          <div className="av-row">
            <div className="av-wrap" onClick={() => fileRef.current.click()}>
              <div className="av-img">
                {photo ? <img src={photo} alt="profile" /> : initials}
              </div>
              <div className="av-badge">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
            </div>

            <div className="av-info">
              <div className="av-name">{displayName}</div>
              <div className="av-hint">Click or drag & drop to change photo</div>
              <div className="av-btns">
                <button className="btn-upload" onClick={() => fileRef.current.click()}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload
                </button>
                <button className="btn-remove" disabled={!photo}
                  onClick={() => { setPhoto(null); setSelectedFile(null); fileRef.current.value = ""; showToast("Photo removed", "default"); }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Drag drop zone */}
          <div
            className={`drop-zone${dragging ? " dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handlePhoto(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current.click()}
          >
            {dragging ? "Drop it here! 🎯" : "📎 Or drag & drop your photo here"}
          </div>
        </div>

        {/* ── PERSONAL INFO ── */}
        <div className="sw-section-label">Personal Info</div>
        <div className="sw-card">
          <div className="sw-grid2">
            <div className="sw-field" style={{ marginBottom: 0 }}>
              <label className="sw-label"><span className="sw-label-dot" />First Name</label>
              <input className="sw-input" type="text" name="firstName"
                placeholder="First name" value={form.firstName} onChange={handleChange} />
            </div>
            <div className="sw-field" style={{ marginBottom: 0 }}>
              <label className="sw-label"><span className="sw-label-dot" />Last Name</label>
              <input className="sw-input" type="text" name="lastName"
                placeholder="Last name" value={form.lastName} onChange={handleChange} />
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div className="sw-field">
            <label className="sw-label"><span className="sw-label-dot" />Email Address</label>
            <input className="sw-input" type="email" name="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>

          <div className="sw-field">
            <label className="sw-label"><span className="sw-label-dot" />Phone Number</label>
            <input className="sw-input" type="tel" name="phone"
              placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
          </div>

          <div className="sw-field">
            <label className="sw-label"><span className="sw-label-dot" />Bio</label>
            <textarea className="sw-textarea" name="bio" maxLength={200}
              placeholder="Tell others about yourself..." value={form.bio} onChange={handleChange} />
            <div className="char-count">{form.bio.length}/200</div>
          </div>
        </div>

        {/* ── SECURITY ── */}
        <div className="sw-section-label">Security</div>
        <div className="sw-card">
          <div className="sec-row">
            <div className="sec-left">
              <div className="sec-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <div className="sec-title-row">
                  <span className="sec-name">Password</span>
                  <span className="sec-badge">● Protected</span>
                </div>
                <div className="sec-meta">Last updated 3 months ago</div>
              </div>
            </div>
            <button className="btn-change-pw" onClick={() => setShowPwModal(true)}>
              Change password
            </button>
          </div>
        </div>

        {/* ── DANGER ZONE ── */}
        <div className="sw-section-label">Danger Zone</div>
        <div className="sw-card" style={{ borderColor: "#fecaca" }}>
          <div className="danger-row">
            <div>
              <div className="danger-label">Delete Account</div>
              <div className="danger-desc">Permanently remove your account and all data</div>
            </div>
            <button className="btn-danger"
              onClick={() => window.confirm("Are you sure? This cannot be undone.") && showToast("Account deletion requested", "error")}>
              Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* TOAST */}
      <div className={`sw-toast ${toast.type}${toast.show ? " show" : ""}`}>{toast.msg}</div>

      {/* PASSWORD MODAL */}
      <div className={`sw-backdrop${showPwModal ? " open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && closeModal()}>
        <div className="sw-modal">
          <div className="modal-head">
            <div className="modal-title">Change Password</div>
            <div className="modal-sub">Enter current password, then set a new one.</div>
          </div>

          {pwError   && <div className="modal-alert alert-err">⚠ {pwError}</div>}
          {pwSuccess && <div className="modal-alert alert-ok">✓ Password updated successfully!</div>}

          <div className="modal-field">
            <label className="sw-label"><span className="sw-label-dot" />Current Password</label>
            <div className="pw-wrap">
              <input className="sw-input" type={showOld ? "text" : "password"}
                placeholder="Enter current password" style={{ paddingRight: 38 }}
                value={pw.old} onChange={(e) => setPw({ ...pw, old: e.target.value })} />
              <button className="pw-eye-btn" onClick={() => setShowOld(p => !p)}>
                <EyeIcon visible={showOld} />
              </button>
            </div>
          </div>

          <div className="modal-field">
            <label className="sw-label"><span className="sw-label-dot" />New Password</label>
            <div className="pw-wrap">
              <input className="sw-input" type={showNew1 ? "text" : "password"}
                placeholder="Minimum 6 characters" style={{ paddingRight: 38 }}
                value={pw.new1} onChange={(e) => setPw({ ...pw, new1: e.target.value })} />
              <button className="pw-eye-btn" onClick={() => setShowNew1(p => !p)}>
                <EyeIcon visible={showNew1} />
              </button>
            </div>
            {pw.new1.length > 0 && (
              <div className="strength-row">
                <div className="strength-bars">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="s-seg" style={{ background: getStrengthColor(pw.new1.length, i) }} />
                  ))}
                </div>
                <span className="strength-txt" style={{ color: strengthLabelColor(pw.new1.length) }}>
                  {strengthLabel(pw.new1.length)}
                </span>
              </div>
            )}
          </div>

          <div className="modal-field">
            <label className="sw-label"><span className="sw-label-dot" />Confirm New Password</label>
            <div className="pw-wrap">
              <input className="sw-input" type={showNew2 ? "text" : "password"}
                placeholder="Re-enter new password" style={{ paddingRight: 38 }}
                value={pw.new2} onChange={(e) => setPw({ ...pw, new2: e.target.value })} />
              <button className="pw-eye-btn" onClick={() => setShowNew2(p => !p)}>
                <EyeIcon visible={showNew2} />
              </button>
            </div>
            {pw.new2.length > 0 && pw.new1 !== pw.new2 && (
              <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 600 }}>
                ⚠ Passwords do not match
              </div>
            )}
            {pw.new2.length > 0 && pw.new1 === pw.new2 && pw.new2.length >= 6 && (
              <div style={{ fontSize: 11, color: "#10b981", marginTop: 4, fontWeight: 600 }}>
                ✓ Passwords match
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
            <button className="btn-confirm" onClick={handlePwSave}>Update Password</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;