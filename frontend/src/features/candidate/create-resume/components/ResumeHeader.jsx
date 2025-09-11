import { motion } from 'framer-motion'
import { ChevronDown } from "lucide-react"
import { Button } from '@/shared/components/ui/button'
import Logo from '@/shared/components/common/Logo'

export default function ResumeHeader({ onTemplateClick, onColorClick, onExport, onImport }) {
  const handleImportClick = () => {
    document.getElementById("import-file").click()
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between px-6 py-3 text-gray-800 border-b border-gray-200 shadow-lg bg-white/95 backdrop-blur-md"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-2"
      >
        <Logo className="h-10 w-15" />
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
            className="flex items-center space-x-1 font-medium text-gray-700 transition-colors hover:bg-gray-100"
            onClick={onTemplateClick}
          >
            <span>TEMPLATES (3)</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="ghost"
            className="flex items-center space-x-1 font-medium text-gray-700 transition-colors hover:bg-gray-100"
            onClick={onColorClick}
          >
            <span>COLOURS</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Divider */}
        <div className="w-px h-6 mx-2 bg-gray-300"></div>

        {/* Action buttons */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button variant="ghost" className="font-medium text-gray-700 transition-colors hover:bg-gray-100" onClick={onExport}>
            EXPORT
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Button variant="ghost" className="font-medium text-gray-700 transition-colors hover:bg-gray-100" onClick={handleImportClick}>
            IMPORT
          </Button>
        </motion.div>

      </motion.div>
    </motion.header>
  )
}