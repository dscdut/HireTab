import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, MessageCircle } from 'lucide-react'

const ContactSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-4 sm:space-y-5 lg:col-span-1 xl:col-span-2"
    >
      {/* Map Section */}
      <div className="overflow-hidden bg-gray-200 border-2 border-gray-100 shadow-2xl rounded-2xl">
        <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96 rounded-t-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.7340250120264!2d108.25065207500269!3d15.975260284690632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142108997dc971f%3A0x1295cb3d313469c9!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiB2w6AgVHJ1eeG7gW4gdGjDtG5nIFZp4buHdCAtIEjDoG4sIMSQ4bqhaSBo4buNYyDEkMOgIE7hurVuZw!5e0!3m2!1svi!2s!4v1757258957997!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
            className="rounded-t-2xl"
          ></iframe>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-2xl">
            <div className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Background blur effect */}
                <div className="absolute inset-0 border bg-white/10 backdrop-blur-sm rounded-xl border-white/20"></div>

                <div className="relative p-4 space-y-3">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 border rounded-lg bg-blue-500/20 backdrop-blur-sm border-blue-400/30">
                      <MapPin className="w-6 h-6 text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="flex items-center mb-1 text-lg font-bold text-white">
                        Hiretab Headquarters
                        <div className="w-2 h-2 ml-2 bg-green-400 rounded-full animate-pulse"></div>
                      </h4>
                      <p className="text-sm leading-relaxed text-gray-200">
                        470 Tran Đai Nghia, Ngu Hanh Son, Da Nang
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="p-4 bg-white border border-gray-100 shadow-xl sm:p-6 rounded-2xl sm:rounded-3xl">
        <h3 className="flex items-center mb-4 text-lg font-bold text-gray-900 sm:mb-6 sm:text-xl">
          <MessageCircle className="w-5 h-5 mr-2 text-blue-600 sm:w-6 sm:h-6 sm:mr-3" />
          Quick Answers
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="py-2 pl-3 border-l-4 border-blue-500 rounded-r-lg sm:py-3 sm:pl-4 bg-blue-50">
            <h4 className="mb-1 text-sm font-bold text-gray-900 sm:text-base">
              Response Time
            </h4>
            <p className="text-xs text-gray-700 sm:text-sm">
              We respond within 24 hours on business days.
            </p>
          </div>
          <div className="py-2 pl-3 border-l-4 border-green-500 rounded-r-lg sm:py-3 sm:pl-4 bg-green-50">
            <h4 className="mb-1 text-sm font-bold text-gray-900 sm:text-base">
              Phone Support
            </h4>
            <p className="text-xs text-gray-700 sm:text-sm">
              Available Mon-Fri, 8AM to 6PM EST.
            </p>
          </div>
          <div className="py-2 pl-3 border-l-4 border-purple-500 rounded-r-lg sm:py-3 sm:pl-4 bg-purple-50">
            <h4 className="mb-1 text-sm font-bold text-gray-900 sm:text-base">
              Emergency Support
            </h4>
            <p className="text-xs text-gray-700 sm:text-sm">
              Critical issues are handled 24/7.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactSidebar
