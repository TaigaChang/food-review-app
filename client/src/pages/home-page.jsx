import React from "react";
import "../styles/home-page.css";
import homepageImage from "../assets/homepage.jpg";

export default function Homepage() {

  return (
    <div id="homepage-root">
      <section className="hero" style={{ backgroundImage: `url(${homepageImage})` }}>
        <h1>Discover, Rate &amp; Track Restaurants</h1>
        <p>Rate taste, ingredients, ambiance &amp; pricing on a nuanced level. Rather than riding on cocktails, watch how restaurants evolve over time.</p>
        <div className="cta-buttons">
          <a href="/auth" className="cta-btn cta-primary">Start Exploring</a>
          <a href="/faq" className="cta-btn cta-secondary">Learn More</a>
        </div>
      </section>
      <footer id="about">
        &copy; 2025 Umami &mdash; Food Review App by Taiga Chang
      </footer>
    </div>
  );
}
