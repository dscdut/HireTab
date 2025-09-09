import { AlertCircle, RefreshCw, Home } from 'lucide-react'

const ErrorState = ({ 
  type = 'general',
  title,
  message,
  onRetry,
  onGoHome,
  fullScreen = false,
  className = ''
}) => {
  const errorConfig = {
    general: {
      icon: AlertCircle,
      defaultTitle: 'Something went wrong',
      defaultMessage: 'Please try again or contact support if the problem persists.',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600'
    },
    network: {
      icon: AlertCircle,
      defaultTitle: 'Connection Error',
      defaultMessage: 'Please check your internet connection and try again.',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    notFound: {
      icon: AlertCircle,
      defaultTitle: 'Page Not Found',
      defaultMessage: 'The page you are looking for does not exist.',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    },
    unauthorized: {
      icon: AlertCircle,
      defaultTitle: 'Access Denied',
      defaultMessage: 'You do not have permission to access this resource.',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  }

  const config = errorConfig[type] || errorConfig.general
  const Icon = config.icon

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100'
    : 'flex items-center justify-center min-h-screen w-full'

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="max-w-md p-8 text-center bg-white border shadow-lg rounded-2xl border-slate-200 animate-bounce-in">
        {/* Icon */}
        <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full ${config.iconBg} animate-bounce-icon`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="mb-3 text-xl font-semibold text-slate-900 animate-fade-in-up">
          {title || config.defaultTitle}
        </h3>

        {/* Message */}
        <p className="mb-6 leading-relaxed text-slate-600 animate-fade-in-up animation-delay-100">
          {message || config.defaultMessage}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center animate-fade-in-up animation-delay-200">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-105 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 hover:scale-105 active:scale-95"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-50px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bounce-icon {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .animate-bounce-icon {
          animation: bounce-icon 2s infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  )
}

export default ErrorState
