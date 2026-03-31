"use client"

import { useState, useMemo, useEffect } from "react"
import { RestaurantCard } from "@/components/restaurant-card"

interface Restaurant {
  id: number
  name: string
  cuisine: string
  address: string
  created_at: string
  phone?: string
  image_url?: string
}

interface Rating {
  avg_overall_alltime: number
  review_count?: number
}

type SortOption = "rating" | "name"

export function RestaurantGrid() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [ratings, setRatings] = useState<Record<number, Rating>>({})
  const [cuisine, setCuisine] = useState("All")
  const [sort, setSort] = useState<SortOption>("rating")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`)
        const data = await res.json()
        const restaurantsList = data.restaurants || []
        setRestaurants(restaurantsList)

        // Fetch ratings in parallel (much faster than sequentially)
        const ratingsMap: Record<number, Rating> = {}
        const ratingPromises = restaurantsList.map(async (restaurant: Restaurant) => {
          try {
            const ratingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/aggregated/${restaurant.id}`, {
              signal: AbortSignal.timeout(5000) // 5 second timeout
            })
            if (ratingRes.ok) {
              const ratingData = await ratingRes.json()
              ratingsMap[restaurant.id] = ratingData.ratings
            }
          } catch (error) {
            console.error(`Failed to fetch rating for restaurant ${restaurant.id}:`, error)
            // Continue without rating if it fails
          }
        })
        
        // Wait for all rating requests to complete
        await Promise.all(ratingPromises)
        setRatings(ratingsMap)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch restaurants:", error)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const cuisineTypes = ["All", ...new Set(restaurants.map(r => r.cuisine))]

  const filtered = useMemo(() => {
    let list = [...restaurants]

    if (cuisine !== "All") {
      list = list.filter(r => r.cuisine === cuisine)
    }

    switch (sort) {
      case "rating":
        list.sort((a, b) => {
          const ratingA = ratings[a.id]?.avg_overall_alltime || 0
          const ratingB = ratings[b.id]?.avg_overall_alltime || 0
          return ratingB - ratingA
        })
        break
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return list
  }, [cuisine, sort, restaurants, ratings])

  if (loading) {
    return <div className="flex items-center justify-center py-20">Loading restaurants...</div>
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <select 
          value={cuisine} 
          onChange={(e) => setCuisine(e.target.value)}
          className="w-40 px-3 py-2 rounded border border-input bg-background text-sm"
        >
          {cuisineTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="w-40 px-3 py-2 rounded border border-input bg-background text-sm"
        >
          <option value="rating">Highest Rated</option>
          <option value="name">Name A-Z</option>
        </select>

        {cuisine !== "All" && (
          <button
            onClick={() => setCuisine("All")}
            className="text-sm text-primary hover:underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((restaurant) => {
            const rating = ratings[restaurant.id]
            const ratingValue = rating?.avg_overall_alltime || 0
            const reviewCount = rating?.review_count || 0

            return (
              <RestaurantCard
                key={restaurant.id}
                restaurant={{
                  id: restaurant.id.toString(),
                  name: restaurant.name,
                  cuisine: restaurant.cuisine,
                  neighborhood: restaurant.address,
                  priceRange: "$$",
                  rating: Number(ratingValue),
                  reviewCount: reviewCount,
                  image: restaurant.image_url || "/images/restaurant-default.jpg",
                  description: "",
                  address: restaurant.address,
                  hours: restaurant.phone || "",
                  phone: restaurant.phone || "",
                  tags: [restaurant.cuisine],
                }}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-lg font-medium text-foreground">No restaurants found</p>
          <p className="mt-1 text-muted-foreground">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
}
