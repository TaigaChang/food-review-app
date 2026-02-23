import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center lg:px-8 lg:py-44">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
          Your personal dining guide
        </p>
        <h1 className="max-w-3xl font-serif text-4xl leading-tight text-primary-foreground md:text-5xl lg:text-6xl text-balance">
          Discover, Rate & Track Restaurants
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
          Explore curated restaurants, read honest reviews from fellow food lovers, and keep track of every memorable meal.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/restaurants">
              Browse Restaurants
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link href="/about">
              Our Story
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
