import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import type { Restaurant } from "@/lib/data"

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`} className="group block">
      <article className="overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-card/90 text-card-foreground backdrop-blur-sm border-0 text-xs">
              {restaurant.cuisine}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-tight text-card-foreground group-hover:text-primary transition-colors">
              {restaurant.name}
            </h3>
            <span className="shrink-0 text-sm font-medium text-muted-foreground">
              {restaurant.priceRange}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <StarRating rating={restaurant.rating} size="sm" />
            <span className="text-sm font-medium text-foreground">{restaurant.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({restaurant.reviewCount})
            </span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3.5" />
            <span className="text-sm">{restaurant.neighborhood}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
