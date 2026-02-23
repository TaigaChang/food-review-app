"use client"

import { useState, useMemo, useEffect } from "react"
import { RestaurantCard } from "@/components/restaurant-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Restaurant {
  id: number
  name: string
  cuisine: string
  address: string
  created_at: string
}

interface Rating {
  avg_overall_alltime: number
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants`)
        const data = await res.json()
        const restaurantsList = data.restaurants || []
        setRestaurants(restaurantsList)

        // Fetch ratings
        const ratingsMap: Record<number, Rating> = {}
        for (const restaurant of restaurantsList) {
          try {
            const ratingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/aggregated/${restaurant.id}`)
            if (ratingRes.ok) {
              const ratingData = await ratingRes.json()
              ratingsMap[restaurant.id] = ratingData.ratings
            }
          } catch (error) {
            console.error(`Failed to fetch rating for restaurant ${restaurant.id}:`, error)
          }
        }
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
        <Select value={cuisine} onValueChange={setCuisine}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Cuisine" />
          </SelectTrigger>
          <SelectContent>
            {cuisineTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>

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
                  reviewCount: 0,
                  image: "/images/restaurant-default.jpg",
                  description: "",
                  address: restaurant.address,
                  hours: "",
                  phone: "",
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
