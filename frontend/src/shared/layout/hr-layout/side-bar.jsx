import { Link, useLocation, useNavigate } from 'react-router-dom'
import { matchPath } from 'react-router'
import { ChevronLeft, ChevronRight, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { path } from '@/core/constants/path'
import { hrLinks, candidateLinks, settingsBtn, helpCenterBtn, hrDashboard } from '@/core/constants/general.const'
import useToggleSideBar from '@/core/store'

const SidebarLink = ({ link, isCollapsed }) => {
  const location = useLocation()

  const baseClasses =
    'flex items-center gap-3 font-medium text-base rounded-lg py-3 transition-all duration-300'
  const collapsedClasses = isCollapsed ? 'justify-center px-2' : 'px-6'
  
  // Check if the current URL matches any path in link.path
  const isActive = Array.isArray(link.path)
    ? link.path.some((path) => matchPath({ path, end: true }, location.pathname))
    : matchPath({ path: link.path, end: true }, location.pathname)

  const activeClasses = isActive
    ? 'bg-blue-600 text-white shadow-md font-semibold'
    : 'hover:text-blue-600 hover:bg-blue-50'

  // Use the first path in the array for the Link's "to" prop, or the single path
  const linkPath = Array.isArray(link.path) ? link.path[0] : link.path

  return (
    <Link to={linkPath} className={`${baseClasses} ${collapsedClasses} ${activeClasses}`}>
      <span>{link.icon}</span>
      {!isCollapsed && <span>{link.title}</span>}
    </Link>
  )
}

const ControlButtons = ({ link, isCollapsed }) => {
  const location = useLocation()

  const baseClasses =
    'flex items-center gap-3 font-medium text-base rounded-lg py-3 transition-all duration-300'
  const collapsedClasses = isCollapsed ? 'justify-center px-2' : 'px-6'
  
  // Check if the current URL matches any path in link.path
  const isActive = Array.isArray(link.path)
    ? link.path.some((path) => matchPath({ path, end: true }, location.pathname))
    : matchPath({ path: link.path, end: true }, location.pathname)

  const activeClasses = isActive
    ? 'bg-blue-600 text-white shadow-md font-semibold'
    : 'hover:text-blue-600 hover:bg-blue-50'

  // Use the first path in the array for the Link's "to" prop, or the single path
  const linkPath = Array.isArray(link.path) ? link.path[0] : link.path

  return (
    <Link to={linkPath} className={`${baseClasses} ${collapsedClasses} ${activeClasses}`}>
      <span>{link.icon}</span>
      {!isCollapsed && <span>{link.title}</span>}
    </Link>
  )
}

const UserProfile = ({ isCollapsed }) => {
  const [user, setUser] = useState({ name: '', avatar: null })
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileMenuOpen])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser({ name: '', avatar: null })
    navigate(path.login, { replace: true })
  }

  if (isCollapsed) {
    return (
      <div className="p-3 mt-auto border-t border-gray-200">
        <div className="relative flex justify-center profile-menu-container">
          <div
            className="flex items-center justify-center w-10 h-10 overflow-hidden text-white transition-colors bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>

          {isProfileMenuOpen && (
            <div className="absolute left-0 z-50 w-48 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg bottom-full">
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || 'Guest'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  HR Management
                </p>
              </div>
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 transition-colors rounded-md hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 mt-auto border-t border-gray-200">
      <div className="relative profile-menu-container">
        <div
          className="flex items-center gap-3 px-3 py-3 transition-colors rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        >
          <div className="flex items-center justify-center w-10 h-10 overflow-hidden text-white bg-blue-600 rounded-full">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name || 'Guest'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              HR Management
            </p>
          </div>
        </div>

        {isProfileMenuOpen && (
          <div className="absolute left-0 right-0 z-50 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg bottom-full">
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 transition-colors rounded-md hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Logo = ({ isCollapsed }) => (
  <Link
    to={path.hr.hr_dashboard}
    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 ml-6'}`}
  >
    {!isCollapsed && (
      <div>
        <div className="text-2xl font-bold">
          <span className="text-blue-600">Dash</span>
          <span className="text-purple-600">Board</span>
        </div>
        <div className="-mt-1 text-xs font-medium text-gray-500">
          HR Management System
        </div>
      </div>
    )}
  </Link>
)

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useToggleSideBar()

  // Combine all links
  const allLinks = [...hrDashboard, ...hrLinks, ...candidateLinks]
  const allButtons = [...settingsBtn, ...helpCenterBtn]

  return (
    <div className={`px-3 py-3 bg-[#FCFCFC] ${sidebarOpen ? 'w-20' : 'w-64'} transition-all duration-300 flex flex-col h-screen`}>
      <div className="flex items-center gap-2 mb-4">
        <Logo isCollapsed={sidebarOpen} />
        <button
          onClick={toggleSidebar}
          className={`ml-auto ${sidebarOpen ? 'mr-1' : ''}`}
        >
          {sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Main navigation links */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        {allLinks.map((link) => (
          <SidebarLink
            key={link.title}
            link={link}
            isCollapsed={sidebarOpen}
          />
        ))}
      </div>

      {/* Divider line */}
      <div className="my-3 border-t border-gray-200"></div>

      {/* Settings section */}
      <div className="space-y-1">
        {!sidebarOpen && (
          <div className="px-6 py-2">
            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              SETTINGS
            </p>
          </div>
        )}

        {allButtons.map((link) => (
          <ControlButtons
            key={link.title}
            link={link}
            isCollapsed={sidebarOpen}
          />
        ))}
      </div>

      <UserProfile isCollapsed={sidebarOpen} />
    </div>
  )
}

export default Sidebar