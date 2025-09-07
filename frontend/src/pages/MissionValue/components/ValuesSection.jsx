import React from 'react'
import { motion } from 'framer-motion'
import {
  Lightbulb,
  HandHeart,
  Shield,
  Globe,
  Award,
  TrendingUp
} from 'lucide-react'

const ValuesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const values = [
    {
      title: "Innovation First",
      description: "We continuously push boundaries to create cutting-edge solutions that transform how people find careers and companies discover talent.",
      icon: Lightbulb,
      gradient: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      delay: 0.1
    },
    {
      title: "Human Connection",
      description: "Beyond algorithms and data, we prioritize authentic human connections that lead to meaningful professional relationships.",
      icon: HandHeart,
      gradient: "from-pink-500 to-rose-600",
      bgColor: "bg-rose-50",
      delay: 0.2
    },
    {
      title: "Trust & Transparency",
      description: "We build trust through transparent processes, honest communication, and reliable platform security that protects all users.",
      icon: Shield,
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      delay: 0.3
    },
    {
      title: "Global Impact",
      description: "Our vision extends worldwide, creating opportunities that transcend geographical boundaries and cultural differences.",
      icon: Globe,
      gradient: "from-blue-500 to-sky-600",
      bgColor: "bg-blue-50",
      delay: 0.4
    },
    {
      title: "Excellence Driven",
      description: "We pursue excellence in every interaction, feature, and outcome, setting new standards for recruitment platforms.",
      icon: Award,
      gradient: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-50",
      delay: 0.5
    },
    {
      title: "Growth Mindset",
      description: "We foster continuous learning, adaptation, and growth for our users, partners, and our platform ecosystem.",
      icon: TrendingUp,
      gradient: "from-sky-500 to-blue-600",
      bgColor: "bg-sky-50",
      delay: 0.6
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="px-6 mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4 block">
              Our Values
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values shape every decision we make and every feature we build, ensuring that HireTab remains true to its mission of connecting exceptional talent with outstanding opportunities.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5
              }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="relative p-8 z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${value.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-8 h-8 bg-gradient-to-r ${value.gradient} rounded-lg flex items-center justify-center`}>
                    <value.icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {value.title}
                </h3>

                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {value.description}
                </p>
              </div>

              {/* Subtle border gradient on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}
                   style={{ padding: '1px', margin: '-1px' }}>
                <div className="w-full h-full bg-white rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ValuesSection
