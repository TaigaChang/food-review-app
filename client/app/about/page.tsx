import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "About - Umami",
  description: "The story behind Umami. We believe every meal tells a story worth sharing.",
}

const stats = [
  { value: "2,400+", label: "Restaurants" },
  { value: "18,000+", label: "Reviews" },
  { value: "45,000+", label: "Food Lovers" },
  { value: "12", label: "Cities" },
]

const values = [
  {
    title: "Quality Evolves",
    description: "A restaurant's rating isn't fixed. We show you how quality changes over time, revealing hidden improvements and honest declines so you can find restaurants at their best.",
  },
  {
    title: "Authentic Voices",
    description: "Every review on Umami comes from real diners. No paid placements, no locked-in rankings. Your opinion today shapes tomorrow's conversation.",
  },
  {
    title: "See the Trajectory",
    description: "Discover restaurants rising to greatness with new talent, support classics still delivering, and understand where establishments are truly headed—not just where they were.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/about-hero.jpg"
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-foreground/55" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-28 lg:px-8 lg:py-36">
            <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
              Our Story
            </p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl text-primary-foreground md:text-5xl leading-tight text-balance">
              Every meal tells a story worth sharing
            </h1>
          </div>
        </section>

        {/* Narrative */}
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl text-foreground md:text-4xl text-balance">
                Restaurant quality isn't frozen in time—it evolves
              </h2>
              <div className="mt-6 flex flex-col gap-4 leading-relaxed text-muted-foreground">
                <p>
                  Umami was created by Taiga Chang in October 2025 with a simple observation: we've all been to a restaurant coasting on yesterday's reputation. A place that was brilliant five years ago but has lost its edge. Meanwhile, down the street, a tired neighborhood spot got new management and is absolutely thriving now.
                </p>
                <p>
                  Most review platforms show you an average, a single number frozen in time. But restaurants are living businesses. They evolve. A change in chef. New ownership. A fresh approach to familiar recipes. These moments matter, and they deserve to be seen.
                </p>
                <p>
                  That's why Umami tracks ratings over time. Not just where a restaurant is, but where it's heading. You discover not just the destination, but the trajectory. You find the hidden gems that are rising, support the classics that are still delivering, and confidently skip the places resting on their laurels.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/images/about-mission.jpg"
                alt="Hands preparing artisan food on a wooden cutting board with fresh herbs"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-secondary/50 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-semibold text-foreground md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              What we believe
            </p>
            <h2 className="mt-2 font-serif text-3xl text-foreground md:text-4xl text-balance">
              Our values
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {values.map((value, idx) => (
              <div key={value.title} className="flex flex-col gap-3">
                <span className="text-xs font-medium text-muted-foreground">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
          <div className="flex flex-col items-center rounded-xl bg-foreground px-6 py-16 text-center md:px-12">
            <h2 className="max-w-lg font-serif text-3xl text-background md:text-4xl text-balance">
              Join the conversation
            </h2>
            <p className="mt-4 max-w-md text-background/70">
              Whether you are a home cook, a weekend brunch devotee, or someone who plans vacations around restaurants, there is a seat for you at the table.
            </p>
            <Button asChild size="lg" className="mt-8 gap-2">
              <Link href="/restaurants">
                Explore Restaurants
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
