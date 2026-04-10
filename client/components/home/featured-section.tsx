"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

interface FeaturedRestaurant {
  id: number
  name: string
  cuisine: string
  neighborhood: string
  priceRange: string
  rating: number
  reviewCount: number
  image: string
  description: string
  address: string
  hours: string
  phone: string
  tags: string[]
  recentReview?: {
    text: string
    score: number
    author: string
  }
}

export function FeaturedSection() {
  const [featured, setFeatured] = useState<FeaturedRestaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        // Fetch all restaurants
        const restaurantsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`
        )
        const { restaurants: restaurantsData } = await restaurantsRes.json()

        // Get aggregated ratings for each restaurant
        const restaurantsWithRatings = await Promise.all(
          restaurantsData.map(async (restaurant: any) => {
            const aggregatedRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/aggregated/${restaurant.id}`
            )
            const { ratings: aggregatedData } = await aggregatedRes.json()
            return {
              ...restaurant,
              rating: aggregatedData?.avg_overall_alltime || 0,
              reviewCount: aggregatedData?.review_count || 0,
            }
          })
        )

        // Sort by rating (descending) and get top 3
        const topRestaurants = restaurantsWithRatings
          .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3)

        // Fetch reviews for each top restaurant
        const restaurantsWithReviews = await Promise.all(
          topRestaurants.map(async (restaurant: any) => {
            const reviewsRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/restaurant?restaurant_id=${restaurant.id}`
            )
            const { reviews: reviewsData } = await reviewsRes.json()
            const reviews = reviewsData || []

            // Get the most recent review
            const recentReview = reviews.length > 0 ? reviews[0] : null

            return {
              ...restaurant,
              image: (restaurant.image_url && String(restaurant.image_url).trim()) || "/placeholder.jpg",
              recentReview: recentReview
                ? {
                    text: recentReview.comment,
                    score: recentReview.taste || 0,
                    author: `User ${recentReview.user_id}`,
                  }
                : undefined,
            }
          })
        )

        setFeatured(restaurantsWithReviews)
      } catch (error) {
        console.error("Failed to fetch featured restaurants:", error)
        setFeatured([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedRestaurants()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Featured
          </p>
          <h2 className="mt-2 font-serif text-3xl text-foreground md:text-4xl text-balance">
            Restaurants worth talking about
          </h2>
        </div>
        <Link
          href="/restaurants"
          className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:flex"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {loading ? (
        <div className="mt-10 text-center text-muted-foreground">
          Loading featured restaurants...
        </div>
      ) : featured.length === 0 ? (
        <div className="mt-10 text-center text-muted-foreground">
          No featured restaurants available
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg hover:border-primary/50"
            >
              <div className="aspect-video overflow-hidden bg-secondary">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-foreground">
                  {restaurant.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {restaurant.cuisine} • {restaurant.neighborhood}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-primary text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {restaurant.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({restaurant.reviewCount} reviews)
                  </span>
                </div>

                {restaurant.recentReview && (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Latest Review
                    </p>
                    <p className="text-sm text-foreground line-clamp-3 italic">
                      "{restaurant.recentReview.text}"
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      — {restaurant.recentReview.author}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          href="/restaurants"
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          View all restaurants
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
