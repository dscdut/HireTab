import React from 'react'
import HeroSection from './components/HeroSection'
import MissionSection from './components/MissionSection'
import ValuesSection from './components/ValuesSection'
import CallToActionSection from './components/CallToActionSection'
import CandidateLayout from '@/shared/layout/candidate-layout/candidate-layout'

const MissionValuePage = () => {
  return (
    <CandidateLayout>
      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <CallToActionSection />
    </CandidateLayout>
  )
}
export default MissionValuePage
