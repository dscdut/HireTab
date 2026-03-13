import { useState, useEffect } from 'react'
import Openning from './components/Openning'
import Benefit from './components/Benefit'
import InspirationalSection from './components/InspirationalSection'

import LogoScrambleSlogan from './components/LogoScrambleSlogan'
import TypewriterLoading from './components/TypewriterLoading'
import LoadingTerminal from './components/LoadingTerminal'
import CandidateLayout from '@/shared/layout/candidate-layout/candidate-layout'
import PostJobCTA from './components/PostJobCTA'
import FeaturedJobs from './components/FeaturedJobs'
import LatestJobs from './components/LatestJobs'

const HomePage = () => {
  return (
    <CandidateLayout>
      <Openning />
      <Benefit />
      <FeaturedJobs />
      <LatestJobs />
      <InspirationalSection />
      <PostJobCTA />

    </CandidateLayout>
  )
}

export default HomePage
