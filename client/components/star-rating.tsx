"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRate?: (rating: number) => void
}

const sizeClasses = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5" role={interactive ? "radiogroup" : "img"} aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating)
        const half = i === Math.floor(rating) && rating % 1 >= 0.5

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={cn(
              "p-0",
              interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"
            )}
            aria-label={interactive ? `Rate ${i + 1} stars` : undefined}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled || half
                  ? "fill-primary text-primary"
                  : "fill-transparent text-border"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
