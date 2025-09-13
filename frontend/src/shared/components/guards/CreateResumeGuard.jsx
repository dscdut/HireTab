import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768 // px - mobile and below

export default function CreateResumeGuard({ children }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setIsSmallScreen(width < MOBILE_BREAKPOINT)
      setIsLandscape(width > height)
      setIsLoading(false)
    }

    // Check immediately
    checkScreenSize()

    // Listen for window resize and orientation changes
    const handleResize = () => {
      checkScreenSize()
    }

    const handleOrientationChange = () => {
      // Small delay to account for browser UI changes
      setTimeout(checkScreenSize, 200)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show guard if screen is small AND not in landscape mode
  if (isSmallScreen && !isLandscape) {
    return (
      <div className="fixed inset-0 z-50 bg-blue-50">
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-sm transform animate-fade-in">
            {/* Logo/Icon */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">HireTab</h1>
              <div className="w-12 h-0.5 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
              <div className="mb-6">
                {/* Rotation Animation */}
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-amber-100 rounded-lg flex items-center justify-center animate-bounce">
                    <svg 
                      className="w-8 h-8 text-amber-600 transform rotate-90 transition-transform duration-1000" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Rotate Your Device
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  The Resume Builder works best in landscape mode. Please rotate your device horizontally for the optimal experience.
                </p>
                
                {/* Visual indicator */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-8 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                    📱
                  </div>
                  <svg 
                    className="w-6 h-6 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                  <div className="w-12 h-8 border-2 border-blue-500 rounded-lg flex items-center justify-center bg-blue-50">
                    📱
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                  Refresh After Rotation
                </button>
              </div>

              {/* Footer Note */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Works great on phones in landscape mode
                </p>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                iPhone landscape mode is fully supported ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
