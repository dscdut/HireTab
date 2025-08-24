import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://cdn.pixabay.com/photo/2017/07/25/22/54/lego-2539844_1280.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/80 to-slate-800/85"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-0 left-0 rounded-full bg-white/10 w-96 h-96 mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-0 right-0 rounded-full bg-blue-200/20 w-96 h-96 mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute rounded-full bg-purple-200/20 -bottom-8 left-20 w-96 h-96 mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="z-20 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center w-full gap-6 mx-auto text-center max-w-7xl sm:gap-8 lg:gap-12">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-6 text-center sm:space-y-8"
          >
            {/* <div className="mb-2 sm:mb-4">
              <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-100 border rounded-full shadow-lg sm:px-6 sm:py-3 sm:text-base lg:text-lg bg-white/25 backdrop-blur-md border-white/40">
                Hiretab LLC Company
              </span>
            </div> */}
            
            <h1 className="max-w-5xl text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl drop-shadow-2xl">
              <span className="text-blue-300">Connecting</span>{' '}
              <span className="text-white">talent</span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="text-white">with career</span>{' '}
              <span className="text-blue-300">opportunities</span>
            </h1>
            
            <p className="max-w-4xl text-lg font-light leading-relaxed text-gray-100 sm:text-xl md:text-xl lg:text-2xl drop-shadow-lg">
              HIretab - Leading recruitment platform, providing intelligent 
              hiring solutions for businesses and quality job opportunities 
              for candidates.
            </p>
            
            <div className="flex flex-col w-full gap-3 pt-4 sm:flex-row sm:gap-4 sm:justify-center sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 text-base font-semibold text-white transition-all duration-300 bg-blue-600 border border-blue-500 rounded-lg shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-lg hover:bg-blue-700 hover:shadow-2xl backdrop-blur-sm"
              >
                Searching for Jobs
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
