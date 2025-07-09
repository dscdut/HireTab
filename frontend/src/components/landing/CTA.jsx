import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const CTA = () => {
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
          <p className="mb-10 text-2xl text-white font-medium">
            Sẵn sàng bứt phá cùng chúng mình? Apply CV liền tay nhé!!!
          </p>
          <div className="flex flex-col justify-center gap-5 sm:flex-row">
            <Button
              size="lg"
              className="text-white bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] shadow-xl hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 text-xl px-10 py-6 font-bold border-0"
              onClick={() => window.open('https://forms.gle/your-apply-link', '_blank')}
            >
              Apply Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-[#fbbf24] border-[#fbbf24] hover:bg-[#fbbf24] hover:text-[#0f172a] hover:scale-105 hover:-translate-y-1 transition-all duration-200 text-xl px-10 py-6 font-bold"
              onClick={() => window.open('mailto:hi@hiretab.dev', '_blank')}
            >
              Contact Us
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA
