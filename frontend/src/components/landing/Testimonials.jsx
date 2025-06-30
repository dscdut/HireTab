import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Nguyen Van A',
    position: 'HR Manager',
    company: 'Tech Solutions',
    content:
      'HireTab has helped us reduce resume screening time by 70% and find high-quality candidates.',
    rating: 5
  },
  {
    name: 'Tran Thi B',
    position: 'Talent Acquisition',
    company: 'Digital Corp',
    content:
      'HireTab’s AI tool is highly intelligent, helping us find the most suitable candidates for the position.',
    rating: 5
  },
  {
    name: 'Le Van C',
    position: 'Recruitment Lead',
    company: 'Innovation Hub',
    content:
      'I’m very impressed with HireTab’s resume analysis and evaluation capabilities. It’s an excellent solution for businesses.',
    rating: 5
  }
]

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900">What Our Customers Say</h2>
          <p className="text-xl text-gray-600">
            Reviews from businesses that have used Hire Nova
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="p-6 transition-colors duration-300 rounded-xl bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="mb-6 italic text-gray-600">"{testimonial.content}"</p>
              <div>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-gray-600">
                  {testimonial.position} at {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials