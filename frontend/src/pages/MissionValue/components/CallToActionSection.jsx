import React from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

const CallToActionSection = () => {
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

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-4xl px-6 mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
              <Users className="w-8 h-8 text-white" />
            </div>

            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Join Our Mission
            </h2>

            <p className="mb-8 text-xl leading-relaxed text-gray-300">
              Be part of a community that's reshaping the future of work. Whether you're seeking your next opportunity or looking for exceptional talent, HireTab is where careers and possibilities converge.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToActionSection
