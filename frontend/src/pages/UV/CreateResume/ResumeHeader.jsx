import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown, Download } from "lucide-react"
import { Link } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import { path } from '@/core/constants/path'

export default function ResumeHeader({ onTemplateClick, onColorClick, onExport, onImport }) {
  const handleImportClick = () => {
    document.getElementById("import-file").click()
  }

  return (
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
            className="text-gray-700 hover:bg-gray-100 flex items-center space-x-1 transition-colors font-medium"
            onClick={onTemplateClick}
          >
            <span>TEMPLATES (3)</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="ghost"
            className="text-gray-700 hover:bg-gray-100 flex items-center space-x-1 transition-colors font-medium"
            onClick={onColorClick}
          >
            <span>COLOURS</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Action buttons */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 transition-colors font-medium" onClick={onExport}>
            EXPORT
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 transition-colors font-medium" onClick={handleImportClick}>
            IMPORT
          </Button>
        </motion.div>

      </motion.div>
    </motion.header>
  )
}