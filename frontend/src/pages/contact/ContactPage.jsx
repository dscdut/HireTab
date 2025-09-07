import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Users,
  Building,
  CheckCircle,
  Shield,
  Zap,
  Award,
  HeadphonesIcon,
  Globe,
  Star,
  ArrowRight
} from 'lucide-react'

const ContactPage = () => {
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
      // You can add error handling here
    } finally {
      setIsSubmitting(false)
    }
  }


  const inquiryTypes = [
    {
      value: 'General Inquiry',
      icon: <MessageCircle className="w-4 h-4" />,
      description: 'Questions about our services',
      color: 'blue'
    },
    {
      value: 'Technical Support',
      icon: <HeadphonesIcon className="w-4 h-4" />,
      description: 'Need help with the platform',
      color: 'green'
    },
    {
      value: 'Partnership',
      icon: <Building className="w-4 h-4" />,
      description: 'Business collaboration',
      color: 'purple'
    },
    {
      value: 'Feedback',
      icon: <Star className="w-4 h-4" />,
      description: 'Share your thoughts',
      color: 'orange'
    }
  ]

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: '24h Response',
      description: 'Quick response guaranteed'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Secure & Private',
      description: 'Your data is protected'
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Expert Support',
      description: 'Professional assistance'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <Header />

      <main>
        {/* Main Content: Form + Sidebar */}
        <section className="py-8 my-8 overflow-hidden sm:py-12 sm:my-12 lg:py-20 lg:my-20">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 xl:grid-cols-5">

              {/* Contact Form - 2 columns */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-2 xl:col-span-3"
              >
                <div className="relative p-6 overflow-hidden bg-white shadow-2xl sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl">
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
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-center min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] xl:min-h-[670px]"
                      >
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full sm:w-20 sm:h-20 sm:mb-5 lg:w-24 lg:h-24 lg:mb-6">
                          <CheckCircle className="w-10 h-10 text-green-600 sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl sm:mb-4">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-base text-gray-600 sm:text-lg">
                          Thank you for reaching out. We'll get back to you within 24 hours.
                        </p>
                      </motion.div>
                    ) : (
                      <>
                        {/* Trust Indicators */}
                        <div className="grid grid-cols-1 gap-4 p-4 mt-6 sm:p-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 bg-gray-50 rounded-2xl">
                          {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="p-2 text-blue-600 bg-blue-100 rounded-lg">
                                {benefit.icon}
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
                            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                              {inquiryTypes.map((type) => (
                                <label
                                  key={type.value}
                                  className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 group ${formData.type === type.value
                                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 hover:scale-102'
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
                                    <div className={`p-3 rounded-lg transition-all duration-200 ${formData.type === type.value
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                      }`}>
                                      {type.icon}
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
                                className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 transition-all border-2 border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
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
                                className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 transition-all border-2 border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
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
                              className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 transition-all border-2 border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
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
                              rows={6}
                              className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 transition-all border-2 border-gray-200 outline-none resize-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
                              placeholder="Tell us more about your inquiry..."
                            />
                          </div>

                          {/* Enhanced Submit Button */}
                          <div>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                  <span className="text-lg">Sending your message...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-6 h-6" />
                                  <span className="text-lg">Send Message</span>
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

              {/* Enhanced Sidebar - 1 column */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 sm:space-y-5 lg:col-span-1 xl:col-span-2"
              >
                {/* Map Section */}
                <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl">
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ContactPage