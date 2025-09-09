import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X, User, LogOut, Search, Bell, Briefcase, Headset, Contact} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import HireTabLogo from '@/assets/images/hiretab-logo.png'
import { path } from '@/core/constants/path'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
    setUser(null)
  }

  const menuItems = [
    { label: 'Find Jobs', href: '#jobs', icon: Search },
    { label: 'Resume', href: path.template_gallery, icon: Contact },
    { label: 'Mission & Value', href: '#advice', icon: Briefcase },
    { label: 'Contact Us', href: '#about', icon: Headset }
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-white/90 backdrop-blur-sm'
      } select-none`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16 py-0' : 'h-20 py-2'
        }`}>
          
          {/* Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate(path.home)}
            tabIndex={0}
            role="button"
          >
            <img 
              src={HireTabLogo} 
              alt="HireTab" 
              className={`transition-all duration-300 ${
                isScrolled ? 'w-10 h-10' : 'w-12 h-12'
              }`} 
              draggable={false}
            />
            <div className="flex flex-col">
              <span className={`font-bold text-gray-900 transition-all duration-300 ${
                isScrolled ? 'text-xl' : 'text-2xl'
              }`}>
                Hiretab
              </span>
              <span className="-mt-1 text-xs font-medium text-blue-600">
                Your Career Partner
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="items-center hidden space-x-8 md:flex"
          >
            {menuItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="flex items-center px-3 py-2 space-x-2 font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </motion.a>
            ))}
          </motion.nav>

          {/* Right Side - Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center space-x-4"
          >
            <Button variant="secondary" className="px-6 py-2 font-bold text-white bg-blue-900 border-blue-600 font-mediu hover:bg-white hover:text-blue-600">
              <Link to='/candidate/job'>Apply Now</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header