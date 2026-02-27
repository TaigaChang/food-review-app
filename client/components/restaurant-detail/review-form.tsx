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
  restaurantId?: number
  reviews: Review[]
  isDialog?: boolean
  onClose?: () => void
  onReviewSubmitted?: () => void
}

const categories = Object.keys(CATEGORY_LABELS) as (keyof CategoryScores)[]

export function ReviewForm({ restaurantName, restaurantId, reviews, isDialog = false, onClose, onReviewSubmitted }: ReviewFormProps) {
  const [scores, setScores] = useState<CategoryScores>({
    taste: 2.5,
    ambiance: 2.5,
    service: 2.5,
    price: 2.5,
  })
  const [activeCategory, setActiveCategory] = useState<keyof CategoryScores | null>(null)
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const weightedScore = useMemo(() => {
    return computeWeightedScore(scores)
  }, [scores])

  const similarReviews = useMemo(() => {
    if (!activeCategory) return []
    const userScore = scores[activeCategory]
    return reviews
      .filter((r) => Math.abs(r.scores[activeCategory] - userScore) <= 0.5)
      .slice(0, 3)
  }, [activeCategory, scores, reviews])

  const handleScoreChange = (category: keyof CategoryScores, value: number) => {
    setScores((prev) => ({ ...prev, [category]: value }))
    setActiveCategory(category)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!restaurantId) return
    
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setError("You must be logged in to submit a review")
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          taste: scores.taste,
          service: scores.service,
          ambiance: scores.ambiance,
          price: scores.price,
          comment: text,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      setSubmitted(true)
      onReviewSubmitted?.()
      
      setTimeout(() => {
        setSubmitted(false)
        setScores({ taste: 2.5, ambiance: 2.5, service: 2.5, price: 2.5 })
        setText("")
        setActiveCategory(null)
        setLoading(false)
        if (isDialog) {
          onClose?.()
        }
      }, isDialog ? 1500 : 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!isDialog && (
        <>
          <h2 className="font-serif text-2xl text-foreground">Write a Review</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your experience at {restaurantName}
          </p>
        </>
      )}

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      {submitted ? (
        <div className="rounded-lg border border-accent bg-accent/10 p-6 text-center">
          <p className="font-medium text-foreground">
            Thank you for your review!
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your feedback helps the community discover great food.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={scores[cat].toFixed(1)}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value)
                          if (val >= 0.5 && val <= 5) {
                            handleScoreChange(cat, val)
                          }
                        }}
                        className="w-12 px-2 py-1 text-sm font-semibold tabular-nums text-right rounded border border-input bg-background text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            const newVal = Math.min(5, scores[cat] + 0.1)
                            handleScoreChange(cat, parseFloat(newVal.toFixed(1)))
                          }}
                          className="h-4 w-5 rounded-t border border-input bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center text-xs text-muted-foreground hover:text-foreground"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newVal = Math.max(0.5, scores[cat] - 0.1)
                            handleScoreChange(cat, parseFloat(newVal.toFixed(1)))
                          }}
                          className="h-4 w-5 rounded-b border border-input bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center text-xs text-muted-foreground hover:text-foreground"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
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
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Weighted Score:
            </span>
            <span className="text-2xl font-semibold text-primary tabular-nums">
              {weightedScore.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">/ 5.0</span>
          </div>

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
                          {typeof review.scores[activeCategory] === 'number' ? review.scores[activeCategory].toFixed(1) : "N/A"}
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

          <Button type="submit" disabled={loading} className="self-start">
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}
    </div>
  )
}
