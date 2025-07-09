import { motion } from 'framer-motion'
import BannerImg from '@/assets/images/banner.jpg'

const Hero = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 bg-blue-100 rounded-full w-96 h-96 mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-0 bg-purple-100 rounded-full w-96 h-96 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bg-pink-100 rounded-full -bottom-8 left-20 w-96 h-96 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="z-10 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 w-full max-w-none mx-auto sm:px-6 lg:px-8">
          {/* Left: Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col justify-center text-center md:text-left md:pl-16 max-w-2xl md:max-w-3xl"
          >
            {/* <h1 className="mb-4 lg:text-6xl md:text-xl font-extrabold text-gray-900 leading-tight">
              
            </h1> */}
            <div className="mb-6 flex flex-wrap justify-center md:justify-start items-center gap-2 text-6xl md:text-6xl font-extrabold tracking-wide drop-shadow-md">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">D</span>
              <span className="text-[#FBBC05]">G</span>
              <span className="text-[#34A853]">o</span>
              <span className="text-[#4285F4]">C</span>
              <span className="text-[#EA4335]">-</span>
              <span className="text-[#FBBC05]">D</span>
              <span className="text-[#34A853]">U</span>
              <span className="text-[#4285F4]">T</span>
            </div>
            <p className="mb-8 text-xl md:text-xl lg:text-xl text-gray-800 leading-relaxed drop-shadow-sm">
            Là một thành viên trong mạng lưới Google Developer Groups on Campus (GDGoC) toàn cầu,
              GDGoC-DUT luôn nỗ lực xây dựng một cộng đồng công nghệ lành mạnh, nơi kết nối các sinh
              viên Đại học Đà Nẵng có cùng đam mê và định hướng phát triển trong lĩnh vực
              công nghệ thông tin.
            </p>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-[1.5] flex items-center justify-center mb-8 md:mb-0"
          >
            <img
              src={BannerImg}
              alt="GDGoC-DUT Banner"
              className="h-auto object-cover rounded-3xl shadow-2xl border-4 border-white transition-transform duration-500 hover:scale-105"
              style={{background:'#f8fafc', width: '80%',}}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
