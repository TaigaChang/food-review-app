import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/restaurant-detail-page.css';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [allTimeAvg, setAllTimeAvg] = useState(null);
  const [monthlyAvg, setMonthlyAvg] = useState(null);
  const [yearlyAvg, setYearlyAvg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurant details
        const restaurantRes = await fetch(`/api/restaurants/${id}`, {
          credentials: 'include',
        });
        
        if (!restaurantRes.ok) {
          throw new Error('Restaurant not found');
        }

        const restaurantData = await restaurantRes.json();
        const restaurant = restaurantData.restaurant;
        setRestaurant(restaurant);

        // Fetch all reviews for all-time average
        const allReviewsRes = await fetch(`/api/reviews/restaurant?restaurant_id=${id}`, {
          credentials: 'include',
        });
        if (allReviewsRes.ok) {
          const allReviewsData = await allReviewsRes.json();
          const reviewsWithUsers = allReviewsData.reviews || [];
          
          // Fetch user info for each review
          const reviewsWithUserInfo = await Promise.all(
            reviewsWithUsers.map(async (review) => {
              try {
                const userRes = await fetch(`/api/auth/user/${review.user_id}`, {
                  credentials: 'include',
                });
                if (userRes.ok) {
                  const userData = await userRes.json();
                  return { ...review, user: userData.user };
                }
              } catch (e) {
                console.error(`Failed to fetch user ${review.user_id}:`, e);
              }
              return review;
            })
          );
          
          setReviews(reviewsWithUserInfo);
          setAllTimeAvg(allReviewsData.averages);
        }

        // Fetch reviews from last 30 days for monthly average
        const now = new Date();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const monthRes = await fetch(`/api/reviews/restaurant?restaurant_id=${id}&created_after=${monthAgo}`, {
          credentials: 'include',
        });
        if (monthRes.ok) {
          const monthData = await monthRes.json();
          setMonthlyAvg(monthData.averages);
        }

        // Fetch reviews from last 365 days for yearly average
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const yearRes = await fetch(`/api/reviews/restaurant?restaurant_id=${id}&created_after=${yearAgo}`, {
          credentials: 'include',
        });
        if (yearRes.ok) {
          const yearData = await yearRes.json();
          setYearlyAvg(yearData.averages);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const calculateOverallAverage = (avg) => {
    if (!avg) return null;
    const values = [
      Number(avg.avg_taste), 
      Number(avg.avg_ingredients), 
      Number(avg.avg_ambiance), 
      Number(avg.avg_pricing)
    ];
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  if (loading) {
    return <div className="restaurant-detail-container"><div className="loading">Loading...</div></div>;
  }

  if (!restaurant) {
    return (
      <div className="restaurant-detail-container">
        <div className="error">Restaurant not found (ID: {id})</div>
        <button onClick={() => navigate('/restaurant')} className="back-btn">Back to Restaurants</button>
      </div>
    );
  }

  return (
    <div className="restaurant-detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>

      {/* Header */}
      <div className="detail-header">
        <div className="header-content">
          <h1>{restaurant.name}</h1>
          <p className="cuisine-type">{restaurant.cuisine}</p>
          {restaurant.image_url && <img src={restaurant.image_url} alt={restaurant.name} className="restaurant-image" />}
        </div>
      </div>

      {/* Scores Overview */}
      <div className="scores-overview">
        <div className="score-card">
          <div className="score-label">All Time</div>
          <div className="score-value">{calculateOverallAverage(allTimeAvg) || '—'}</div>
          <div className="score-count">{reviews.length} reviews</div>
        </div>
        <div className="score-card">
          <div className="score-label">This Year</div>
          <div className="score-value">{calculateOverallAverage(yearlyAvg) || '—'}</div>
        </div>
        <div className="score-card">
          <div className="score-label">This Month</div>
          <div className="score-value">{calculateOverallAverage(monthlyAvg) || '—'}</div>
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div className="dimensions-section">
        <h2>Ratings Breakdown</h2>
        <div className="dimensions-grid">
          {allTimeAvg && (
            <>
              <div className="dimension-card">
                <div className="dimension-name">Taste</div>
                <div className="dimension-bar">
                  <div className="dimension-fill" style={{ width: `${(Number(allTimeAvg.avg_taste) / 100) * 100}%` }}></div>
                </div>
                <div className="dimension-value">{Number(allTimeAvg.avg_taste).toFixed(1)}</div>
              </div>
              <div className="dimension-card">
                <div className="dimension-name">Ingredients</div>
                <div className="dimension-bar">
                  <div className="dimension-fill" style={{ width: `${(Number(allTimeAvg.avg_ingredients) / 100) * 100}%` }}></div>
                </div>
                <div className="dimension-value">{Number(allTimeAvg.avg_ingredients).toFixed(1)}</div>
              </div>
              <div className="dimension-card">
                <div className="dimension-name">Ambiance</div>
                <div className="dimension-bar">
                  <div className="dimension-fill" style={{ width: `${(Number(allTimeAvg.avg_ambiance) / 100) * 100}%` }}></div>
                </div>
                <div className="dimension-value">{Number(allTimeAvg.avg_ambiance).toFixed(1)}</div>
              </div>
              <div className="dimension-card">
                <div className="dimension-name">Pricing</div>
                <div className="dimension-bar">
                  <div className="dimension-fill" style={{ width: `${(Number(allTimeAvg.avg_pricing) / 100) * 100}%` }}></div>
                </div>
                <div className="dimension-value">{Number(allTimeAvg.avg_pricing).toFixed(1)}</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-meta">
                    <span className="review-user">{review.user?.name_first || 'Anonymous'}</span>
                    <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                    <span className="review-score">{(
                      (review.taste + review.ingredients + review.ambiance + review.pricing) / 4
                    ).toFixed(0)}/100</span>
                  </div>
                </div>
                <div className="review-scores">
                  <span>Taste: {review.taste}</span>
                  <span>Ingredients: {review.ingredients}</span>
                  <span>Ambiance: {review.ambiance}</span>
                  <span>Pricing: {review.pricing}</span>
                </div>
                {review.comment && <div className="review-comment">{review.comment}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
