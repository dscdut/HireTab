import { useState, useEffect } from 'react'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'
import TypewriterLoading from '@/components/landing/TypewriterLoading'
import LoadingTerminal from '@/components/landing/LoadingTerminal'
import LogoScrambleSlogan from '@/components/landing/LogoScrambleSlogan'
import ProductShowcase from '@/components/landing/ProductShowcase'

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

  // useEffect(() => {
  //   if (step === 0) {
  //     setTimeout(() => setStep(1), 1800)
  //   } else if (step === 1) {
  //     let count = 0
  //     const maxLogs = 10
  //     const interval = setInterval(() => {
  //       setLogs((prev) => [...prev, getRandomLog()])
  //       count++
  //       if (count >= maxLogs) {
  //         clearInterval(interval)
  //         setTimeout(() => setStep(2), 800)
  //       }
  //     }, 150)
  //     return () => clearInterval(interval)
  //   } else if (step === 2) {
  //     const target = 'GDGoC'
  //     let progress = 0
  //     setShowSlogan(false)
  //     const scrambleInterval = setInterval(() => {
  //       progress++
  //       setScrambled(scramble(target, progress))
  //       if (progress >= target.length) {
  //         clearInterval(scrambleInterval)
  //         setTimeout(() => setShowSlogan(true), 600)
  //         setTimeout(() => setStep(3), 1800)
  //       }
  //     }, 90)
  //     return () => clearInterval(scrambleInterval)
  //   }
  // }, [step])

  // if (step === 0) {
  //   return <TypewriterLoading words={['npm install hiretab 🚀']} />
  // }

  // if (step === 1) {
  //   return <LoadingTerminal logs={logs} />
  // }

  // if (step === 2) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-white">
  //       <LogoScrambleSlogan scrambled={scrambled} />
  //       <span
  //         className={`text-yellow-400 text-4xl sm:text-5xl font-bold font-mono transition-opacity duration-700 text-center ${showSlogan ? 'opacity-100' : 'opacity-0'}`}
  //         style={{ minHeight: 60, textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
  //       >
  //         By Community For Community
  //       </span>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ProductShowcase />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
