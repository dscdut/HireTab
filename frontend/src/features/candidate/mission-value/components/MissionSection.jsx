import React from 'react'
import { motion } from 'framer-motion'
import { Target, Rocket, Zap, Star } from 'lucide-react'

const MissionSection = () => {
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

  const mission = {
    title: "Our Mission",
    subtitle: "Empowering Careers, Connecting Futures",
    description: "At HireTab, we're dedicated to revolutionizing the recruitment landscape by creating meaningful connections between exceptional talent and forward-thinking companies. Our mission is to build a platform where career dreams meet opportunity, fostering professional growth and organizational success through innovation, transparency, and human-centered design.",
    icon: Target,
    gradient: "from-blue-600 via-blue-700 to-indigo-800"
  }

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="px-6 mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid items-center gap-16 lg:grid-cols-2"
        >
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="inline-flex items-center space-x-3">
              <div className={`p-4 rounded-full bg-gradient-to-r ${mission.gradient}`}>
                <mission.icon className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-wider text-gray-600 uppercase">
                {mission.title}
              </span>
            </div>

            <h2 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              {mission.subtitle}
            </h2>

            <p className="text-lg leading-relaxed text-gray-600">
              {mission.description}
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Rocket className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-gray-900">Our Commitment</h4>
                  <p className="text-sm text-gray-600">
                    We're committed to creating a platform that not only connects talent with opportunity but also nurtures professional growth and organizational success through every interaction.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="relative overflow-hidden shadow-2xl rounded-3xl">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center p-12 aspect-square bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-800"
              >
                <div className="text-center text-white">
                  <Target className="w-24 h-24 mx-auto mb-6" />
                  <h3 className="mb-4 text-2xl font-bold">Vision 2030</h3>
                  <p className="text-lg opacity-90">
                    To become the world's most trusted recruitment ecosystem, where every career journey begins with possibility.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full shadow-lg -top-6 -right-6"
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute flex items-center justify-center w-12 h-12 bg-green-500 rounded-full shadow-lg -bottom-6 -left-6"
            >
              <Star className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default MissionSection
