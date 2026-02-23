import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 md:flex-row lg:px-8">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                <path d="M12 2C6.48 2 2 6 2 10c0 1.5.5 3 1.5 4.2C5 16 8 22 12 22s7-6 8.5-7.8c1-1.2 1.5-2.7 1.5-4.2 0-4-4.48-8-10-8z" fill="currentColor" opacity="0.9"/>
                <ellipse cx="12" cy="9" rx="6" ry="3" fill="currentColor" opacity="0.4"/>
              </svg>
            </div>
            <span className="font-semibold text-foreground">Umami</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Discover your next favorite meal.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/restaurants" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Restaurants
          </Link>
          <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
          <span className="text-sm text-muted-foreground">Privacy</span>
          <span className="text-sm text-muted-foreground">Terms</span>
        </nav>

        <p className="text-sm text-muted-foreground">
          {"2026 Umami. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}
