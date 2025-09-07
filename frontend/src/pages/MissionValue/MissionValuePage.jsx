import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import React from 'react'
import HeroSection from './components/HeroSection'
import MissionSection from './components/MissionSection'
import ValuesSection from './components/ValuesSection'
import CallToActionSection from './components/CallToActionSection'

const MissionValuePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative overflow-hidden">
       <HeroSection />
      <MissionSection />
        <ValuesSection />
        <CallToActionSection />

      </main>
      <Footer />
    </div>
  )
}

export default MissionValuePage