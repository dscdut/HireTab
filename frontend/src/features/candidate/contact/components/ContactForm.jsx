import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'
import { CONTACT_BENEFITS, INQUIRY_TYPES } from '../contactResources'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('Name', formData.name)
      formDataToSend.append('Email', formData.email)
      formDataToSend.append('Subject', formData.subject)
      formDataToSend.append('Message', formData.message)
      formDataToSend.append('Type', formData.type)

      const response = await fetch('https://formspree.io/f/mvgqyaqr', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          type: 'general'
        })
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="lg:col-span-2 xl:col-span-3"
    >
      <div className="relative p-4 overflow-hidden bg-white border-2 border-gray-100 shadow-2xl sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-50 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-50 to-transparent"></div>

        <div className="relative z-10">
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl sm:mb-4 lg:text-4xl">
              Send us a Message
            </h2>
            <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center min-h-[260px] sm:min-h-[320px] md:min-h-[420px] lg:min-h-[480px]"
            >
              <div className="flex items-center justify-center mx-auto mb-3 bg-green-100 rounded-full w-14 h-14 sm:w-16 sm:h-16 sm:mb-4 lg:w-20 lg:h-20 lg:mb-5">
                <CheckCircle className="w-8 h-8 text-green-600 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl sm:mb-3">
                Message Sent Successfully!
              </h3>
              <p className="text-sm text-gray-600 sm:text-base">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Trust Indicators */}
              <div className="grid grid-cols-1 gap-3 p-3 mt-4 sm:p-4 sm:mt-6 md:grid-cols-2 lg:grid-cols-3 bg-gray-50 rounded-2xl">
                {CONTACT_BENEFITS.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 text-blue-600 bg-blue-100 rounded-lg">
                      <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{benefit.title}</div>
                      <div className="text-xs text-gray-600">{benefit.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Enhanced Inquiry Type */}
                <div>
                  <label className="block mb-4 text-sm font-bold text-gray-900">
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                    {INQUIRY_TYPES.map((type) => (
                      <label
                        key={type.value}
                        className={`relative p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 group ${formData.type === type.value
                            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                          }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={formData.type === type.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex items-start space-x-3">
                            <div className={`p-2 sm:p-3 rounded-lg transition-all duration-200 ${formData.type === type.value
                              ? 'bg-blue-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                            }`}>
                            <type.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="mb-1 font-semibold text-gray-900">
                              {type.label}
                            </div>
                            <div className="text-sm text-gray-600">
                              {type.description}
                            </div>
                          </div>
                        </div>
                        {formData.type === type.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute w-3 h-3 bg-blue-500 rounded-full top-3 right-3"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Enhanced Form Fields */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block mb-3 text-sm font-bold text-gray-900">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all border-2 border-gray-200 outline-none sm:py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block mb-3 text-sm font-bold text-gray-900">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all border-2 border-gray-200 outline-none sm:py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-3 text-sm font-bold text-gray-900">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all border-2 border-gray-200 outline-none sm:py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-bold text-gray-900">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
          rows={5}
          className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all border-2 border-gray-200 outline-none resize-none sm:py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Enhanced Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold py-3 sm:py-5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transform sm:hover:scale-[1.02] active:scale-[0.98] shadow-md sm:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
            <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            <span className="text-sm sm:text-lg">Sending your message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
            <span className="text-sm sm:text-lg">Send Message</span>
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-sm text-center text-gray-500">
                    By sending this message, you agree to our{' '}
                    <span className="text-blue-600 cursor-pointer hover:text-blue-700">privacy policy</span>.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ContactForm