import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X, User, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false) // Trạng thái mở menu profile
  const [user, setUser] = useState(null) // Lưu thông tin người dùng
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
    { label: 'Home', href: '#' },
    { label: 'About', href: '#about' },
    { label: 'Events', href: '#events' },
    { label: 'Contact', href: '#contact' }
  ]

  return (
    <motion.header
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  transition={{ duration: 0.5 }}
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled
      ? 'bg-white/90 backdrop-blur-md shadow-lg'
      : 'bg-white/40 backdrop-blur-sm'
  }`}
>
      <div className="container px-4 mx-auto">
        <div className={`flex items-center justify-between transition-all duration-300
      ${isScrolled ? 'h-16 py-0' : 'h-24 py-4'}`}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center transition-all duration-300"
          >
    <Logo className={`transition-all duration-300 ${isScrolled ? 'w-10 h-10' : 'w-16 h-16'}`} />
          </motion.div>

          {/* Desktop Menu */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="items-center hidden space-x-10 md:flex"
          >
            {menuItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                className="text-gray-700 transition-colors hover:text-blue-600 text-xl font-bold px-2 py-1"
              >
                {item.label}
              </motion.a>
            ))}
            <a href="#apply" className="ml-4">
              <Button className="bg-blue-600 text-white hover:bg-white hover:text-blue-500 font-bold px-8 py-5 rounded-full shadow-md transition-all text-lg">
                Apply Now
              </Button>
            </a>
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header