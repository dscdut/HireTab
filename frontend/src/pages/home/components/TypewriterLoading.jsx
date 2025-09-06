import { Typewriter } from 'react-simple-typewriter'

const TypewriterLoading = ({ words }) => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="text-black text-5xl font-mono min-w-[500px] text-center">
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