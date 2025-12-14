import React, { useState, useContext } from "react";
import "../styles/header.css";
import { AuthContext } from './auth-check.jsx';

export default function Header() {
  const [q, setQ] = useState("");
  const { user } = useContext(AuthContext) || {};

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
        <a href="/restaurant">Restaurants</a>
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
        {user ? (
          <div className="signed-in">
            <span>Signed in as {user.email}</span>
          </div>
        ) : (
          <>
            <a href="/auth?mode=login" className="login-btn">Log In</a>
            <a href="/auth?mode=signup" className="signup-btn">Sign Up</a>
          </>
        )}
      </div>
    </header>
  );
}
