import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="flex flex-col items-center rounded-xl bg-foreground px-6 py-16 text-center md:px-12">
        <h2 className="max-w-lg font-serif text-3xl text-background md:text-4xl text-balance">
          Ready to explore your city&apos;s dining scene?
        </h2>
        <p className="mt-4 max-w-md text-background/70">
          Join thousands of food enthusiasts sharing honest reviews and discovering remarkable restaurants.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/restaurants">
            Get Started
          </Link>
        </Button>
      </div>
    </section>
  )
}
