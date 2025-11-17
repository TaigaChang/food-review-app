import "../styles/header.css";

export default function Header() {
  return (
    <header>
      <div className="logo-section">
        <a href="/" className="logo">Umami</a>
      </div>
          <nav>
            <a href="#restaurants">Restaurants</a>
            <a href="/faq">FAQ</a>
          </nav>
      <div className="auth-buttons">
        <a href="/auth" className="login-btn">Log In</a>
        <a href="/auth" className="signup-btn">Sign Up</a>
      </div>
    </header>
  );
}
