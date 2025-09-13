// import { Check, Mail, SkipForward, X } from "lucide-react"

// export default function EmailConfirmationModal({ 
//   open, 
//   onClose, 
//   onSendEmail, 
//   onSkipEmail,
//   onCancel,
//   status,
//   candidateCount = 1,
//   isLoading = false,
// }) {
//   if (!open) return null
  
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//       <div className="w-full max-w-md p-8 mx-4 bg-white shadow-2xl rounded-2xl">
//         <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50">
//           <Mail className="w-8 h-8 text-blue-600" />
//         </div>
        
//         <div className="mb-8 text-center">
//           <h3 className="mb-2 text-xl font-semibold text-gray-900">
//             Update Status to {status}
//           </h3>
//           <p className="leading-relaxed text-gray-600">
//             You're about to move {candidateCount} candidate{candidateCount > 1 ? 's' : ''} to{' '}
//             <span className="font-semibold text-gray-800">{status}</span>. 
//             Would you like to send a notification email?
//           </p>
//         </div>

//         <div className="space-y-3">
//           {/* Send Email Button */}
//           <button
//             onClick={onSendEmail}
//             disabled={isLoading}
//             className="flex items-center justify-center w-full px-6 py-3 font-medium text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Mail className="w-4 h-4 mr-2" />
//             {isLoading ? (
//               <>
//                 <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
//                 Processing...
//               </>
//             ) : (
//               "Yes, send email & update status"
//             )}
//           </button>

//           {/* Skip Email Button */}
//           <button
//             onClick={onSkipEmail}
//             disabled={isLoading}
//             className="flex items-center justify-center w-full px-6 py-3 font-medium text-gray-700 transition-all duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <SkipForward className="w-4 h-4 mr-2" />
//             Skip email, just update status
//           </button>

//           {/* Cancel Button */}
//           <button
//             onClick={onCancel}
//             disabled={isLoading}
//             className="flex items-center justify-center w-full px-6 py-3 font-medium text-gray-500 transition-all duration-200 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <X className="w-4 h-4 mr-2" />
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }