import React, { useEffect } from 'react';
import '../styles/restaurant-page.css';

export default function RestaurantPage() {

    const [restaurants, setRestaurants] = React.useState([]);

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
                setRestaurants(data.restaurants || []);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
                setRestaurants([]);
            }
        };

        fetchData();
    }, [])

    return (
        <div className="restaurant-page">
            <aside className="sidebar">
                <h2>Sort By</h2>
                <div className="sort-options">
                    <div className="sort-option">
                        <input type="radio" id="alphabetical" name="sort" />
                        <label htmlFor="alphabetical">Alphabetically</label>
                    </div>
                    <div className="sort-option">
                        <input type="radio" id="rating" name="sort" />
                        <label htmlFor="rating">Rating</label>
                    </div>
                    <div className="sort-option">
                        <input type="radio" id="price-low" name="sort" />
                        <label htmlFor="price-low">Price (Low to High)</label>
                    </div>
                    <div className="sort-option">
                        <input type="radio" id="price-high" name="sort" />
                        <label htmlFor="price-high">Price (High to Low)</label>
                    </div>
                </div>

                <h2>Filter By Type</h2>
                <div className="filter-options">
                    <div className="filter-option">
                        <input type="checkbox" id="italian" />
                        <label htmlFor="italian">Italian</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="chinese" />
                        <label htmlFor="chinese">Chinese</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="japanese" />
                        <label htmlFor="japanese">Japanese</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="mexican" />
                        <label htmlFor="mexican">Mexican</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="american" />
                        <label htmlFor="american">American</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="thai" />
                        <label htmlFor="thai">Thai</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="indian" />
                        <label htmlFor="indian">Indian</label>
                    </div>
                    <div className="filter-option">
                        <input type="checkbox" id="french" />
                        <label htmlFor="french">French</label>
                    </div>
                </div>
            </aside>

            <main className="restaurant-grid">
                <div className="restaurant-card">
                    <div className="restaurant-image"></div>
                    <div className="restaurant-info">
                        <h3 className="restaurant-name">Restaurant Name</h3>
                        <p className="restaurant-type">Cuisine Type</p>
                        <div className="restaurant-rating">⭐ 4.5</div>
                        <p className="restaurant-price">$$</p>
                    </div>
                </div>

                <div className="restaurant-card">
                    <div className="restaurant-image"></div>
                    <div className="restaurant-info">
                        <h3 className="restaurant-name">Restaurant Name</h3>
                        <p className="restaurant-type">Cuisine Type</p>
                        <div className="restaurant-rating">⭐ 4.5</div>
                        <p className="restaurant-price">$$</p>
                    </div>
                </div>

                <div className="restaurant-card">
                    <div className="restaurant-image"></div>
                    <div className="restaurant-info">
                        <h3 className="restaurant-name">Restaurant Name</h3>
                        <p className="restaurant-type">Cuisine Type</p>
                        <div className="restaurant-rating">⭐ 4.5</div>
                        <p className="restaurant-price">$$</p>
                    </div>
                </div>

                <div className="restaurant-card">
                    <div className="restaurant-image"></div>
                    <div className="restaurant-info">
                        <h3 className="restaurant-name">Restaurant Name</h3>
                        <p className="restaurant-type">Cuisine Type</p>
                        <div className="restaurant-rating">⭐ 4.5</div>
                        <p className="restaurant-price">$$</p>
                    </div>
                </div>

                <div className="restaurant-card">
                    <div className="restaurant-image"></div>
                    <div className="restaurant-info">
                        <h3 className="restaurant-name">Restaurant Name</h3>
                        <p className="restaurant-type">Cuisine Type</p>
                        <div className="restaurant-rating">⭐ 4.5</div>
                        <p className="restaurant-price">$$</p>
                    </div>
                </div>

                <div className="restaurant-card">
                    <div className="restaurant-image"></div>
                    <div className="restaurant-info">
                        <h3 className="restaurant-name">Restaurant Name</h3>
                        <p className="restaurant-type">Cuisine Type</p>
                        <div className="restaurant-rating">⭐ 4.5</div>
                        <p className="restaurant-price">$$</p>
                    </div>
                </div>

                <div className="restaurant-card">
                    <div className="restaurant-image"></div>
                    <div className="restaurant-info">
                        <h3 className="restaurant-name">Restaurant Name</h3>
                        <p className="restaurant-type">Cuisine Type</p>
                        <div className="restaurant-rating">⭐ 4.5</div>
                        <p className="restaurant-price">$$</p>
                    </div>
                </div>

                <div className="restaurant-card">
                    <div className="restaurant-image"></div>
                    <div className="restaurant-info">
                        <h3 className="restaurant-name">Restaurant Name</h3>
                        <p className="restaurant-type">Cuisine Type</p>
                        <div className="restaurant-rating">⭐ 4.5</div>
                        <p className="restaurant-price">$$</p>
                    </div>
                </div>

                <div className="restaurant-card">
                    <div className="restaurant-image"></div>
                    <div className="restaurant-info">
                        <h3 className="restaurant-name">Restaurant Name</h3>
                        <p className="restaurant-type">Cuisine Type</p>
                        <div className="restaurant-rating">⭐ 4.5</div>
                        <p className="restaurant-price">$$</p>
                    </div>
                </div>
            </main>
        </div>
    )
}