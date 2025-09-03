import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const Contact = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0f172a] via-[#3e6196] to-[#0247c7] text-white">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="mb-6 text-5xl font-extrabold text-white drop-shadow-lg">
            Unbox your growth
          </h2>
          <p className="mb-10 text-2xl font-medium text-white">
            Ready to break through with us? Apply your CV now!!!
          </p>
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.12, y: -8 }}
              animate={{ y: [0, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            >
              <Button
                size="lg"
                variant="outline"
                className="text-[#0247c7] border-2 border-[#0247c7] bg-white shadow-lg hover:bg-[#0247c7] hover:text-white hover:scale-110 transition-all duration-200 text-xl px-10 py-6 font-bold"
                onClick={() => window.open('mailto:hi@hiretab.dev', '_blank')}
              >
                Contact Us
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
