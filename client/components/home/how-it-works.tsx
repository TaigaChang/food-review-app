import { Search, Star, BookOpen } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Browse restaurants by cuisine, neighborhood, or rating. Find hidden gems and tried-and-true favorites.",
  },
  {
    icon: Star,
    title: "Rate",
    description:
      "Share your honest experience. Your reviews help others find their next great meal.",
  },
  {
    icon: BookOpen,
    title: "Track",
    description:
      "Keep a personal food journal. Save restaurants, revisit favorites, and build your own dining history.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="mt-2 font-serif text-3xl text-foreground md:text-4xl text-balance">
            Three simple steps
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((step, idx) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="size-6 text-primary" />
              </div>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                {String(idx + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
