import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { ChevronDown, Download } from "lucide-react"
import { Link } from 'react-router-dom'
import Logo from '@/shared/components/common/Logo'
import { path } from '@/core/constants/path'
import { useNavigate } from 'react-router-dom'

export default function ResumeHeader({ onExport, onImport, onTemplateClick, onColorClick }) {
  const headerRef = useRef(null)
  const navigate = useNavigate()

  // Đóng popup khi click ra ngoài (nếu cần, nhưng vì selector ở parent, có thể xóa nếu không dùng)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        // Có thể gọi onTemplateClick() hoặc onColorClick() nếu cần reset, nhưng không bắt buộc
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleImportClick = () => {
    document.getElementById("import-file").click()
    onImport && onImport()
  }

  const handleExportClick = () => {
    onExport && onExport()
  }

  return (
    <div ref={headerRef} className="relative">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white/95 backdrop-blur-md text-gray-800 px-6 py-3 flex items-center justify-between shadow-lg border-b border-gray-200"
      >
        {/* Logo */}
        <motion.div
          onClick={() => navigate(path.candidate.home, { replace: true })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Logo className="w-15 h-10" />
        </motion.div>

        {/* Right side navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center space-x-2"
        >
          {/* Template and Color buttons */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="ghost"
              className="text-gray-700 hover:bg-gray-100 flex items-center space-x-1 transition-colors font-medium"
              onClick={onTemplateClick}  // Sử dụng prop từ parent
            >
              <span>TEMPLATES (8)</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="ghost"
              className="text-gray-700 hover:bg-gray-100 flex items-center space-x-1 transition-colors font-medium"
              onClick={onColorClick}  // Sử dụng prop từ parent
            >
              <span>COLOURS</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Action buttons */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="ghost"
              className="text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              onClick={handleExportClick}
            >
              EXPORT
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="ghost"
              className="text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              onClick={handleImportClick}
            >
              IMPORT
            </Button>
          </motion.div>
        </motion.div>
      </motion.header>
    </div>
  )
}