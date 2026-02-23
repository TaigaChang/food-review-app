import { restaurants } from "@/lib/data"
import { RestaurantCard } from "@/components/restaurant-card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FeaturedSection() {
  const featured = restaurants.slice(0, 3)

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

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

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
