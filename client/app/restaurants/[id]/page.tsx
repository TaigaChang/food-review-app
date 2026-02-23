"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RestaurantHero } from "@/components/restaurant-detail/restaurant-hero"
import { RestaurantInfo } from "@/components/restaurant-detail/restaurant-info"
import { RatingBreakdown } from "@/components/restaurant-detail/rating-breakdown"
import { ReviewList } from "@/components/restaurant-detail/review-list"
import { ReviewForm } from "@/components/restaurant-detail/review-form"
import { RatingTrendChart } from "@/components/restaurant-detail/rating-trend-chart"
import type { Restaurant, Review, RatingHistoryPoint } from "@/lib/data"

interface ApiRestaurant {
  id: number
  name: string
  cuisine: string
  address: string
  created_at: string
}

interface ApiRating {
  avg_taste: number
  avg_service: number
  avg_ambiance: number
  avg_price: number
  avg_overall_alltime: number
}

interface ApiReview {
  id: number
  user_id: number
  restaurant_id: number
  taste: number
  service: number
  ambiance: number
  price: number
  comment: string
  created_at: string
}

interface ApiMonthlyRating {
  id: number
  restaurant_id: number
  month_index: number
  month_start: string
  avg_taste: number
  avg_service: number
  avg_ambiance: number
  avg_price: number
  avg_overall: number
  review_count: number
}

interface ApiDailyRating {
  id: number
  restaurant_id: number
  day_index: number
  day_start: string
  avg_taste: number
  avg_service: number
  avg_ambiance: number
  avg_price: number
  avg_overall: number
  review_count: number
}

export default function RestaurantDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [monthlyRatings, setMonthlyRatings] = useState<RatingHistoryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurant details
        const resRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${id}`)
        if (!resRes.ok) {
          setNotFoundError(true)
          setLoading(false)
          return
        }
        const resData: { restaurant: ApiRestaurant } = await resRes.json()
        const apiRestaurant = resData.restaurant

        // Fetch ratings
        let rating: ApiRating | null = null
        try {
          const ratingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/aggregated/${id}`)
          if (ratingRes.ok) {
            const ratingData = await ratingRes.json()
            rating = ratingData.ratings
          }
        } catch (error) {
          console.error("Failed to fetch ratings:", error)
        }

        // Fetch reviews
        let apiReviews: ApiReview[] = []
        try {
          const reviewRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/restaurant?restaurant_id=${id}`)
          if (reviewRes.ok) {
            const reviewData = await reviewRes.json()
            apiReviews = reviewData.reviews || []
          }
        } catch (error) {
          console.error("Failed to fetch reviews:", error)
        }

        // Fetch monthly ratings
        let apiMonthlyRatings: ApiMonthlyRating[] = []
        try {
          const monthlyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/monthly/${id}`)
          if (monthlyRes.ok) {
            const monthlyData = await monthlyRes.json()
            apiMonthlyRatings = monthlyData.monthlyRatings || []
          }
        } catch (error) {
          console.error("Failed to fetch monthly ratings:", error)
        }

        // Fetch daily ratings
        let apiDailyRatings: ApiDailyRating[] = []
        try {
          const dailyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/daily/${id}`)
          if (dailyRes.ok) {
            const dailyData = await dailyRes.json()
            apiDailyRatings = dailyData.dailyRatings || []
          }
        } catch (error) {
          console.error("Failed to fetch daily ratings:", error)
        }

        // Transform API data to match component expectations
        const transformedRestaurant: Restaurant = {
          id: apiRestaurant.id.toString(),
          name: apiRestaurant.name,
          cuisine: apiRestaurant.cuisine,
          neighborhood: "Downtown", // Not provided by API
          priceRange: "$$$", // Not provided by API
          rating: rating ? parseFloat(rating.avg_overall_alltime.toString()) : 0,
          reviewCount: apiReviews.length,
          image: "/images/restaurant-1.jpg", // Placeholder
          description: `Experience fine dining at ${apiRestaurant.name}, a ${apiRestaurant.cuisine} restaurant located at ${apiRestaurant.address}.`, // Generated description
          address: apiRestaurant.address,
          hours: "Tue-Sat 6:00 PM - 10:00 PM", // Not provided by API
          phone: "(555) 000-0000", // Not provided by API
          tags: [apiRestaurant.cuisine, "Restaurant"], // Generated tags
          reviews: [],
          categoryAverages: rating ? {
            taste: parseFloat(rating.avg_taste.toString()),
            ambiance: parseFloat(rating.avg_ambiance.toString()),
            service: parseFloat(rating.avg_service.toString()),
            price: parseFloat(rating.avg_price.toString()),
          } : {
            taste: 0,
            ambiance: 0,
            service: 0,
            price: 0,
          },
          ratingHistory: {
            fiveYear: apiMonthlyRatings
              .filter(m => m.month_index <= 60)
              .map(m => ({
                label: new Date(m.month_start).toLocaleDateString('en-US', { year: '2-digit', month: 'short' }),
                rating: parseFloat(m.avg_overall.toString()),
              }))
              .reverse(),
            oneYear: apiMonthlyRatings
              .filter(m => m.month_index <= 12)
              .map(m => ({
                label: new Date(m.month_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                rating: parseFloat(m.avg_overall.toString()),
              }))
              .reverse(),
            oneMonth: apiDailyRatings
              .filter(d => d.avg_overall !== null)
              .map(d => ({
                label: new Date(d.day_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                rating: parseFloat(d.avg_overall.toString()),
              }))
              .reverse(),
          },
        }

        // Transform monthly ratings for the state
        const transformedMonthlyRatings: RatingHistoryPoint[] = apiMonthlyRatings
          .map(m => ({
            label: new Date(m.month_start).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' }),
            rating: parseFloat(m.avg_overall.toString()),
          }))
          .reverse()
        const transformedReviews: Review[] = apiReviews.map((review) => ({
          id: review.id.toString(),
          author: `User ${review.user_id}`,
          avatar: String(review.user_id % 10),
          scores: {
            taste: review.taste,
            ambiance: review.ambiance,
            service: review.service,
            price: review.price,
          },
          rating: review.taste * 0.6 + review.service * 0.15 + review.ambiance * 0.15 + review.price * 0.1, // Weighted average
          date: new Date(review.created_at).toLocaleDateString(),
          text: review.comment,
        }))

        setRestaurant(transformedRestaurant)
        setReviews(transformedReviews)
        setMonthlyRatings(transformedMonthlyRatings)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch restaurant:", error)
        setNotFoundError(true)
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading restaurant...</div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (notFoundError || !restaurant) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Restaurant not found</h1>
            <p className="text-muted-foreground mt-2">The restaurant you're looking for doesn't exist.</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <RestaurantHero restaurant={restaurant} />

        <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              <RatingBreakdown restaurant={restaurant} />
              <RatingTrendChart history={restaurant.ratingHistory} restaurantName={restaurant.name} />
              <RestaurantInfo restaurant={restaurant} />
              <ReviewList reviews={reviews} />
              <ReviewForm restaurantName={restaurant.name} reviews={reviews} />
            </div>

            {/* Sidebar - Similar restaurants or call to action */}
            <aside>{/* Placeholder for sidebar content */}</aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
