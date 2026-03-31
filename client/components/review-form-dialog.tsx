"use client"

import { useState } from "react"
import { ReviewForm } from "@/components/restaurant-detail/review-form"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Review } from "@/lib/data"

interface ReviewFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  restaurantName: string
  restaurantId: number
  reviews: Review[]
  userId?: number | null
  userReviews?: Review[]
  onReviewSubmitted?: () => void
}

export function ReviewFormDialog({
  open,
  onOpenChange,
  restaurantName,
  restaurantId,
  reviews,
  userId,
  userReviews,
  onReviewSubmitted,
}: ReviewFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none !w-[90vw] max-h-[95vh] overflow-y-auto">
        <DialogTitle className="sr-only">Write a Review for {restaurantName}</DialogTitle>
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-3xl text-foreground">Write a Review</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Share your experience at this restaurant
            </p>
          </div>
          <ReviewForm
            restaurantName={restaurantName}
            restaurantId={restaurantId}
            reviews={reviews}
            userId={userId}
            userReviews={userReviews}
            isDialog={true}
            onClose={() => onOpenChange(false)}
            onReviewSubmitted={onReviewSubmitted}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
