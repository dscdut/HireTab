import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const quickLinks = [
    { label: 'About Us', href: '#' },
    { label: 'Find Jobs', href: '#' },
    { label: 'Post Jobs', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ]
  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#' },
    { icon: <Instagram className="w-5 h-5" />, href: '#' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#' },
    { icon: <Twitter className="w-5 h-5" />, href: '#' },
  ]
  return (
    <footer className="text-gray-300 bg-gray-900">
      <div className="container px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo + Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4 text-2xl font-bold text-white">HIretab</h3>
            <p className="mb-4 text-gray-400">Your Career Partner</p>
            <p className="mb-6 text-sm leading-relaxed">
              Connecting talent with opportunities. Building the future of recruitment through innovation and trust.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Liên hệ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-4 text-lg font-semibold text-white">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>contact@hiretab.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Da Nang City, Vietnam</span>
              </li>
            </ul>
          </motion.div>

          {/* Truy cập nhanh */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-4 text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="transition-colors hover:text-blue-400 hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Liên kết */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-4 text-lg font-semibold text-white">For Companies</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-blue-400 hover:underline">
                  Post Jobs
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400 hover:underline">
                  Search Candidates
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400 hover:underline">
                  Employer Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-blue-400 hover:underline">
                  Pricing Plans
                </a>
              </li>
            </ul>
            
            <h4 className="mt-6 mb-4 text-lg font-semibold text-white">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 transition-colors hover:text-blue-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 mt-12 text-center border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <p className="mb-2 md:mb-0">
              &copy; {new Date().getFullYear()} HIretab LLC Company. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Connecting talent with opportunities since 2024
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer