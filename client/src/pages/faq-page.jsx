import React from 'react';
import '../styles/faq.css';

export default function FAQ() {
  return (
    <div id="faq-root">
      <main className="faq-main">
        <h1>How Umami Works — FAQs</h1>
        <p className="lede">Fast, focused reviews and clear guidance — score taste, ingredients, ambiance, and price on a 100-point scale.</p>

        <section className="steps">
          <div className="step">
            <h3>1. Rate with detail</h3>
            <p>Leave granular scores (taste, ingredients, ambiance, pricing) and optional notes so other food lovers can make smarter decisions.</p>
          </div>
          <div className="step">
            <h3>2. Track trends</h3>
            <p>Each restaurant accumulates monthly and yearly trends so you can see whether it’s improving or slipping.</p>
          </div>
          <div className="step">
            <h3>3. Get recommendations</h3>
            <p>Our recommendation engine looks at your flavor profile and review history to suggest spots and dishes you’ll love.</p>
          </div>
        </section>

        <section className="qa">
          <h2>Frequently Asked Questions</h2>
          <details>
            <summary>Who created this?</summary>
            <p>This was created by Taiga Chang in September, 2025.</p>
          </details>

          <details>
            <summary>What is the purpose of this project?</summary>
            <p>Taiga Chang is trying to demonstrate his full-stack development skills while learning new frameworks. 
              Having never worked with MySQL or React, he is trying to put his newly learned skills into practice.</p>
          </details>

          <details>
            <summary>Where can I find Taiga Chang?</summary>
            <p>You can find him at www.linkedin.com/in/taiga-chang-388400262.</p>
          </details>
        </section>

      </main>
    </div>
  );
}
