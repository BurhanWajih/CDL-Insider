"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLogoUrl, handleImageError } from "@/lib/image-utils"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="h-10 w-10 overflow-hidden rounded-md">
              <Image
                src={getLogoUrl() || "/placeholder.svg?height=40&width=40"}
                alt="CDL Insider Logo"
                width={40}
                height={40}
                className="h-10 w-10"
                onError={(e) => handleImageError(e, 40, 40)}
                priority
              />
            </div>
            <span className="hidden text-xl font-bold text-white sm:inline-block">CDL INSIDER</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="/player-stats" className="text-sm font-medium text-white transition-colors hover:text-orange-500">
            Player Stats
          </Link>
          <Link href="/top-players" className="text-sm font-medium text-white transition-colors hover:text-orange-500">
            Top Players
          </Link>
          <Link
            href="/teams-standings"
            className="text-sm font-medium text-white transition-colors hover:text-orange-500"
          >
            Teams Standings
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container mx-auto px-4 pb-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/player-stats"
              className="rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              onClick={toggleMenu}
            >
              Player Stats
            </Link>
            <Link
              href="/top-players"
              className="rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              onClick={toggleMenu}
            >
              Top Players
            </Link>
            <Link
              href="/teams-standings"
              className="rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              onClick={toggleMenu}
            >
              Teams Standings
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
