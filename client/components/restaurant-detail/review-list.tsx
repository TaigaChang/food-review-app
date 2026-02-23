import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Review } from "@/lib/data"
import { CATEGORY_LABELS, type CategoryScores } from "@/lib/data"

interface ReviewListProps {
  reviews: Review[]
}

const categories = Object.keys(CATEGORY_LABELS) as (keyof CategoryScores)[]

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-foreground">
        Reviews ({reviews.length})
      </h2>

      <div className="mt-6 flex flex-col gap-6">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="flex items-start gap-3">
              <Avatar className="size-10 bg-secondary">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                  {review.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">
                      {review.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-semibold text-primary tabular-nums">
                      {Number(review.rating).toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 5</span>
                  </div>
                </div>

                {/* Category scores row */}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center gap-1.5 text-xs">
                      <span className="text-muted-foreground">
                        {CATEGORY_LABELS[cat]}:
                      </span>
                      <span className="font-medium tabular-nums text-card-foreground">
                        {Number(review.scores[cat]).toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {review.text}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
