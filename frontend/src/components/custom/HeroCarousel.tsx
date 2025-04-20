"use client"
import * as React from "react"
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, ChevronsDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "../ui/button"

type CarouselProps = {
    slides: {
        image: string
        heading: string
        description: string
        buttonText: string
    }[],
    scrollTargetId: string,
    options?: EmblaOptionsType
}

export function HeroCarousel({ slides, scrollTargetId, options }: CarouselProps) {
    const autoplayOptions = React.useMemo(() =>
        Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
        []
    )

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            ...options,
            watchDrag: false, // Helps with smoother transitions
        },
        [autoplayOptions]
    )

    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [isAnimating, setIsAnimating] = React.useState(false)

    const scrollPrev = React.useCallback(() => {
        if (!emblaApi || isAnimating) return
        setIsAnimating(true)
        emblaApi.scrollPrev()
        setTimeout(() => setIsAnimating(false), 500)
    }, [emblaApi, isAnimating])

    const scrollNext = React.useCallback(() => {
        if (!emblaApi || isAnimating) return
        setIsAnimating(true)
        emblaApi.scrollNext()
        setTimeout(() => setIsAnimating(false), 500)
    }, [emblaApi, isAnimating])

    const scrollTo = React.useCallback((index: number) => {
        if (!emblaApi || isAnimating) return
        setIsAnimating(true)
        emblaApi.scrollTo(index)
        setTimeout(() => setIsAnimating(false), 500)
    }, [emblaApi, isAnimating])

    // Update selectedIndex when slide changes
    React.useEffect(() => {
        if (!emblaApi) return

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap())
        }

        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)

        return () => {
            emblaApi.off('select', onSelect)
            emblaApi.off('reInit', onSelect)
        }
    }, [emblaApi])

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container h-full">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="embla__slide relative flex-grow-0 flex-shrink-0 w-full h-full"
                        >
                            {/* Image with Gradients */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={slide.image}
                                    alt={slide.heading}
                                    fill
                                    priority={index === 0}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/100" />
                                <div className="absolute inset-0 bg-gradient-to-r from-background/0 via-background/60 to-background/80" />
                            </div>

                            {/* Text Content */}
                            <div className={cn(
                                "relative z-20 h-full flex flex-col justify-center transition-opacity duration-500",
                                selectedIndex === index ? "opacity-100" : "opacity-0"
                            )}>
                                <div className="container px-5 lg:ml-[50%] text-left max-w-4xl">
                                    <h1 className="text-5xl font-bold text-white mb-4">
                                        {slide.heading}
                                    </h1>
                                    <p className="text-white/90 text-lg mb-6 whitespace-pre-line">
                                        {slide.description}
                                    </p>
                                    <button className="bg-primary text-primary-foreground drop-shadow-normal px-8 py-3 rounded-lg hover:bg-primary/90 hover:drop-shadow-hover hover:cursor-pointer transition-all duration-300 text-lg font-medium">
                                        {slide.buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 p-1 text-center bg-background/50 hover:drop-shadow-normal rounded-full">
                <button
                    onClick={scrollPrev}
                    className="hover:drop-shadow-selected bg-background/40 rounded-full hover:cursor-pointer transition-all"
                    aria-label="Previous slide"
                    disabled={isAnimating}
                >
                    <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={cn(
                            "w-3 h-3 rounded-full translate-y-2 transition-all duration-300",
                            index === selectedIndex ? "bg-white scale-125" : "bg-white/50"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
                <button
                    onClick={scrollNext}
                    className="hover:drop-shadow-selected bg-background/40 rounded-full hover:cursor-pointer transition-all"
                    aria-label="Next slide"
                    disabled={isAnimating}
                >
                    <ChevronRight className="w-8 h-8 text-white" />
                </button>
            </div>


            {/* Scroll Down Button */}
            <div className="absolute hidden md:block bottom-8 left-1/2 transform -transform-x-1/2 z-50 hover:drop-shadow-hover">
                <button
                    onClick={() => {
                        const el = document.getElementById(scrollTargetId)
                        window.scrollTo({
                            top: el?.offsetTop,
                            behavior: 'smooth'
                        })
                    }}
                    className="animate-bounce"
                >
                    <ChevronsDown className="w-8 h-8 text-white" />
                </button>
            </div>
        </div>
    )
}