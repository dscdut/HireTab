import GDGOCIcon from '@/assets/icons/GDGOC.svg'

const LogoScrambleSlogan = ({ scrambled }) => (
  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8">
    <img src={GDGOCIcon} alt="GDGOC Logo" className="w-24 h-24 sm:w-28 sm:h-28 mb-4 sm:mb-0 sm:mr-8 drop-shadow-lg" />
    <span
      className="text-black text-7xl sm:text-8xl font-extrabold font-mono tracking-widest"
      style={{ minHeight: 80, letterSpacing: '0.2em', lineHeight: 1 }}
    >
      <span style={{ display: 'inline-block', minWidth: '8ch', textAlign: 'center' }}>
        {scrambled || 'GDGoC'}
      </span>
    </span>
  </div>
)

export default LogoScrambleSlogan 