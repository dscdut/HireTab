import { motion } from 'framer-motion'
import ConfirmIcon from '@/assets/icons/confirm.svg'

const ChallengesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            Share your challenges!! <br />
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Together, we will explore:
          </p>
          <ul className="space-y-4 text-gray-700 font-medium">
            <li>🚀 Opportunities to learn and develop technology skills</li>
            <li>🤝 Strategies to expand your team and connect with the tech community</li>
            <li>🧠 How to build sustainable projects that fit future trends</li>
          </ul>
          <button className="mt-8 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
            Join GDGoC
          </button>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img
            src={ConfirmIcon}
            alt="Confirm"
            className="w-full max-w-md"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default ChallengesSection
