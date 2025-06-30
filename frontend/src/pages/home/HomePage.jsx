import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Testimonials from '@/components/landing/Testimonials'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'
import CompanyHeader from '@/components/landing/CompanyHeader'
import CompanyProfile from '@/components/landing/CompanyProfile'
import OpenJobs from '@/components/landing/OpenJobs'
const HomePage = () => {

  const companyData = {
    name: "Stripe",
    jobCount: 43,
    website: "https://stripe.com",
    founded: "July 31, 2011",
    employees: "4000+",
    location: "20 countries",
    industry: "Payment Gateway",
  }

  const technologies = [
    { name: "React" },
    { name: "Node.js" },
    { name: "TypeScript" },
    { name: "PostgreSQL" },
    { name: "Redis" },
    { name: "Docker" },
    { name: "Kubernetes" },
    { name: "Go" }
  ]

  const openJobs = [
    {
      title: "Social Media Assistant",
      company: "Nomad",
      location: "Paris, France",
      tags: ["Full-Time", "Marketing", "Design"],
      companyColor: "#10B981",
      companyInitial: "N",
    },
    {
      title: "Social Media Assistant",
      company: "Netlify",
      location: "Paris, France",
      tags: ["Full-Time", "Marketing", "Design"],
      companyColor: "#06B6D4",
      companyInitial: "N",
    },
    {
      title: "Brand Designer",
      company: "Dropbox",
      location: "San Francisco, USA",
      tags: ["Full-Time", "Marketing", "Design"],
      companyColor: "#3B82F6",
      companyInitial: "D",
    },
    {
      title: "Brand Designer",
      company: "Maze",
      location: "San Francisco, USA",
      tags: ["Full-Time", "Marketing", "Design"],
      companyColor: "#8B5CF6",
      companyInitial: "M",
    },
    {
      title: "Interactive Developer",
      company: "Terraform",
      location: "Hamburg, Germany",
      tags: ["Full-Time", "Marketing", "Design"],
      companyColor: "#06B6D4",
      companyInitial: "T",
    },
    {
      title: "Interactive Developer",
      company: "Udacity",
      location: "Hamburg, Germany",
      tags: ["Full-Time", "Marketing", "Design"],
      companyColor: "#3B82F6",
      companyInitial: "U",
    },
    {
      title: "HR Manager",
      company: "Packer",
      location: "Lucern, Switzerland",
      tags: ["Full-Time", "Marketing", "Design"],
      companyColor: "#EF4444",
      companyInitial: "P",
    },
    {
      title: "HR Manager",
      company: "Webflow",
      location: "Lucern, Switzerland",
      tags: ["Full-Time", "Marketing", "Design"],
      companyColor: "#3B82F6",
      companyInitial: "W",
    },
  ]

  const officeLocations = ["United States", "England", "Japan", "Australia", "China"]

  const companyDescription = `Stripe is a software platform for starting and running internet businesses. Millions of businesses rely on Stripe's software tools to accept payments, expand globally, and manage their businesses online. Stripe has been at the forefront of expanding internet commerce, powering new business models, and supporting the latest platforms, from marketplaces to mobile commerce sites. We believe that growing the GDP of the internet is a problem rooted in code and design, not finance. Stripe is built for developers, makers, and creators. We work on solving the hard technical problems necessary to build global economic infrastructure—from designing highly reliable systems to developing advanced machine learning algorithms to prevent fraud.`
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CompanyHeader
          company={companyData}
          locations={officeLocations}
        />
        <CompanyProfile
          description={companyDescription}
          technologies={technologies}
        />
        <OpenJobs jobs={openJobs} />
        {/* <Hero /> */}

        {/* <Features />
        <HowItWorks />
        <Testimonials />
        <CTA /> */}
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
