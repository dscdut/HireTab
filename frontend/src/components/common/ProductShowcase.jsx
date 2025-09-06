import { motion } from 'framer-motion'
import localismImg from '@/assets/images/localism.png'

const products = [
  {
    name: 'Unigo',
    description: 'A simulation system for the map of University of Science and Technology - The University of Danang',
    image: 'https://dut.gdsc.dev/static/media/uniGO.5edcd2ae7021100c7ee3.jpg',
  },
  {
    name: 'BeeBee Travel',
    description: 'A B2B platform connecting businesses providing travel services',
    image: 'https://dut.gdsc.dev/static/media/BeeBeeTravel.65869692647602915857.png',
  },
  {
    name: 'Provo',
    description: 'An English learning ecosystem offering services such as vocabulary learning and IELTS Writing correction support',
    image: 'https://dut.gdsc.dev/static/media/PROVO.459c9036bf02b367496a.png',
  },
  {
    name: 'GDSC - DUT URL Shortener',
    description: 'A link shortening tool developed by GDSC - DUT',
    image: 'https://dut.gdsc.dev/static/media/url-shortener.f382a0e4bdc3c1c1efa7.png',
  },
  {
    name: 'Event Cookbook',
    description: 'Event organizing handbook',
    image: 'https://dut.gdsc.dev/static/media/Event-Cookbook.5b78a2ac2c1656b62cda.png',
  },
  {
    name: 'Smartfood',
    description: 'An app that suggests recipes based on available ingredients',
    image: 'https://dut.gdsc.dev/static/media/SMARTFOOD.12662b2786ca3b7f1ecb.png',
  },
  {
    name: 'MyEvents',
    description: 'Event management application',
    image: 'https://dut.gdsc.dev/static/media/MyEvents.f743adeafa65fdb29367.png',
  },
  {
    name: 'HappyChild',
    description: 'A platform supporting parents in early detection, assessment, and upbringing of autistic children',
    image: 'https://dut.gdsc.dev/static/media/HappyChild.33cab0594199f7f210ab.jpg',
  },
  {
    name: 'BloodBond',
    description: 'A platform supporting blood donation activities',
    image: 'https://dut.gdsc.dev/static/media/BloodBond.3c2df1bc8339a066f9bd.jpg',
  },
  {
    name: 'SharingHub',
    description: 'An app supporting charity activities',
    image: 'https://dut.gdsc.dev/static/media/url-shortener.f382a0e4bdc3c1c1efa7.png',
  },
  {
    name: 'HireTab',
    description: 'An intelligent recruitment platform using AI to analyze and evaluate candidate profiles',
    image: 'https://dut.gdsc.dev/static/media/url-shortener.f382a0e4bdc3c1c1efa7.png',
  },
  {
    name: 'Localism',
    description: 'A platform connecting local communities with nearby activities and events',
    image: localismImg,
  }
]

const ProductShowcase = () => {
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
          <h2 className="mb-4 text-6xl font-bold text-gray-900">Product Showcase</h2>
          <p className="text-3xl text-gray-600">
            Some outstanding products we have built
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: false }}
              className="flex flex-col items-center text-center transition-all duration-300 border border-gray-200 shadow-md cursor-pointer group p-7 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-2xl hover:border-blue-500"
              whileHover={{ y: -10, scale: 1.04 }}
            >
              <div className="flex items-center justify-center mb-5 overflow-hidden bg-gray-200 w-28 h-28 rounded-xl">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">{product.name}</h3>
              <p className="text-base font-medium text-gray-700">{product.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductShowcase