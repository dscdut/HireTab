import { Typewriter } from 'react-simple-typewriter'

const TypewriterLoading = ({ words }) => (
  <div className="flex items-center justify-center min-h-screen px-4 bg-white">
    <div className="max-w-full font-mono text-2xl text-center text-black xs:text-3xl sm:text-4xl md:text-5xl">
      <Typewriter
        words={words}
        loop={false}
        cursor
        cursorStyle="_"
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={1000}
      />
    </div>
  </div>
)

export default TypewriterLoading 