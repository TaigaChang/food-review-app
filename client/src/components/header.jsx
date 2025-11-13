import React from "react";
import "../styles/header.css";

export default function Header() {
  return (
    <header>
      <div className="logo-section">
        <a href="/" className="logo">Umami</a>
      </div>
      <nav>
        <a href="#restaurants">Restaurants</a>
        <a href="#about">How it Works</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div className="auth-buttons">
        <a href="/auth.html" className="login-btn">Log In</a>
        <a href="/auth.html" className="signup-btn">Sign Up</a>
      </div>
    </header>
  );
}
