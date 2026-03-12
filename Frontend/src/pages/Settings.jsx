import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Settings = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    emailNotif: true,
    pushNotif: true,
    smsNotif: false,
    language: "English",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    alert("Preferences Saved Successfully ✅");
  };

  const handleLogout = () => {
    alert("Logged Out 🚪");
  };

  return (
    <div className="settings-container">

      <h1>Settings</h1>
      <p className="settings-subtitle">
        Manage your account preferences and notifications
      </p>

      {/* PROFILE */}
      <div className="settings-card">
        <h2>Profile Picture</h2>

        <div className="profile-section">
          <div className="profile-img">
            <FaUserCircle />
          </div>

          <div>
            <input type="file" className="file-input" />
            <p className="file-note">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>

      {/* PERSONAL INFO */}
      <div className="settings-card">
        <h2>Personal Information</h2>

        <div className="settings-grid">
          <input
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            value={form.firstName}
            onChange={handleChange}
            className="settings-input"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={form.lastName}
            onChange={handleChange}
            className="settings-input"
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="settings-input"
        />

        <input
          type="tel"
          name="phone"
          placeholder="+91 00000 00000"
          value={form.phone}
          onChange={handleChange}
          className="settings-input"
        />

        <textarea
          name="bio"
          placeholder="Tell others about yourself..."
          value={form.bio}
          onChange={handleChange}
          className="settings-textarea"
        />
      </div>

      {/* PREFERENCES */}
      <div className="settings-card">
        <h2>Preferences</h2>

        <div className="preference-item">
          <label>
            <input
              type="checkbox"
              name="emailNotif"
              checked={form.emailNotif}
              onChange={handleChange}
            />
            Email Notifications
          </label>
        </div>

        <div className="preference-item">
          <label>
            <input
              type="checkbox"
              name="pushNotif"
              checked={form.pushNotif}
              onChange={handleChange}
            />
            Push Notifications
          </label>
        </div>

        <div className="preference-item">
          <label>
            <input
              type="checkbox"
              name="smsNotif"
              checked={form.smsNotif}
              onChange={handleChange}
            />
            SMS Notifications
          </label>
        </div>

        <select
          name="language"
          value={form.language}
          onChange={handleChange}
          className="settings-select"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Marathi</option>
        </select>

        <button onClick={handleSave} className="settings-btn">
          Save Preferences
        </button>
      </div>

      {/* SECURITY */}
      <div className="settings-card">
        <h2>Account Security</h2>
        <p>Password • Last updated 3 months ago</p>
        <br />
        <button className="settings-btn">
          Change Password
        </button>
      </div>

      {/* LOGOUT */}
      <div className="settings-card">
        <h2>Log out</h2>
        <p>Sign out from this device anytime.</p>
        <br />
        <button
          onClick={handleLogout}
          className="settings-btn logout-btn"
        >
          Log out
        </button>
      </div>

    </div>
  );
};

export default Settings;