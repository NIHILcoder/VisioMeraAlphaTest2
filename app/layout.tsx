import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import AnimatedBackground from "@/components/animated-background"
import Header from "@/components/header"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "VisioMera - AI Art Generation",
  description: "Create stunning AI-generated art with VisioMera",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="relative min-h-screen">
            <AnimatedBackground />
            <Header />
            <div className="relative z-10">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'