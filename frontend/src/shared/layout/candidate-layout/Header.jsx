import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { Menu, X, Search, Briefcase, Headset, Contact } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import HireTabLogo from '@/assets/images/hiretab-logo.png'
import { path } from '@/core/constants/path'

const MENU_ITEMS = [
  { label: 'Find Jobs', href: path.candidate.job, icon: Search },
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

  const headerClasses = `fixed top-0 left-0 right-0 z-[100] transition-all duration-500 select-none ${isScrolled
    ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] py-3'
    : 'bg-transparent py-6'
    }`

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={headerClasses}
    >
      <div className="container px-6 mx-auto lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate(path.candidate.home)}
          >
            <div className="relative">
              <img
                src={HireTabLogo}
                alt="HireTab"
                className={`transition-all duration-500 object-contain ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'
                  } group-hover:scale-110`}
                draggable={false}
              />
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold tracking-tight text-[#18191C] transition-all duration-500 ${isScrolled ? 'text-xl' : 'text-2xl'
                }`}>
                Hiretab
              </span>
              <span className={`-mt-1 text-[10px] font-bold uppercase tracking-widest text-[#4640DE] transition-all duration-500 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
                }`}>
                Career Partner
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation - Centered & Premium */}
          <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 space-x-1">
            {MENU_ITEMS.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="relative px-6 py-2 text-[17px] font-bold text-[#515B6F] hover:text-[#4640DE] transition-colors duration-300 group"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span className="group-hover:-translate-x-2 transition-transform duration-300">{item.label}</span>
                </div>
                <motion.div
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#4640DE] rounded-full group-hover:w-1/2 transition-all duration-300"
                />
              </Link>
            ))}
          </nav>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 mr-2">
              <button className="text-[17px] font-bold text-[#18191C] px-5 py-2 hover:bg-gray-100/50 rounded-lg transition-all">
                Login
              </button>
            </div>

            <Button
              className="bg-[#4640DE] hover:bg-[#322BB3] text-white px-8 py-3 text-[17px] font-bold rounded-xl shadow-lg shadow-[#4640DE]/20 hover:shadow-[#4640DE]/30 transition-all duration-300 active:scale-95"
            >
              <Link to='/candidate/job'>Apply Now</Link>
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="p-2 lg:hidden text-[#18191C] hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-4 right-4 mt-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden lg:hidden"
            >
              <div className="p-4 space-y-1">
                {MENU_ITEMS.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="flex items-center p-4 space-x-4 text-base font-semibold text-[#18191C] hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-[#4640DE]">
                      <item.icon size={20} />
                    </div>
                    <span>{item.label}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-100 mt-2">
                  <Button
                    className="w-full bg-[#4640DE] py-6 text-base font-bold rounded-xl"
                  >
                    <Link to='/candidate/job'>Apply Now</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header