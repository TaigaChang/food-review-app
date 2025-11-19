import React, { useState } from "react";
import "../styles/header.css";

export default function Header() {
  const [q, setQ] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = (q || "").trim();
    if (!trimmed) return;
    window.location.href = `/search?q=${encodeURIComponent(trimmed)}`;
  };

  return (
    <header>
      <div className="logo-section">
        <a href="/" className="logo">Umami</a>
      </div>
      <nav>
        <a href="#restaurants">Restaurants</a>
        <a href="/faq">FAQ</a>
      </nav>

      <form className="search-form" onSubmit={handleSubmit} role="search">
        <input
          aria-label="Search restaurants or dishes"
          placeholder="Search restaurants or dishes"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="auth-buttons">
  <a href="/auth?mode=login" className="login-btn">Log In</a>
  <a href="/auth?mode=signup" className="signup-btn">Sign Up</a>
      </div>
    </header>
  );
}
