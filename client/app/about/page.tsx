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
                Restaurants Aren't Static
              </h2>
              <div className="mt-6 flex flex-col gap-4 leading-relaxed text-muted-foreground">
                <p>
                  I created Umami because I got tired of looking at a 4.2-star average and having no idea what it actually means. Is this place still good? Did they hire a new chef? Did everyone leave? A single number doesn't tell you any of that.
                </p>
                <p>
                  We've all been there—the restaurant that used to be amazing but clearly lost the plot. Or you find this place you've never heard of and the ratings have climbed 0.8 stars in the last year. That trajectory tells you everything. It shows you which places are getting better, which are coasting, and which are genuinely slipping. That's the story that matters.
                </p>
                <p>
                  So instead of showing you a frozen snapshot in time, Umami shows you the trend. Watch a place rise. See when quality dips. Find the restaurants that are actually on an upswing. Once you start looking at ratings this way, you can't go back.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/images/about-mission.jpg"
                alt="Restaurant dining experience"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Dev Journey */}
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 border-t">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Behind the Scenes
            </p>
            <h2 className="mt-2 font-serif text-3xl text-foreground md:text-4xl text-balance">
              Coding of the Future
            </h2>
          </div>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-4">Getting Started</h3>
              <p className="text-muted-foreground mb-4">I built the whole backend and database myself from scratch. Migrations, APIs, the aggregation logic—everything. This mattered because it forced me to actually understand the problem deeply. If you don't know how the data flows, you can't build anything real on top of it.</p>
              
              <h3 className="font-semibold text-lg text-foreground mb-4 mt-6">Growing It</h3>
              <p className="text-muted-foreground mb-4">Then the scope got bigger. Google Places integration. Complex data seeding. Dealing with messy real-world data. That's when I started working more closely with AI tools—Claude, mostly. But the difference was I could actually evaluate what it suggested because I'd built the foundation myself. I knew what was right and what was sketchy.</p>
              
              <h3 className="font-semibold text-lg text-foreground mb-4 mt-6">Where We Are Now</h3>
              <p className="text-muted-foreground">Now I use AI for a lot of the implementation work. Code reviews, data work, frontend polish. And it's fast. But here's what I learned: this only works if you know your system well enough to catch mistakes. I can read AI-generated code and spot problems. I know what questions to ask. That foundation I built early made everything that came after actually useful.</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-8">
              <h3 className="font-semibold text-lg text-foreground mb-6">What That Actually Means</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>You need to understand your own system before you can use tools effectively</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>Being pragmatic means using the right tool for the moment, not sticking with what you know</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>Good fundamentals let you judge whether AI output is actually good</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>Modern tools can make you faster without making your code worse</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>You have to be willing to change how you work when the situation calls for it</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Values */}
        {/* Technical Foundation */}
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 border-t">
          <div className="text-center mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Under the Hood
            </p>
            <h2 className="mt-2 font-serif text-3xl text-foreground md:text-4xl text-balance">
              The Technical Foundation
            </h2>
          </div>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-4">What's Inside</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>React frontend with Next.js (TypeScript for fewer surprises)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>Node.js backend running Express</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>MySQL database that keeps track of everything</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>Secure login with JWT tokens</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>Real reviews pulled from Google Places</span>
                </li>
              </ul>
              
              <h3 className="font-semibold text-lg text-foreground mb-4 mt-8">What Actually Works</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>Rate each dimension separately (food, service, vibe, price). Your 4.5 for food might be a 2.5 for the atmosphere.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>Every month, we take a snapshot. Six months from now you can compare how things have shifted.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>Actual historical data so you can see the trend line, not just today's number.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>Charts make it obvious when something is getting better or worse.</span>
                </li>
              </ul>
            </div>
            <div className="bg-secondary/50 rounded-lg p-8">
              <h3 className="font-semibold text-lg text-foreground mb-6">How It Actually Works</h3>
              <ul className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <li>
                  <strong>Getting Real Data:</strong> We pull actual reviews from Google, then spread them across years with realistic variation so you can see real trends instead of everything being recent.
                </li>
                <li>
                  <strong>Smart Aggregation:</strong> Every restaurant's overall rating is a weighted blend of different factors (60% for the food, 15% service, 15% atmosphere, 10% prices). Does the math fast.
                </li>
                <li>
                  <strong>Keeping It Current:</strong> New reviews get incorporated automatically. Monthly snapshots build up the history so you actually have something to compare against.
                </li>
                <li>
                  <strong>Solid Code:</strong> TypeScript everywhere means the frontend and backend actually speak the same language. Less bugs. More reliable.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8 border-t">
          <div className="flex flex-col items-center rounded-xl bg-foreground px-6 py-16 text-center md:px-12">
            <h2 className="max-w-lg font-serif text-3xl text-background md:text-4xl text-balance">
              Go Find Your Next Favorite Place
            </h2>
            <p className="mt-4 max-w-md text-background/70">
              Seriously. Explore the map, watch the ratings change over time, and find restaurants that are actually getting better. Skip the ones that are coasting.
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
