import React from 'react';
import '../styles/faq.css';

export default function FAQ() {
  return (
    <div id="faq-root">
      <main className="faq-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1>How Umami Works</h1>
            <p className="lede">A more nuanced and data driven way to rate food.</p>
          </div>
          <div className="hero-visual">
            <div className="visual-placeholder visual-1"></div>
          </div>
        </section>

        <section className="narrative-section">
          <div className="narrative-content">
            <div className="step-narrative">
              <h3>Rate with detail</h3>
              <p>Leave granular scores across taste, ingredients, ambiance, and pricing. Add optional notes so other food lovers can make smarter decisions based on what matters to them.</p>
            </div>
            <div className="visual-right visual-2"></div>
          </div>
        </section>

        <section className="narrative-section narrative-reversed">
          <div className="narrative-content">
            <div className="visual-left visual-3"></div>
            <div className="step-narrative">
              <h3>Track trends</h3>
              <p>Each restaurant accumulates monthly and yearly trends so you can see whether it's improving or slipping. Spot patterns and discover hidden gems before they become obvious.</p>
            </div>
          </div>
        </section>

        <section className="narrative-section">
          <div className="narrative-content">
            <div className="step-narrative">
              <h3>Get recommendations</h3>
              <p>Our recommendation engine looks at your flavor profile and review history to suggest spots and dishes you'll love. Discover restaurants tailored to your taste.</p>
            </div>
            <div className="visual-right visual-4"></div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-content">
            <h2>About this project</h2>
            <p>Umami was created by Taiga Chang in September, 2025 as a full-stack development showcase. It demonstrates practical implementation of modern web technologies and frameworks.</p>
            <p>Built with React, Node.js, and MySQL, Umami represents hands-on learning applied to a real problem: making food recommendations more meaningful through nuanced, data-driven ratings.</p>
            <p>You can find Taiga Chang on <a href="https://www.linkedin.com/in/taiga-chang-388400262" target="_blank" rel="noopener noreferrer">LinkedIn</a>.</p>
          </div>
          <div className="about-visual">
            <div className="visual-placeholder visual-5"></div>
          </div>
        </section>

      </main>
    </div>
  );
}
