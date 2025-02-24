import Link from "next/link"
import { ModeToggle } from "./mode-toggle"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            VisioMera
          </span>
        </Link>
        <nav className="ml-auto flex items-center space-x-4">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Generate
          </Link>
          <Link href="/community" className="text-sm font-medium transition-colors hover:text-primary">
            Community
          </Link>
          <Link href="/learn" className="text-sm font-medium transition-colors hover:text-primary">
            Learn
          </Link>
          <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
            Profile
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/auth" className="text-sm font-medium transition-colors hover:text-primary">
            Sign In
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

