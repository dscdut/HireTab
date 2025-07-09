import { hrLinks, candidateLinks } from '@/core/constants/general.const'
import { path } from '@/core/constants/path'
import { Link, useLocation } from 'react-router-dom'

const SidebarLink = ({ link, isActive }) => {
  const baseClasses =
    'flex items-center gap-4 font-medium text-base rounded-xl py-4 px-10 transition-all duration-300'
  const activeClasses = isActive ? 'bg-primary text-white' : 'hover:text-primary'

  return (
    <Link to={link.path} className={`${baseClasses} ${activeClasses}`}>
      <span>{link.icon}</span>
      <span>{link.title}</span>
    </Link>
  )
}

const Logo = () => (
  <Link
    to={path.hr.job_posting}
   
  >
    <div className="ml-10">
      <div className="text-2xl font-bold">
        <span className="text-blue-600">Dash</span>
        <span className="text-purple-600">Board</span>
      </div>
      <div className="text-xs text-gray-500 font-medium -mt-1">
        HR Management System
      </div>
    </div>
  </Link>
)

const Sidebar = () => {
  const { pathname } = useLocation()

  // Gộp tất cả links lại
  const allLinks = [...hrLinks, ...candidateLinks]

  return (
    <div className="px-4 py-4 bg-[#FCFCFC] w-64">
      <div className="flex items-center mb-5">
        <Logo />
      </div>
      <div>
        {allLinks.map(link => (
          <SidebarLink
            key={link.title}
            link={link}
            isActive={pathname.startsWith(link.path)}
          />
        ))}
      </div>
    </div>
  )
}

export default Sidebar