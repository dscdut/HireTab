import { path } from '@/core/constants/path'
import { Link } from 'react-router-dom'

const Logo = ({ className = '' }) => {
  return (
    <Link to={path.home} className={`flex items-center gap-4 ml-10 ${className}`}>
      <img
        src="https://adminvov1.vov.gov.vn/UploadImages/vov1/2016/thang_5/TCMR.jpg?w=100%"
        alt="logo"
        className="w-24 h-10"
      />
    </Link>
  )
}

const TopBar = () => {
  return (
    <header className="flex items-center justify-between px-5 py-4 bg-[#FCFCFC]">
      <div className="flex items-center gap-[82px] flex-1">
        <Logo />
      </div>
    </header>
  )
}

export default TopBar
