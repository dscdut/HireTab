import { motion } from 'framer-motion'
import { Search, MapPin, ChevronDown } from 'lucide-react'

const Openning = () => {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-32 pb-24 bg-white">
      {/* 
        Background Design:
        Professional abstract pattern combined with a subtle image overlay
      */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle Gradient Mesh */}
        <div
          className="absolute top-0 right-0 w-[60%] h-full opacity-40 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(70, 64, 222, 0.12) 0%, rgba(255, 255, 255, 0) 70%)'
          }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[50%] h-[80%] opacity-30 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(70, 64, 222, 0.08) 0%, rgba(255, 255, 255, 0) 70%)'
          }}
        />

        {/* Diagonal Geometric Accent */}
        <svg
          className="absolute bottom-0 right-0 w-2/3 h-full opacity-[0.03] text-[#4640DE]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M100 0 L100 100 L0 100 Z" />
        </svg>

        {/* Subtle Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />
      </div>

      <div className="container relative z-10 px-6 mx-auto lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-5">
          <div className="mb-10">
            {/* Main Visual Hierarchy: Primary Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-[#18191C] text-6xl md:text-[5.5rem] font-bold leading-[1.05] tracking-tight mb-8">
                Discover <br />
                more than <br />
                <span className="relative inline-block text-[#4640DE]">
                  5000+ Jobs
                  {/* Dynamic SVG Underline */}
                  <svg
                    className="absolute -bottom-4 left-0 w-full h-4 text-[#4640DE]/40"
                    viewBox="0 0 358 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.8 }}
                      d="M3 11C23.6667 8.33333 93.4 -0.2 181.5 5.5C269.6 11.2 334.833 11 355 10"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </motion.div>

            {/* Hierarchy: Secondary Supporting Text (Subheading) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-[#515B6F] text-xl md:text-2xl max-w-2xl mb-16 leading-relaxed font-normal"
            >
              The premium platform for job seekers exploring new career heights and startups looking for top-tier talent.
            </motion.p>

            {/* Focal Point: Search bar UI (Consistency & Simplicity) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col w-full max-w-4xl p-2 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:flex-row items-stretch rounded-2xl group transition-all duration-300 hover:shadow-[0_30px_60px_rgba(70,64,222,0.1)]"
            >
              {/* Input Group: Keywords */}
              <div className="flex items-center flex-[1.4] px-6 py-5 border-b border-gray-100 sm:border-b-0 sm:border-r border-gray-100">
                <Search className="w-6 h-6 mr-4 text-[#4640DE] shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or company"
                  className="w-full text-lg text-[#18191C] placeholder-[#7C8493] bg-transparent outline-none focus:ring-0"
                />
              </div>

              {/* Input Group: Location */}
              <div className="flex items-center flex-1 px-6 py-5">
                <MapPin className="w-6 h-6 mr-4 text-[#4640DE] shrink-0" />
                <div className="flex items-center justify-between w-full">
                  <input
                    type="text"
                    defaultValue="Florence, Italy"
                    className="w-full text-lg text-[#18191C] placeholder-[#7C8493] bg-transparent outline-none focus:ring-0"
                  />
                  <ChevronDown className="w-5 h-5 ml-2 text-[#7C8493] cursor-pointer transition-transform group-hover:translate-y-0.5" />
                </div>
              </div>

              {/* CTA Button (Clear Hierarchy) */}
              <button
                className="m-1 bg-[#4640DE] hover:bg-[#322BB3] text-white px-10 py-5 text-xl font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-[#4640DE]/20 active:scale-95 whitespace-nowrap"
              >
                Search Job
              </button>
            </motion.div>

            {/* Supporting Info: Social Proof/Keywords (Whitespace Hợp lý) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-10 flex items-center gap-2 text-base text-[#515B6F]"
            >
              <span className="font-medium">Popular :</span>
              <div className="flex flex-wrap gap-2 ml-1">
                {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-50 text-[#18191C] rounded-md border border-gray-100 hover:border-[#4640DE]/30 hover:bg-white cursor-pointer transition-all font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* New Image Column */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative"
          >
            {/* Background Decorative Element for Image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#4640DE]/10 to-transparent rounded-full blur-2xl -z-10" />

            <img
              src="https://cdn-ileinml.nitrocdn.com/QKFalZLFIBQZFyaTtYsfxzDEdLShqRXp/assets/images/optimized/rev-6caa47b/culvercareers.com/wp-content/uploads/2025/10/marketing-fall-2025-sales-person-1@2x-1024x887.webp"
              alt="Successful career professional"
              className="w-[90%] ml-20 mb-12 h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)]"
            />

            {/* Floating Info Card 1 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#18191C]">1.2k+ Hired</p>
                <p className="text-xs text-[#7C8493]">Per Month</p>
              </div>
            </motion.div>

            {/* Floating Info Card 2 */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-4 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#18191C] ml-2">5k+ Joiners</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Openning


