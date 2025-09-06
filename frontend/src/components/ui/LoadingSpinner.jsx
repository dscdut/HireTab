import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'default', 
  message = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
      <div className="relative">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
        
        {/* Main spinner container */}
        <div className="relative p-8 border shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl border-white/20">
          <div className="text-center">
            {/* Spinner with multiple animation layers */}
            <div className="relative flex items-center justify-center mb-6">
              {/* Background circle */}
              <div className={`${sizeClasses[size]} absolute rounded-full bg-gradient-to-r from-blue-100 to-blue-200 animate-spin`}></div>
              
              {/* Main spinner */}
              <Loader2 
                className={`${sizeClasses[size]} text-transparent bg-blue-600 bg-clip-text animate-spin relative z-10`}
                style={{
                  background: 'background(blue-600)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
                }}
              />
              
              {/* Rotating ring */}
              <div className={`${sizeClasses[size]} absolute border-2 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin`} style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
            </div>
            
            {message && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-700 animate-pulse">
                  {message}
                </p>
                {/* Loading dots */}
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
