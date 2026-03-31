import { MapPin, Clock, Phone } from "lucide-react"
import type { Restaurant } from "@/lib/data"

interface RestaurantInfoProps {
  restaurant: Restaurant
}

export function RestaurantInfo({ restaurant }: RestaurantInfoProps) {
  const description = restaurant.about || restaurant.description || "No information available";
  
  return (
    <div>
      <h2 className="font-serif text-2xl text-foreground">About</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        {description}
      </p>

      <div className="mt-6 flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span>{restaurant.address}</span>
        </div>
        {restaurant.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="size-4 shrink-0 text-primary" />
            <span>{restaurant.phone}</span>
          </div>
        )}
        {restaurant.hours && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4 shrink-0 text-primary" />
            <span>{restaurant.hours}</span>
          </div>
        )}
      </div>
    </div>
  )
}
