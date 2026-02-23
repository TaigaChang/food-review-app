"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  type CategoryScores,
  CATEGORY_LABELS,
  CATEGORY_WEIGHTS,
  computeWeightedScore,
} from "@/lib/data"
import type { Review } from "@/lib/data"

interface ReviewFormProps {
  restaurantName: string
  reviews: Review[]
}

const categories = Object.keys(CATEGORY_LABELS) as (keyof CategoryScores)[]

export function ReviewForm({ restaurantName, reviews }: ReviewFormProps) {
  const [scores, setScores] = useState<CategoryScores>({
    taste: 0,
    ambiance: 0,
    service: 0,
    price: 0,
  })
  const [activeCategory, setActiveCategory] = useState<keyof CategoryScores | null>(null)
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const weightedScore = useMemo(() => {
    const allSet = Object.values(scores).every((v) => v > 0)
    if (!allSet) return null
    return computeWeightedScore(scores)
  }, [scores])

  const similarReviews = useMemo(() => {
    if (!activeCategory || scores[activeCategory] === 0) return []
    const userScore = scores[activeCategory]
    return reviews
      .filter((r) => Math.abs(r.scores[activeCategory] - userScore) <= 0.5)
      .slice(0, 3)
  }, [activeCategory, scores, reviews])

  const handleScoreChange = (category: keyof CategoryScores, value: number) => {
    setScores((prev) => ({ ...prev, [category]: value }))
    setActiveCategory(category)
  }

  const allScoresSet = Object.values(scores).every((v) => v > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!allScoresSet) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setScores({ taste: 0, ambiance: 0, service: 0, price: 0 })
      setText("")
      setActiveCategory(null)
    }, 3000)
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-foreground">Write a Review</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Share your experience at {restaurantName}
      </p>

      {submitted ? (
        <div className="mt-6 rounded-lg border border-accent bg-accent/10 p-6 text-center">
          <p className="font-medium text-foreground">
            Thank you for your review!
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your feedback helps the community discover great food.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          {/* Category scores */}
          <div className="flex flex-col gap-5">
            {categories.map((cat) => {
              const weight = Math.round(CATEGORY_WEIGHTS[cat] * 100)
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">
                      {CATEGORY_LABELS[cat]}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        ({weight}% weight)
                      </span>
                    </label>
                    <span className="text-sm font-semibold tabular-nums text-foreground min-w-[2.5rem] text-right">
                      {scores[cat] > 0 ? scores[cat].toFixed(1) : "---"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={scores[cat] || 0.5}
                    onChange={(e) =>
                      handleScoreChange(cat, parseFloat(e.target.value))
                    }
                    onFocus={() => setActiveCategory(cat)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary bg-secondary"
                    aria-label={`Rate ${CATEGORY_LABELS[cat]}`}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">0.5</span>
                    <span className="text-xs text-muted-foreground">5.0</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Weighted total preview */}
          {weightedScore !== null && (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3">
              <span className="text-sm text-muted-foreground">
                Weighted Score:
              </span>
              <span className="text-2xl font-semibold text-primary tabular-nums">
                {weightedScore.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/ 5.0</span>
            </div>
          )}

          {/* Similar reviews for active category */}
          {activeCategory && similarReviews.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                Reviews with similar{" "}
                <span className="text-foreground">
                  {CATEGORY_LABELS[activeCategory]}
                </span>{" "}
                scores
              </p>
              <div className="flex flex-col gap-3">
                {similarReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                      {review.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-card-foreground">
                          {review.author}
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {CATEGORY_LABELS[activeCategory]}:{" "}
                          {review.scores[activeCategory].toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-muted-foreground line-clamp-2">
                        {review.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="review-text"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Your Review
            </label>
            <Textarea
              id="review-text"
              placeholder="Tell us about your experience..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={!allScoresSet} className="self-start">
            Submit Review
          </Button>
        </form>
      )}
    </div>
  )
}
