import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import type { Restaurant } from "@/lib/data"

interface RestaurantHeroProps {
  restaurant: Restaurant
}

export function RestaurantHero({ restaurant }: RestaurantHeroProps) {
  return (
    <section className="relative h-72 overflow-hidden md:h-96">
      <Image
        src={restaurant.image}
        alt={restaurant.name}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-foreground/50" />
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {restaurant.tags.map((tag) => (
              <Badge key={tag} className="bg-primary-foreground/90 text-foreground border-0 text-xs backdrop-blur-sm">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-3 font-serif text-3xl text-primary-foreground md:text-5xl">
            {restaurant.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={restaurant.rating} size="md" />
            <span className="text-sm font-medium text-primary-foreground">
              {restaurant.rating} ({restaurant.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
