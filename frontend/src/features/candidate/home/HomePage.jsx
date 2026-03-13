// ...existing code...
import { useState, useEffect } from "react";
import TypewriterLoading from './components/TypewriterLoading'
import LoadingTerminal from './components/LoadingTerminal'
import CandidateLayout from '@/shared/layout/candidate-layout/candidate-layout'
import Openning from './components/Openning'
import Benefit from './components/Benefit'
import InspirationalSection from './components/InspirationalSection'
import Contact from './components/Contact'
import LogoScrambleSlogan from './components/LogoScrambleSlogan'
import FeaturedJobs from "./components/FeaturedJobs";
import LatestJobs from "./components/LatestJobs";
import PostJobCTA from "./components/PostJobCTA";

const randomLogs = [
  'Installing dependencies...',
  'Fetching packages...',
  'Resolving...',
  'Building project...',
  'Compiling source...',
  'Optimizing...',
  'Done!',
  'Success: All packages installed.',
  'Running postinstall script...',
  'Cleaning up...',
  'Ready to go!',
  '✨  Done in 1.23s.',
  '✔️  Everything is up to date.',
  '🚀 Launching HireTab...',
]

const getRandomLog = () => {
  const idx = Math.floor(Math.random() * randomLogs.length)
  return randomLogs[idx]
}

const scramble = (target, progress) => {
  const chars = '!@#$%^&*()_+-=~[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return target
    .split('')
    .map((c, i) => (i < progress ? c : chars[Math.floor(Math.random() * chars.length)]))
    .join('')
}

const HomePage = () => {
  const [step, setStep] = useState(0)
  const [logs, setLogs] = useState([])
  const [scrambled, setScrambled] = useState('')
  const [showSlogan, setShowSlogan] = useState(false)

  useEffect(() => {
    if (step === 0) {
      setTimeout(() => setStep(1), 1800)
    } else if (step === 1) {
      let count = 0
      const maxLogs = 10
      const interval = setInterval(() => {
        setLogs((prev) => [...prev, getRandomLog()])
        count++
        if (count >= maxLogs) {
          clearInterval(interval)
          setTimeout(() => setStep(2), 800)
        }
      }, 150)
      return () => clearInterval(interval)
    } else if (step === 2) {
      const target = 'HireTab'
      let progress = 0
      setShowSlogan(false)
      const scrambleInterval = setInterval(() => {
        progress++
        setScrambled(scramble(target, progress))
        if (progress >= target.length) {
          clearInterval(scrambleInterval)
          setTimeout(() => setShowSlogan(true), 600)
          setTimeout(() => setStep(3), 1800)
        }
      }, 90)
      return () => clearInterval(scrambleInterval)
    }
  }, [step])

  if (step === 0) {
    return <TypewriterLoading words={['npm install hiretab 🚀']} />
  }

  if (step === 1) {
    return <LoadingTerminal logs={logs} />
  }

  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
        <LogoScrambleSlogan scrambled={scrambled} />
        <span
          className={`text-blue-400 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-mono transition-opacity duration-700 text-center ${showSlogan ? 'opacity-100' : 'opacity-0'}`}
          style={{ minHeight: '30px', textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          Your Career Partner
        </span>
      </div>
    )
  }

  return (
    <CandidateLayout>
      <Openning />
      <Benefit />
      <InspirationalSection />
      <FeaturedJobs />
      <LatestJobs />
      <PostJobCTA />
    </CandidateLayout>
  )
}
export default HomePage