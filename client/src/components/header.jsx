import React, { useState, useContext, useRef, useEffect } from "react";
import "../styles/header.css";
import { AuthContext } from './auth-check.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const [q, setQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const debounceTimer = useRef(null);
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const location = useLocation();

  // Debounced search function
  const handleSearchInput = (value) => {
    setQ(value);
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only search if value is not empty
    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Set new timer with 400ms delay
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 400);
  };

  const performSearch = async (searchTerm) => {
    try {
      const res = await fetch(`/api/restaurants?partial_restaurant=${encodeURIComponent(searchTerm)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.restaurants || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleResultClick = (restaurantId) => {
    window.location.href = `/restaurant/${restaurantId}`;
  };

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
        <a href="/faq">About</a>
        
        <form className="search-form" onSubmit={handleSubmit} role="search">
          <div className="search-input-wrapper">
            <input
              aria-label="Search restaurants or dishes"
              placeholder="Search restaurants or dishes"
              value={q}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => q.trim() && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((restaurant) => (
                <div 
                  key={restaurant.id} 
                  className="search-result-item"
                  onClick={() => handleResultClick(restaurant.id)}
                >
                  <div className="result-name">{restaurant.name}</div>
                  <div className="result-cuisine">{restaurant.cuisine}</div>
                  <div className="result-address">{restaurant.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit"></button>
        </form>
      </nav>

      <div className="auth-buttons">
        {user ? (
          <div className="signed-in">
            <span>Signed in as {user.email}</span>
          </div>
        ) : (
          <>
            <button 
              onClick={() => navigate('/auth?mode=login', { state: { previousPath: location.pathname } })}
              className="login-btn"
            >
              Log in
            </button>
            <span className="divider">/</span>
            <button 
              onClick={() => navigate('/auth?mode=signup', { state: { previousPath: location.pathname } })}
              className="signup-btn"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
