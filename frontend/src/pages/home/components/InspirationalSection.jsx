import { motion } from 'framer-motion'

const InspirationalSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="grid items-center grid-cols-1 px-6 mx-auto max-w-7xl lg:px-8 md:grid-cols-2 gap-14">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative overflow-hidden shadow-2xl rounded-2xl group">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Technology and Innovation"
                className="object-cover w-full transition-all duration-500 max-w-7xl h-[600px] grayscale group-hover:grayscale-0"
              />
              {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            {/* Quote overlay */}
            <div className="absolute text-white bottom-6 left-6 right-6">
              <p className="text-2xl italic font-bold">
                "The future belongs to those who learn more skills and combine them in creative ways."
              </p>
              <p className="mt-2 text-lg opacity-80">- Robert Greene</p>
            </div>
          </div>
        </motion.div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-6 text-4xl font-extrabold text-gray-900">
            Your Tech Career <br />
            <span className="text-blue-600">Starts Here</span>
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            At Hiretab, we believe technology transforms lives. Whether you're a seasoned developer or just starting your journey, we're here to connect you with opportunities that match your passion.
          </p>
          
          <div className="p-6 mb-8 bg-white border-l-4 border-blue-600 shadow-lg rounded-xl">
            <blockquote className="mb-4 text-xl italic font-medium text-gray-800">
              "Technology is not just about computers and code. It's about solving problems, creating possibilities, and building the future we want to live in."
            </blockquote>
            <cite className="font-semibold text-blue-600">- Hiretab Philosophy</cite>
          </div>

          <ul className="mb-8 space-y-4 font-medium text-gray-700">
            <li className="flex items-center">
              <span className="mr-3 text-blue-600">💻</span>
              Connect with innovative tech companies
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-blue-600">🚀</span>
              Access cutting-edge projects and opportunities
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-blue-600">🤝</span>
              Build your professional network in tech
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-blue-600">📈</span>
              Grow your skills with top-tier companies
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

export default InspirationalSection
