import { HeroCarousel } from '@/components/custom/HeroCarousel'
import React from 'react'

const slides = [
    {
        image: "/images/hero1.jpg",
        heading: "Call of Duty League 2025",
        description: "Experience the ultimate thrill once again at Barcelona in this year’s Call of Duty League!\nWatch as the tension rises and falls in this game of stress, frenzy, and respect.",
        buttonText: "View Stats"
    },
    {
        image: "/images/hero2.jpg",
        heading: "Set Your Calendars!",
        description: "Set your calendars for December 6, 2025!\nWatch as the tension rises and falls in this game of stress, frenzy, and respect.",
        buttonText: "View Stats"
    },
    {
        image: "/images/hero3.jpg",
        heading: "Twice in a Row?",
        description: "Will OpTic Texas be able to do it again?\nTune in this year to find out how it all folds out!\nFor now, just look at the stats while we wat!",
        buttonText: "View Stats"
    }
]

const HeroSection = () => {
    return (
        <HeroCarousel slides={slides} options={{ loop: true }} scrollTargetId='home-explore-stats' />
    )
}

export default HeroSection