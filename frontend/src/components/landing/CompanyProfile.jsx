const CompanyProfile = ({ description, technologies }) => {
    return (
      <div className="bg-white px-10 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Company Profile - 8 columns */}
          <div className="col-span-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Profile</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{description}</p>
      
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  <span>twitter.com/stripe</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  <span>facebook.com/StripeHQ</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>linkedin.com/company/stripe</span>
                </a>
              </div>
            </div>
          </div>
  
          {/* Tech Stack - 4 columns */}
          <div className="col-span-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tech stack</h2>
            <p className="text-gray-600 mb-6">Learn about the technology and tools that Stripe uses.</p>
  
            <div className="grid grid-cols-2 gap-3 mb-6">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-sm font-medium text-gray-700">{tech.name}</span>
                </div>
              ))}
            </div>
  
            <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              View tech stack
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  export default CompanyProfile
  