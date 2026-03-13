import { motion } from 'framer-motion'
import { ChevronRight, Globe, Users, Award, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const Openning = () => {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-32 pb-24 bg-[#FAFBFF]">
      {/* 
        Background Design:
        Modern clean geometric patterns instead of blurred blobs
      */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] md:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(#3129B8 2px, transparent 2px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Geometric abstract shapes (Symbols/Ký hiệu) */}
        <div className="absolute top-[15%] right-[10%] border border-[#3129B8]/10 w-[40vw] h-[40vw] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] border border-[#3129B8]/10 w-[50vw] h-[50vw] rounded-full" />

        {/* Cross mark patterns */}
        <div className="absolute top-[25%] left-[8%] text-[#3129B8]/10 font-black text-2xl">+</div>
        <div className="absolute bottom-[20%] right-[35%] text-[#3129B8]/10 font-black text-2xl">+</div>
        <div className="absolute top-[10%] right-[40%] text-[#3129B8]/10 font-black text-2xl">+</div>
        <div className="absolute bottom-[40%] left-[5%] text-[#3129B8]/10 font-black text-2xl">+</div>

        {/* Left balance shape abstract */}
        <div className="absolute top-[40%] left-[-5%] w-[20vw] h-[20vw] border-2 border-dashed border-[#3129B8]/10 rounded-full opacity-50" />
      </div>

      <div className="container relative z-10 px-6 mx-auto lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="mb-10 mt-12 lg:mt-10">
            {/* Employer Branding: The High-Impact Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-[#18191C] text-5xl md:text-[5rem] font-bold leading-[1.05] tracking-tight mb-8">
                Build the future <br />
                <span className="text-[#3129B8]">with HireTab</span> <br />
                starting today
              </h1>
            </motion.div>

            {/* Subtext: Focus on Culture and Value-Driven Growth */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-[#515B6F] text-base md:text-lg max-w-xl mb-12 leading-relaxed font-normal opacity-90"
            >
              We are more than a workplace. We are a community of innovators and dreamers dedicated to redefining industry standards. Join us in our journey of professional excellence and shared success.
            </motion.p>

            {/* CTAs for Specific Internal Roles - No Shadows */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mt-2"
            >
              <Link to="/candidate/job" className="bg-[#3129B8] hover:bg-[#251E91] text-white px-8 py-3.5 text-base font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center gap-2 shadow-sm">
                Explore All Jobs <ChevronRight size={18} />
              </Link>
              <button className="bg-white border border-gray-200 text-[#18191C] hover:border-gray-300 hover:bg-gray-50 px-8 py-3.5 text-base font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] shadow-sm">
                Our Culture
              </button>
            </motion.div>

            {/* Values Proof: Instead of general trust, specify internal values */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-16 flex flex-wrap items-center gap-10"
            >
            </motion.div>
          </div>

          {/* New Multi-Image Collage Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative h-[600px] w-full"
          >
            {/* Background Decorative Element for Image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#3129B8]/10 rounded-full blur-3xl -z-10" />

            {/* Image Grid */}
            <div className="relative w-full h-full">
              {/* Image 1: Main collaboration */}
              <motion.img
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.03, zIndex: 10 }}
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop"
                alt="Team collaboration"
                className="absolute top-[10%] right-[5%] w-[55%] h-[45%] object-cover rounded-[32px] border-[6px] border-white shadow-md hover:shadow-2xl transition-shadow duration-300"
              />

              {/* Image 2: Vertical modern workspace */}
              <motion.img
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                whileHover={{ scale: 1.03, zIndex: 10 }}
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
                alt="Modern workspace"
                className="absolute top-[25%] left-[5%] w-[45%] h-[55%] object-cover rounded-[32px] border-[6px] border-white shadow-md hover:shadow-2xl transition-shadow duration-300"
              />

              {/* Image 3: Small square casual/culture */}
              <motion.img
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                whileHover={{ scale: 1.03, zIndex: 10 }}
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                alt="Culture"
                className="absolute bottom-[5%] right-[15%] w-[40%] h-[35%] object-cover rounded-[32px] border-[6px] border-white shadow-md hover:shadow-2xl transition-shadow duration-300"
              />

              {/* Strategic Floating Card 1: Internal Growth */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="absolute -left-4 top-[15%] bg-white p-5 rounded-3xl shadow-[0_20px_40px_rgba(49,41,184,0.08)] border border-gray-100 flex items-center gap-4 z-20 cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-[#18191C]">200+ Team Members</p>
                  <p className="text-xs text-[#7C8493] font-semibold">Scaling for the future</p>
                </div>
              </motion.div>

              {/* Strategic Floating Card 2: Innovation Lab */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                whileHover={{ scale: 1.05, y: 5 }}
                className="absolute right-0 bottom-[10%] bg-white p-5 rounded-3xl shadow-[0_20px_40px_rgba(49,41,184,0.08)] border border-gray-100 z-20 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <img key={i} className="w-9 h-9 rounded-full border-[3px] border-white bg-gray-100" src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="Team member" />
                    ))}
                  </div>
                  <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">Active Lab</div>
                </div>
                <p className="text-xs font-black text-[#18191C]">Collaborating in Real-time</p>
                <p className="text-[10px] text-[#7C8493] font-bold">Innovation is part of our DNA</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Openning


