import React, { useState, useRef } from "react";

const Settings = () => {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", bio: "",
    emailNotif: true, pushNotif: true, smsNotif: false, language: "English",
  });
  const [photo, setPhoto] = useState(null);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [showPwModal, setShowPwModal] = useState(false);
  const [pw, setPw] = useState({ old: "", new1: "", new2: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew1, setShowNew1] = useState(false);
  const [showNew2, setShowNew2] = useState(false);
  const fileRef = useRef();

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2600);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handlePhoto = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("File must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (e) => { setPhoto(e.target.result); showToast("Photo updated"); };
    reader.readAsDataURL(file);
  };

  const saveAll = () => {
    setSaved(true);
    showToast("All changes saved successfully");
    setTimeout(() => setSaved(false), 2400);
  };

  const handlePwSave = () => {
    setPwError("");
    if (!pw.old) return setPwError("Enter your current password");
    if (pw.new1.length < 6) return setPwError("Password must be at least 6 characters");
    if (pw.new1 !== pw.new2) return setPwError("Passwords do not match");
    setPwSuccess(true);
    setTimeout(() => {
      setShowPwModal(false);
      setPw({ old: "", new1: "", new2: "" });
      setPwSuccess(false);
      setPwError("");
      showToast("Password changed successfully!");
    }, 1500);
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
    return "#22c55e";
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
    return "#22c55e";
  };

  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  const displayName = [form.firstName, form.lastName].filter(Boolean).join(" ") || "Your Name";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sw {
          font-family: 'DM Sans', sans-serif;
          background: #f0f2f5;
          min-height: 100vh;
          padding: 40px 16px 100px;
          color: #1c1f26;
        }

        .sw-inner {
          max-width: 620px;
          margin: 0 auto;
        }

        /* ── PAGE HEADER ── */
        .sw-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 12px;
        }

        .sw-title {
          font-family: 'Outfit', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #1c1f26;
          letter-spacing: -0.4px;
          line-height: 1;
        }

        .sw-subtitle {
          font-size: 13px;
          color: #8a93a8;
          margin-top: 4px;
          font-weight: 400;
        }

        .btn-save-header {
          flex-shrink: 0;
          padding: 9px 20px;
          border-radius: 10px;
          border: none;
          background: #2563eb;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.1px;
          transition: background 0.18s, transform 0.15s;
        }
        .btn-save-header:hover { background: #1d4ed8; transform: translateY(-1px); }
        .btn-save-header:active { transform: scale(0.97); }
        .btn-save-header.saved { background: #16a34a; }

        /* ── SECTION LABEL ── */
        .sw-section-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #adb5c7;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin: 20px 0 8px 4px;
        }
        .sw-section-label:first-of-type { margin-top: 0; }

        /* ── CARD ── */
        .sw-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e8eaf0;
          padding: 20px;
          margin-bottom: 8px;
        }

        /* ── AVATAR ── */
        .av-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .av-wrap {
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
        }

        .av-img {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #eef1f8;
          border: 2.5px solid #e8eaf0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .av-wrap:hover .av-img { border-color: #2563eb; }
        .av-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

        .av-badge {
          position: absolute;
          bottom: 1px; right: 1px;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #2563eb;
          border: 2px solid #fff;
          display: flex; align-items: center; justify-content: center;
        }

        .av-info { flex: 1; min-width: 0; }
        .av-name {
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1c1f26;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .av-hint { font-size: 12px; color: #adb5c7; margin-top: 2px; margin-bottom: 10px; }

        .av-btns { display: flex; gap: 8px; }

        .btn-upload {
          padding: 7px 13px;
          border-radius: 8px;
          border: 1.5px solid #dde1eb;
          background: #f7f8fb;
          color: #374151;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          transition: all 0.16s;
        }
        .btn-upload:hover { border-color: #2563eb; color: #2563eb; background: #eff4ff; }

        .btn-remove {
          padding: 7px 13px;
          border-radius: 8px;
          border: 1.5px solid #fce7e7;
          background: #fef2f2;
          color: #dc2626;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          transition: all 0.16s;
        }
        .btn-remove:hover { border-color: #dc2626; background: #fee2e2; }
        .btn-remove:disabled { opacity: 0.35; cursor: not-allowed; }

        /* ── FORM ── */
        .sw-grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
        }

        .sw-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
        .sw-field:last-child { margin-bottom: 0; }

        .sw-label {
          font-size: 11px;
          font-weight: 700;
          color: #adb5c7;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .sw-input, .sw-textarea, .sw-select {
          width: 100%;
          padding: 10px 13px;
          border-radius: 10px;
          border: 1.5px solid #e8eaf0;
          font-size: 14px;
          color: #1c1f26;
          font-family: 'DM Sans', sans-serif;
          background: #f7f8fb;
          outline: none;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
          -webkit-appearance: none;
        }
        .sw-input:focus, .sw-textarea:focus, .sw-select:focus {
          border-color: #2563eb;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
        }
        .sw-input::placeholder, .sw-textarea::placeholder { color: #c4c9d8; }

        .sw-textarea {
          min-height: 82px;
          resize: vertical;
          line-height: 1.55;
        }

        .sw-select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%23adb5c7' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 13px center;
          padding-right: 34px;
          cursor: pointer;
        }

        /* ── DIVIDER ── */
        .sw-divider { height: 1px; background: #f0f2f5; margin: 16px 0; }

        /* ── NOTIFICATION ROW ── */
        .notif-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 0;
          border-bottom: 1px solid #f3f4f8;
        }
        .notif-row:first-child { padding-top: 0; }
        .notif-row:last-of-type { border-bottom: none; padding-bottom: 0; }

        .nr-left { display: flex; align-items: center; gap: 11px; }

        .nr-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: #eff4ff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .nr-label { font-size: 14px; font-weight: 600; color: #1c1f26; line-height: 1; }
        .nr-desc { font-size: 12px; color: #adb5c7; margin-top: 3px; }

        /* ── TOGGLE ── */
        .sw-toggle { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
        .sw-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
        .sw-track {
          position: absolute; inset: 0;
          background: #dde1eb;
          border-radius: 11px;
          cursor: pointer;
          transition: background 0.22s;
        }
        .sw-track::before {
          content: '';
          position: absolute;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #fff;
          top: 3px; left: 3px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.14);
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        .sw-toggle input:checked + .sw-track { background: #2563eb; }
        .sw-toggle input:checked + .sw-track::before { transform: translateX(18px); }

        /* ── SECURITY ROW ── */
        .sec-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .sec-left { display: flex; align-items: center; gap: 12px; }

        .sec-icon-box {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: #eff4ff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .sec-title-row { display: flex; align-items: center; gap: 7px; margin-bottom: 2px; }
        .sec-name { font-size: 14px; font-weight: 600; color: #1c1f26; }
        .sec-badge {
          font-size: 10px; font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
          background: #dbeafe;
          color: #1d4ed8;
          letter-spacing: 0.3px;
        }
        .sec-meta { font-size: 12px; color: #adb5c7; }

        .btn-change-pw {
          padding: 8px 16px;
          border-radius: 9px;
          border: 1.5px solid #e8eaf0;
          background: #fff;
          color: #374151;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.16s;
        }
        .btn-change-pw:hover { border-color: #2563eb; color: #2563eb; background: #eff4ff; }

        /* ── TOAST ── */
        .sw-toast {
          position: fixed;
          bottom: 24px; left: 50%;
          transform: translateX(-50%) translateY(60px);
          background: #1c1f26;
          color: #fff;
          padding: 10px 18px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          pointer-events: none;
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.28s, transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
        }
        .sw-toast.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        /* ── MODAL ── */
        .sw-backdrop {
          position: fixed; inset: 0;
          background: rgba(28,31,38,0.45);
          backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          z-index: 9990;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
        }
        .sw-backdrop.open { opacity: 1; pointer-events: all; }

        .sw-modal {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #e8eaf0;
          padding: 24px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.12);
          transform: scale(0.96) translateY(12px);
          opacity: 0;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
        }
        .sw-backdrop.open .sw-modal { transform: none; opacity: 1; }

        .modal-head { margin-bottom: 16px; }
        .modal-title {
          font-family: 'Outfit', sans-serif;
          font-size: 18px; font-weight: 800;
          color: #1c1f26;
          letter-spacing: -0.2px;
        }
        .modal-sub { font-size: 12px; color: #adb5c7; margin-top: 3px; }

        .modal-field { margin-bottom: 12px; }
        .modal-field:last-of-type { margin-bottom: 0; }

        .pw-wrap { position: relative; }
        .pw-eye-btn {
          position: absolute;
          right: 11px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer;
          color: #c4c9d8;
          display: flex; align-items: center;
          padding: 2px;
          transition: color 0.15s;
        }
        .pw-eye-btn:hover { color: #2563eb; }

        .strength-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 7px;
        }
        .strength-bars { display: flex; gap: 3px; flex: 1; }
        .s-seg {
          flex: 1; height: 3px;
          border-radius: 2px;
          transition: background 0.25s;
        }
        .strength-txt {
          font-size: 11px;
          font-weight: 600;
          min-width: 36px;
          text-align: right;
        }

        .modal-alert {
          border-radius: 9px;
          padding: 9px 12px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 7px;
          animation: alertIn 0.2s ease;
        }
        @keyframes alertIn { from { opacity:0; transform:translateY(-3px); } to { opacity:1; transform:none; } }

        .alert-err { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .alert-ok  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

        .modal-actions { display: flex; gap: 8px; margin-top: 18px; }

        .btn-cancel {
          flex: 1; padding: 10px;
          border-radius: 10px;
          border: 1.5px solid #e8eaf0;
          background: #f7f8fb;
          font-size: 13px; font-weight: 600;
          color: #8a93a8;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-cancel:hover { background: #eef0f5; }

        .btn-confirm {
          flex: 1; padding: 10px;
          border-radius: 10px;
          border: none;
          background: #2563eb;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.1px;
          transition: background 0.18s, transform 0.15s;
        }
        .btn-confirm:hover { background: #1d4ed8; transform: translateY(-1px); }
        .btn-confirm:active { transform: scale(0.97); }

        @media (max-width: 500px) {
          .sw { padding: 24px 12px 80px; }
          .sw-grid2 { grid-template-columns: 1fr; }
          .sw-header { flex-direction: column; align-items: flex-start; gap: 10px; }
          .btn-save-header { width: 100%; }
          .sec-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="sw">
        <div className="sw-inner">

          {/* ── HEADER ── */}
          <div className="sw-header">
            <div>
              <div className="sw-title">Settings</div>
              <div className="sw-subtitle">Manage your account preferences</div>
            </div>
            <button
              className={`btn-save-header${saved ? " saved" : ""}`}
              onClick={saveAll}
            >
              {saved ? "✓ Saved!" : "Save changes"}
            </button>
          </div>

          {/* ── PROFILE ── */}
          <div className="sw-section-label">Profile</div>

          <div className="sw-card">
            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handlePhoto(e.target.files[0])}
            />
            <div className="av-row">
              <div
                className="av-wrap"
                onClick={() => fileRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handlePhoto(e.dataTransfer.files[0]); }}
              >
                <div className="av-img">
                  {photo ? (
                    <img src={photo} alt="profile" />
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c4c9d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  )}
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
                <div className="av-hint">Click photo or drag & drop to change</div>
                <div className="av-btns">
                  <button className="btn-upload" onClick={() => fileRef.current.click()}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload
                  </button>
                  <button
                    className="btn-remove"
                    disabled={!photo}
                    onClick={() => { setPhoto(null); fileRef.current.value = ""; showToast("Photo removed"); }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── PERSONAL INFO ── */}
          <div className="sw-card">
            <div className="sw-grid2">
              <div className="sw-field" style={{ marginBottom: 0 }}>
                <label className="sw-label">First name</label>
                <input
                  className="sw-input"
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="sw-field" style={{ marginBottom: 0 }}>
                <label className="sw-label">Last name</label>
                <input
                  className="sw-input"
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ height: 10 }} />

            <div className="sw-field">
              <label className="sw-label">Email address</label>
              <input
                className="sw-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="sw-field">
              <label className="sw-label">Phone number</label>
              <input
                className="sw-input"
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="sw-field">
              <label className="sw-label">Bio</label>
              <textarea
                className="sw-textarea"
                name="bio"
                placeholder="Tell others about yourself..."
                value={form.bio}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ── NOTIFICATIONS ── */}
          <div className="sw-section-label">Notifications</div>

          <div className="sw-card">
            {[
              {
                name: "emailNotif",
                label: "Email notifications",
                desc: "Updates & news via email",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
              },
              {
                name: "pushNotif",
                label: "Push notifications",
                desc: "Alerts directly on device",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                ),
              },
              {
                name: "smsNotif",
                label: "SMS notifications",
                desc: "Text messages to phone",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
              },
            ].map((n) => (
              <div className="notif-row" key={n.name}>
                <div className="nr-left">
                  <div className="nr-icon">{n.icon}</div>
                  <div>
                    <div className="nr-label">{n.label}</div>
                    <div className="nr-desc">{n.desc}</div>
                  </div>
                </div>
                <label className="sw-toggle">
                  <input
                    type="checkbox"
                    name={n.name}
                    checked={form[n.name]}
                    onChange={handleChange}
                  />
                  <span className="sw-track" />
                </label>
              </div>
            ))}

            <div className="sw-divider" />

            <div className="sw-field" style={{ marginBottom: 0 }}>
              <label className="sw-label">Language</label>
              <select
                className="sw-select"
                name="language"
                value={form.language}
                onChange={handleChange}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
              </select>
            </div>
          </div>

          {/* ── SECURITY ── */}
          <div className="sw-section-label">Security</div>

          <div className="sw-card">
            <div className="sec-row">
              <div className="sec-left">
                <div className="sec-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <div className="sec-title-row">
                    <span className="sec-name">Password</span>
                    <span className="sec-badge">Protected</span>
                  </div>
                  <div className="sec-meta">Last updated 3 months ago</div>
                </div>
              </div>
              <button className="btn-change-pw" onClick={() => setShowPwModal(true)}>
                Change password
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── TOAST ── */}
      <div className={`sw-toast${toast.show ? " show" : ""}`}>{toast.msg}</div>

      {/* ── PASSWORD MODAL ── */}
      <div
        className={`sw-backdrop${showPwModal ? " open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        <div className="sw-modal">
          <div className="modal-head">
            <div className="modal-title">Change password</div>
            <div className="modal-sub">Enter your current password, then choose a new one.</div>
          </div>

          {pwError   && <div className="modal-alert alert-err">⚠ {pwError}</div>}
          {pwSuccess && <div className="modal-alert alert-ok">✓ Password updated successfully!</div>}

          <div className="modal-field">
            <label className="sw-label">Current password</label>
            <div className="pw-wrap">
              <input
                className="sw-input"
                type={showOld ? "text" : "password"}
                placeholder="Enter current password"
                style={{ paddingRight: 40 }}
                value={pw.old}
                onChange={(e) => setPw({ ...pw, old: e.target.value })}
              />
              <button className="pw-eye-btn" onClick={() => setShowOld((p) => !p)}>
                <EyeIcon visible={showOld} />
              </button>
            </div>
          </div>

          <div className="modal-field">
            <label className="sw-label">New password</label>
            <div className="pw-wrap">
              <input
                className="sw-input"
                type={showNew1 ? "text" : "password"}
                placeholder="Minimum 6 characters"
                style={{ paddingRight: 40 }}
                value={pw.new1}
                onChange={(e) => setPw({ ...pw, new1: e.target.value })}
              />
              <button className="pw-eye-btn" onClick={() => setShowNew1((p) => !p)}>
                <EyeIcon visible={showNew1} />
              </button>
            </div>
            {pw.new1.length > 0 && (
              <div className="strength-row">
                <div className="strength-bars">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="s-seg"
                      style={{ background: getStrengthColor(pw.new1.length, i) }}
                    />
                  ))}
                </div>
                <span className="strength-txt" style={{ color: strengthLabelColor(pw.new1.length) }}>
                  {strengthLabel(pw.new1.length)}
                </span>
              </div>
            )}
          </div>

          <div className="modal-field">
            <label className="sw-label">Confirm new password</label>
            <div className="pw-wrap">
              <input
                className="sw-input"
                type={showNew2 ? "text" : "password"}
                placeholder="Re-enter new password"
                style={{ paddingRight: 40 }}
                value={pw.new2}
                onChange={(e) => setPw({ ...pw, new2: e.target.value })}
              />
              <button className="pw-eye-btn" onClick={() => setShowNew2((p) => !p)}>
                <EyeIcon visible={showNew2} />
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
            <button className="btn-confirm" onClick={handlePwSave}>Update password</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;