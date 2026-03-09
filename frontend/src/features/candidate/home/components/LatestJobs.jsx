import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const LATEST_JOBS = [
    {
        title: 'Social Media Assistant',
        company: 'Nomad',
        location: 'Paris, France',
        logo: '/logo_5.png',
        tags: [
            { label: 'Full-Time', type: 'solid-green' },
            { label: 'Marketing', type: 'outline-orange' },
            { label: 'Design', type: 'outline-blue' }
        ]
    },
    {
        title: 'Social Media Assistant',
        company: 'Netlify',
        location: 'Paris, France',
        logo: 'https://www.vectorlogo.zone/logos/netlify/netlify-icon.svg',
        tags: [
            { label: 'Full-Time', type: 'solid-green' },
            { label: 'Marketing', type: 'outline-orange' },
            { label: 'Design', type: 'outline-blue' }
        ]
    },
    {
        title: 'Brand Designer',
        company: 'Dropbox',
        location: 'San Fransisco, USA',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg',
        tags: [
            { label: 'Full-Time', type: 'solid-green' },
            { label: 'Marketing', type: 'outline-orange' },
            { label: 'Design', type: 'outline-blue' }
        ]
    },
    {
        title: 'Brand Designer',
        company: 'Maze',
        location: 'San Fransisco, USA',
        logo: '/logo_6.png',
        tags: [
            { label: 'Full-Time', type: 'solid-green' },
            { label: 'Marketing', type: 'outline-orange' },
            { label: 'Design', type: 'outline-blue' }
        ]
    },
    {
        title: 'Interactive Developer',
        company: 'Terraform',
        location: 'Hamburg, Germany',
        logo: 'https://www.vectorlogo.zone/logos/terraformio/terraformio-icon.svg',
        tags: [
            { label: 'Full-Time', type: 'solid-green' },
            { label: 'Marketing', type: 'outline-orange' },
            { label: 'Design', type: 'outline-blue' }
        ]
    },
    {
        title: 'Interactive Developer',
        company: 'Udacity',
        location: 'Hamburg, Germany',
        logo: 'https://www.vectorlogo.zone/logos/udacity/udacity-icon.svg',
        tags: [
            { label: 'Full-Time', type: 'solid-green' },
            { label: 'Marketing', type: 'outline-orange' },
            { label: 'Design', type: 'outline-blue' }
        ]
    },
    {
        title: 'HR Manager',
        company: 'Packer',
        location: 'Lucern, Switzerland',
        logo: 'https://www.vectorlogo.zone/logos/packerio/packerio-icon.svg',
        tags: [
            { label: 'Full-Time', type: 'solid-green' },
            { label: 'Marketing', type: 'outline-orange' },
            { label: 'Design', type: 'outline-blue' }
        ]
    },
    {
        title: 'HR Manager',
        company: 'Webflow',
        location: 'Lucern, Switzerland',
        logo: 'https://www.vectorlogo.zone/logos/webflow/webflow-icon.svg',
        tags: [
            { label: 'Full-Time', type: 'solid-green' },
            { label: 'Marketing', type: 'outline-orange' },
            { label: 'Design', type: 'outline-blue' }
        ]
    }
]

const getTagStyles = (type) => {
    switch (type) {
        case 'solid-green':
            return 'bg-[#56CDAD]/10 text-[#56CDAD]'
        case 'outline-orange':
            return 'border border-[#FFB836] text-[#FFB836]'
        case 'outline-blue':
            return 'border border-[#4640DE] text-[#4640DE]'
        default:
            return 'border border-gray-200 text-gray-500'
    }
}

const LatestJobs = () => {
    return (
        <section className="relative py-24 bg-[#F8F9FC] overflow-hidden">
            {/* Background Decorative Lines */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 L100 0" stroke="#4640DE" strokeWidth="0.05" fill="none" />
                    <path d="M30 100 L100 30" stroke="#4640DE" strokeWidth="0.05" fill="none" />
                    <path d="M70 100 L100 70" stroke="#4640DE" strokeWidth="0.05" fill="none" />
                </svg>
            </div>

            <div className="container relative z-10 px-6 mx-auto lg:px-12">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#18191C]">
                        Latest <span className="text-[#26A4FF]">jobs open</span>
                    </h2>
                    <button className="flex items-center gap-2 text-[#4640DE] font-bold hover:gap-3 transition-all">
                        Show all jobs <ArrowRight size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {LATEST_JOBS.map((job, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            viewport={{ once: true }}
                            className="flex items-center p-6 bg-white border border-[#D6DDEB] rounded-2xl hover:shadow-xl hover:border-[#4640DE] transition-all duration-300 group cursor-pointer"
                        >
                            <div className="w-24 h-20 flex items-center justify-center shrink-0 mr-6">
                                <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#18191C] mb-1 group-hover:text-[#4640DE] transition-colors">
                                    {job.title}
                                </h3>
                                <p className="text-[#7C8493] text-sm mb-4">
                                    {job.company} <span className="inline-block w-1 h-1 bg-gray-300 rounded-full mx-2 align-middle" /> {job.location}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {job.tags.map((tag, tIdx) => (
                                        <span
                                            key={tIdx}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold leading-none ${getTagStyles(tag.type)}`}
                                        >
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default LatestJobs
