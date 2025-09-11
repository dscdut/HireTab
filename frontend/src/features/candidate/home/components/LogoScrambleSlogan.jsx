import HiretabLogo from '@/assets/images/hiretab-logo.png'
const LogoScrambleSlogan = ({ scrambled }) => (
  <div className="flex flex-col items-center justify-center gap-4 px-4 mb-6 sm:flex-row sm:gap-8 sm:mb-8">
    <img src={HiretabLogo} alt="HireTab Logo" className="flex-shrink-0 w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 drop-shadow-lg" />
    <span
      className="font-mono text-2xl font-extrabold tracking-widest text-blue-600 xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
      style={{ minHeight: '40px', letterSpacing: '0.1em', lineHeight: 1.1 }}
    >
      <span style={{ display: 'inline-block', minWidth: '6ch', textAlign: 'center' }}>
        {scrambled || 'HireTab'}
      </span>
    </span>
  </div>
)

export default LogoScrambleSlogan