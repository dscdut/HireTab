import React from 'react'
import { motion } from 'framer-motion'
import { Target, Users, Briefcase, Star, Heart } from 'lucide-react'

const HeroSection = () => {
  const stats = [
    { number: "50K+", label: "Active Job Seekers", icon: Users },
    { number: "2K+", label: "Partner Companies", icon: Briefcase },
    { number: "15K+", label: "Successful Matches", icon: Star },
    { number: "98%", label: "Satisfaction Rate", icon: Heart }
  ]

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background Elements - hidden on small screens to reduce paint */}
      <div className="absolute inset-0 hidden overflow-hidden sm:block">
        <motion.div
          className="absolute bg-blue-500 rounded-full -top-40 -right-40 w-72 h-72 mix-blend-multiply opacity-60"
          animate={{ x: [0, 60, 0], y: [0, -60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute rounded-full opacity-50 bg-sky-500 -bottom-40 -left-40 w-72 h-72 mix-blend-multiply"
          animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-indigo-500 rounded-full opacity-50 top-40 left-40 mix-blend-multiply"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 max-w-4xl px-6 mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full shadow-2xl bg-gradient-to-r from-blue-500 to-indigo-600"
        >
          <Target className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl"
        >
          Mission & Values
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8 text-xl leading-relaxed text-gray-300 md:text-2xl"
        >
          Driving the future of recruitment through innovation, trust, and human connection
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 text-center border sm:p-6 bg-white/8 rounded-xl border-white/10"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-white sm:w-8 sm:h-8" />
              <div className="text-xl font-bold text-white sm:text-2xl">{stat.number}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection
