import StatsSection from './containers/home-page/stats-section'
import React from 'react'
import HeroSection from './containers/home-page/hero-section'

const Home = () => {
  return (
    <main>
      <HeroSection />
      <StatsSection />
    </main>
  )
}

export default Home