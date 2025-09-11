import React from 'react'
import ContactForm from './components/ContactForm'
import ContactSidebar from './components/ContactSidebar'
import CandidateLayout from '@/shared/layout/candidate-layout/candidate-layout'

const ContactPage = () => {
  return (
    <CandidateLayout>
      <main>
        {/* Main Content: Form + Sidebar */}
        <section className="py-5 overflow-hidde">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 xl:grid-cols-5">
              {/* Contact Form - 2 columns */}
              <ContactForm />

              {/* Sidebar - 1 column */}
              <ContactSidebar />
            </div>
          </div>
        </section>
      </main>
    </CandidateLayout>
  )
}

export default ContactPage