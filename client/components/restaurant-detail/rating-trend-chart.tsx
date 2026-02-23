"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { RatingHistoryPoint } from "@/lib/data"

type TimeRange = "5y" | "1y" | "1m"

interface RatingTrendChartProps {
  history: {
    fiveYear: RatingHistoryPoint[]
    oneYear: RatingHistoryPoint[]
    oneMonth: RatingHistoryPoint[]
  }
  restaurantName: string
}

const timeRangeLabels: Record<TimeRange, string> = {
  "5y": "5 Years",
  "1y": "1 Year",
  "1m": "1 Month",
}

const timeRangeSubtitles: Record<TimeRange, string> = {
  "5y": "Yearly average rating over the last 5 years",
  "1y": "Monthly average rating over the last 12 months",
  "1m": "Weekly average rating over the last 4 weeks",
}

export function RatingTrendChart({ history, restaurantName }: RatingTrendChartProps) {
  const [range, setRange] = useState<TimeRange>("5y")

  const dataMap: Record<TimeRange, RatingHistoryPoint[]> = {
    "5y": history.fiveYear,
    "1y": history.oneYear,
    "1m": history.oneMonth,
  }

  const data = dataMap[range]

  if (!data || data.length === 0) {
    return (
      <div>
        <h2 className="font-serif text-2xl text-foreground">Rating Trend</h2>
        <p className="mt-4 text-muted-foreground">No rating data available</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Rating Trend</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {timeRangeSubtitles[range]}
          </p>
        </div>

        <div className="flex gap-1 rounded-lg border border-border bg-secondary/50 p-1">
          {(Object.keys(timeRangeLabels) as TimeRange[]).map((key) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                range === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {timeRangeLabels[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border, #e5e5e5)"
            />
            <XAxis
              dataKey="label"
              tick={false}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(v: number) => v.toFixed(1)}
              tickMargin={4}
              label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-background, #fff)",
                border: "1px solid var(--color-border, #e5e5e5)",
                borderRadius: "6px",
              }}
              formatter={(value: any) => [Number(value).toFixed(1), "Rating"]}
              labelStyle={{ color: "var(--color-foreground, #000)" }}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#c2703a"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
