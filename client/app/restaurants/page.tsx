import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RestaurantGrid } from "@/components/restaurants/restaurant-grid"

export const metadata = {
  title: "Restaurants - Umami",
  description: "Browse our curated collection of restaurants. Filter by cuisine, sort by rating, and find your next great meal.",
}

export default function RestaurantsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="mb-10">
            <h1 className="font-serif text-3xl text-foreground md:text-4xl text-balance">
              All Restaurants
            </h1>
            <p className="mt-2 text-muted-foreground">
              Browse, filter, and find your next favorite spot.
            </p>
          </div>
          <RestaurantGrid />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
