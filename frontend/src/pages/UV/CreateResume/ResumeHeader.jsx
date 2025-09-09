import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown, Download } from "lucide-react"
import { Link } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import { path } from '@/core/constants/path'
import TemplateSelector from './selector/TemplateSelector'
import ColorSelector from './selector/ColorSelector'

export default function ResumeHeader({ onExport, onImport, selectedTemplate, onSelectTemplate, selectedColor, onSelectColor }) {
  const [activePopup, setActivePopup] = useState(null) // 'template', 'color', hoặc null
  const headerRef = useRef(null)

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActivePopup(null)
      }
    }

    if (activePopup) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [activePopup])

  const handleTemplateClick = () => {
    setActivePopup(activePopup === 'template' ? null : 'template')
  }

  const handleColorClick = () => {
    setActivePopup(activePopup === 'color' ? null : 'color')
  }

  const handleImportClick = () => {
    setActivePopup(null)
    document.getElementById("import-file").click()
    onImport && onImport()
  }

  const handleExportClick = () => {
    setActivePopup(null)
    onExport && onExport()
  }

  const handleTemplateSelect = (templateId) => {
    onSelectTemplate(templateId)
    setActivePopup(null) // Đóng popup sau khi chọn
  }

  const handleColorSelect = (colorId) => {
    onSelectColor(colorId)
    setActivePopup(null) // Đóng popup sau khi chọn
  }

  const closePopup = () => {
    setActivePopup(null)
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
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
              className={`text-gray-700 hover:bg-gray-100 flex items-center space-x-1 transition-colors font-medium ${activePopup === 'template' ? 'bg-gray-100' : ''
                }`}
              onClick={handleTemplateClick}
            >
              <span>TEMPLATES (8)</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${activePopup === 'template' ? 'rotate-180' : ''
                  }`}
              />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="ghost"
              className={`text-gray-700 hover:bg-gray-100 flex items-center space-x-1 transition-colors font-medium ${activePopup === 'color' ? 'bg-gray-100' : ''
                }`}
              onClick={handleColorClick}
            >
              <span>COLOURS</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${activePopup === 'color' ? 'rotate-180' : ''
                  }`}
              />
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

      {/* Popup Components */}
      {activePopup === 'template' && (
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onSelectTemplate={handleTemplateSelect}
          onClose={closePopup}
        />
      )}

      {activePopup === 'color' && (
        <ColorSelector
          selectedColor={selectedColor}
          onSelectColor={handleColorSelect}
          onClose={closePopup}
        />
      )}
    </div>
  )
}