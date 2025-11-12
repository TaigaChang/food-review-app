import React from "react";
import "../styles/home-page.css";

export default function Homepage() {

  return (
    <div id="homepage-root">
      <section className="hero">
        <h1>Discover, Rate &amp; Track Restaurants</h1>
        <p>Rate taste, ingredients, ambiance &amp; pricing on a 100-point scale. Get personalized recommendations and watch how restaurants evolve over time.</p>
        <div className="cta-buttons">
          <a href="/auth.html" className="cta-btn cta-primary">Start Exploring</a>
          <a href="#about" className="cta-btn cta-secondary">Learn More</a>
        </div>
      </section>
      <section className="features">
        <div className="feature">
          <h3>🎯 Detailed Ratings</h3>
          <p>Go beyond stars. Score taste, ingredients, ambiance, and pricing on a 100-point scale for every review. Get a complete picture of your dining experience.</p>
        </div>
        <div className="feature">
          <h3>📈 Trends Over Time</h3>
          <p>See how restaurants improve or decline with monthly and yearly trend analysis. Track quality changes and find restaurants at their peak.</p>
        </div>
        <div className="feature">
          <h3>✨ Smart Recommendations</h3>
          <p>Find similar restaurants and dishes based on your unique flavor profile and review history. Discover your next favorite spot.</p>
        </div>
      </section>
      <footer id="about">
        &copy; 2025 Umami &mdash; Food Review App by Taiga Chang
      </footer>
    </div>
  );
}
