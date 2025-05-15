"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "Call of Duty League 2025",
      description:
        "Experience the ultimate thrill once again at Barcelona in this year's Call of Duty League! Watch as the tension rises and falls in this game of stress, frenzy, and respect.",
      backgroundImage: "/images/hero/cdl-main.jpg",
      buttonText: "View Stats",
      buttonLink: "/player-stats",
    },
    {
      id: 2,
      title: "Major IV Tournament",
      description:
        "The biggest tournament of the season is here! Watch the best teams battle it out for glory and a spot in the championship.",
      backgroundImage: "/images/hero/major-tournament.jpg",
      buttonText: "Tournament Details",
      buttonLink: "/teams-standings",
    },
    {
      id: 3,
      title: "2025 Championship",
      description:
        "The road to the championship begins now. Follow your favorite teams as they compete for the ultimate prize.",
      backgroundImage: "/images/hero/championship.jpg",
      buttonText: "View Season",
      buttonLink: "/teams-standings",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Gradient overlay at the bottom for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-black to-transparent"></div>

      <AnimatePresence>
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            className={`absolute inset-0 ${index === currentSlide ? "" : "pointer-events-none"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${
                slide.backgroundImage || "/placeholder.svg?height=600&width=1200"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 text-center md:px-6">
              <motion.h1
                className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                className="mb-8 max-w-2xl text-lg text-zinc-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {slide.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link href={slide.buttonLink}>
                  <Button className="bg-orange-500 text-white hover:bg-orange-600">{slide.buttonText}</Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-3/4 lg:top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-3/4 lg:top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "scale-125 bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
