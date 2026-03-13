import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { Menu, X, Search, Briefcase, Headset, Contact } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import HireTabLogo from '@/assets/images/hiretab-logo.png'
import { path } from '@/core/constants/path'

const MENU_ITEMS = [
  { label: 'Find Jobs', href: path.candidate.job , icon: Search },
  { label: 'Resume', href: path.candidate.template_gallery, icon: Contact },
  { label: 'Mission & Value', href: path.candidate.mission, icon: Briefcase },
  { label: 'Contact Us', href: path.candidate.contact, icon: Headset }
]

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${isScrolled
    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
    : 'bg-white/90 backdrop-blur-sm'
    }`

  const containerClasses = `flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16 py-0' : 'h-20 py-2'
    }`

  const logoClasses = `transition-all duration-300 ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'
    }`

  const titleClasses = `font-bold text-gray-900 transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'
    }`

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2 }}
      className={headerClasses}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className={containerClasses}>

          {/* Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate(path.candidate.home)}
            role="button"
            tabIndex={0}
          >
            <img
              src={HireTabLogo}
              alt="HireTab"
              className={logoClasses}
              draggable={false}
            />
            <div className="flex flex-col">
              <span className={titleClasses}>Hiretab</span>
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
            {MENU_ITEMS.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="flex items-center px-3 py-2 space-x-2 font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
              >
                <item.icon className="w-4 h-4" />
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
            {/* Mobile Menu Button */}
            <button
              className="p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* Desktop Apply Button */}
            <Button
              variant="secondary"
              className="hidden px-6 py-2 font-bold text-white bg-blue-900 border-blue-600 md:block hover:bg-white hover:text-blue-600"
            >
              <Link to='/candidate/job'>Apply Now</Link>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-gray-400 rounded-xl border-1 md:hidden bg-white/95 backdrop-blur-md"
            >
              <div className="py-4 m-4 space-y-3">
                {MENU_ITEMS.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className="flex items-center px-3 py-3 space-x-3 font-medium text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.a>
                ))}

                {/* Mobile Apply Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: MENU_ITEMS.length * 0.1 }}
                  className="pt-3 border-t border-gray-200"
                >
                  <Button
                    variant="secondary"
                    className="w-full px-6 py-3 font-bold text-white bg-blue-900 border-blue-600 hover:bg-white hover:text-blue-600"
                  >
                    <Link to='/candidate/job'>Apply Now</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header