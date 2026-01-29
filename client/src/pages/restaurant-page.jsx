import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/restaurant-page.css';

export default function RestaurantPage() {

    const [restaurants, setRestaurants] = React.useState([]);
    const [ratings, setRatings] = React.useState({});
    const [sortBy, setSortBy] = React.useState('');
    const [selectedCuisines, setSelectedCuisines] = React.useState([]);

    // Fetch restaurant data from the backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/restaurants', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                console.log('Fetched restaurants:', data);
                const restaurantsList = data.restaurants || [];
                setRestaurants(restaurantsList);

                // Fetch aggregated ratings for each restaurant
                const ratingsMap = {};
                for (const restaurant of restaurantsList) {
                    try {
                        const ratingRes = await fetch(`/api/restaurants/aggregated/${restaurant.id}`, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                        });
                        if (ratingRes.ok) {
                            const ratingData = await ratingRes.json();
                            ratingsMap[restaurant.id] = ratingData.ratings;
                        }
                    } catch (error) {
                        console.error(`Failed to fetch rating for restaurant ${restaurant.id}:`, error);
                    }
                }
                setRatings(ratingsMap);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
                setRestaurants([]);
            }
        };

        fetchData();
    }, [])

    const handleSortChange = (e) => {
        // Toggle: if clicking the same option, uncheck it; otherwise select it
        if (sortBy === e.target.id) {
            setSortBy('');
        } else {
            setSortBy(e.target.id);
        }
    };

    const handleCuisineChange = (e) => {
        const cuisine = e.target.id.charAt(0).toUpperCase() + e.target.id.slice(1);
        if (e.target.checked) {
            setSelectedCuisines([...selectedCuisines, cuisine]);
        } else {
            setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
        }
    };

    const getFilteredAndSortedRestaurants = () => {
        let filtered = restaurants;

        // Apply cuisine filter
        if (selectedCuisines.length > 0) {
            filtered = filtered.filter(r => selectedCuisines.includes(r.cuisine));
        }

        // Apply sorting
        let sorted = [...filtered];
        if (sortBy === 'alphabetical') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'rating') {
            sorted.sort((a, b) => {
                const ratingA = ratings[a.id]?.avg_overall_alltime || 0;
                const ratingB = ratings[b.id]?.avg_overall_alltime || 0;
                return ratingB - ratingA; // Highest rating first
            });
        } else if (sortBy === 'price-low') {
            sorted.sort((a, b) => {
                const priceA = ratings[a.id]?.avg_pricing_alltime || 0;
                const priceB = ratings[b.id]?.avg_pricing_alltime || 0;
                return priceA - priceB;
            });
        } else if (sortBy === 'price-high') {
            sorted.sort((a, b) => {
                const priceA = ratings[a.id]?.avg_pricing_alltime || 0;
                const priceB = ratings[b.id]?.avg_pricing_alltime || 0;
                return priceB - priceA;
            });
        }

        return sorted;
    };

    return (
        <div className="restaurant-page">
            <aside className="sidebar">
                <h2>Sort By</h2>
                <div className="sort-options">
                    <div className="sort-option">
                        <input type="checkbox" id="alphabetical" checked={sortBy === 'alphabetical'} onChange={handleSortChange} />
                        <label htmlFor="alphabetical">Alphabetically</label>
                    </div>
                    <div className="sort-option">
                        <input type="checkbox" id="rating" checked={sortBy === 'rating'} onChange={handleSortChange} />
                        <label htmlFor="rating">Rating</label>
                    </div>
                    <div className="sort-option">
                        <input type="checkbox" id="price-low" checked={sortBy === 'price-low'} onChange={handleSortChange} />
                        <label htmlFor="price-low">Price (Low to High)</label>
                    </div>
                    <div className="sort-option">
                        <input type="checkbox" id="price-high" checked={sortBy === 'price-high'} onChange={handleSortChange} />
                        <label htmlFor="price-high">Price (High to Low)</label>
                    </div>
                </div>

                <h2>Filter By Type</h2>
                <div className="filter-options">
                    <div className="filter-option">
                        <input type="checkbox" id="italian" onChange={handleCuisineChange} />
                        <label htmlFor="italian">Italian</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="chinese" onChange={handleCuisineChange} />
                        <label htmlFor="chinese">Chinese</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="japanese" onChange={handleCuisineChange} />
                        <label htmlFor="japanese">Japanese</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="mexican" onChange={handleCuisineChange} />
                        <label htmlFor="mexican">Mexican</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="american" onChange={handleCuisineChange} />
                        <label htmlFor="american">American</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="thai" onChange={handleCuisineChange} />
                        <label htmlFor="thai">Thai</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="indian" onChange={handleCuisineChange} />
                        <label htmlFor="indian">Indian</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="french" onChange={handleCuisineChange} />
                        <label htmlFor="french">French</label>
                    </div>
                </div>
            </aside>

            <main className="restaurant-grid">
                {getFilteredAndSortedRestaurants().slice(0, 10).map((restaurant) => {
                    const rating = ratings[restaurant.id];
                    const overallScore = rating ? parseFloat(rating.avg_overall_alltime) : 0;
                    const displayRating = overallScore.toFixed(1);
                    return (
                        <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`} className="restaurant-card-link">
                            <div className="restaurant-card">
                                <div className="restaurant-image" style={{backgroundImage: `url(${restaurant.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                                <div className="restaurant-info">
                                    <h3 className="restaurant-name">{restaurant.name}</h3>
                                    <p className="restaurant-address">{restaurant.address}</p>
                                    <p className="restaurant-type">{restaurant.cuisine}</p>
                                    <div className="restaurant-rating-section">
                                        <div className="rating-label">Rating: {displayRating}/100</div>
                                        <div className="rating-bar">
                                            <div className="rating-fill" style={{width: `${overallScore}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </main>
        </div>
    )
}