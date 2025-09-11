import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const MOBILE_BREAKPOINT = 1024 // px - tablet and below

export default function HrMobileGuard({ children }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      setIsLoading(false)
    }

    checkScreenSize()

    const handleResize = () => {
      checkScreenSize()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-blue-50">
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-md transform animate-fade-in">
            {/* Logo/Icon */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-600 shadow-lg rounded-2xl">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">HireTab</h1>
              <div className="w-12 h-0.5 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="p-8 text-center bg-white border border-gray-100 shadow-xl rounded-2xl">
              <div className="mb-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100">
                  <svg 
                    className="w-6 h-6 text-amber-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                    />
                  </svg>
                </div>
                <h2 className="mb-3 text-xl font-semibold text-gray-900">
                  Desktop Experience Required
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  The HR Dashboard is optimized for desktop use with advanced features that require a larger screen. 
                  Please access from a desktop or laptop for the complete experience.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                    />
                  </svg>
                  Back to Home
                </Link>
                
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center w-full px-6 py-3 font-medium text-gray-700 transition-all duration-200 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                    />
                  </svg>
                  Refresh Page
                </button>
              </div>

              {/* Footer Note */}
              <div className="pt-6 mt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Minimum screen width: {MOBILE_BREAKPOINT}px required
                </p>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need help? Contact our support team
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
