import { Progress } from "@/components/ui/progress"
import type { Restaurant } from "@/lib/data"
import { CATEGORY_LABELS, CATEGORY_WEIGHTS } from "@/lib/data"

interface RatingBreakdownProps {
  restaurant: Restaurant
}

const weightPercent: Record<string, string> = {
  taste: "60%",
  ambiance: "15%",
  service: "15%",
  price: "10%",
}

export function RatingBreakdown({ restaurant }: RatingBreakdownProps) {
  const categories = Object.entries(restaurant.categoryAverages) as [
    keyof typeof CATEGORY_LABELS,
    number,
  ][]

  return (
    <div>
      <h2 className="font-serif text-2xl text-foreground">Ratings</h2>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:gap-10">
        {/* Overall score */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl font-semibold text-foreground">
            {restaurant.rating}
          </span>
          <span className="mt-1 text-sm text-muted-foreground">out of 5</span>
          <span className="text-sm text-muted-foreground">
            {restaurant.reviewCount} reviews
          </span>
        </div>

        {/* Category breakdown */}
        <div className="flex-1 flex flex-col gap-4">
          {categories.map(([key, score]) => {
            const percentage = (score / 5) * 100

            return (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {CATEGORY_LABELS[key]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({weightPercent[key]} weight)
                    </span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {score.toFixed(1)}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className="h-2.5 [&>[data-slot=progress-indicator]]:bg-primary"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Weight explanation */}
      <p className="mt-4 text-xs text-muted-foreground">
        Overall score is weighted: Taste {weightPercent.taste}, Ambiance{" "}
        {weightPercent.ambiance}, Service {weightPercent.service}, Price{" "}
        {weightPercent.price}.
      </p>
    </div>
  )
}
