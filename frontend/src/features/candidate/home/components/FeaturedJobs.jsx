import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const JOBS = [
    {
        logo: '/logo_1.png',
        company: 'Revolut',
        title: 'Email Marketing',
        location: 'Madrid, Spain',
        type: 'Full Time',
        description: 'Revolut is looking for Email Marketing to help team ma...',
        tags: ['Marketing', 'Design'],
        tagColors: ['bg-orange-50 text-orange-600', 'bg-green-50 text-green-600']
    },
    {
        logo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg',
        company: 'Dropbox',
        title: 'Brand Designer',
        location: 'San Fransisco, US',
        type: 'Full Time',
        description: 'Dropbox is looking for Brand Designer to help the team t...',
        tags: ['Design', 'Business'],
        tagColors: ['bg-green-50 text-green-600', 'bg-blue-50 text-blue-600']
    },
    {
        logo: '/logo_2.png',
        company: 'Pitch',
        title: 'Email Marketing',
        location: 'Berlin, Germany',
        type: 'Full Time',
        description: 'Pitch is looking for Customer Manager to join marketing t...',
        tags: ['Marketing'],
        tagColors: ['bg-orange-50 text-orange-600']
    },
    {
        logo: '/logo_3.png',
        company: 'Blinklist',
        title: 'Visual Designer',
        location: 'Granada, Spain',
        type: 'Full Time',
        description: 'Blinklist is looking for Visual Designer to help team desi...',
        tags: ['Design'],
        tagColors: ['bg-green-50 text-green-600']
    },
    {
        logo: '/logo_4.png',
        company: 'ClassPass',
        title: 'Product Designer',
        location: 'Manchester, UK',
        type: 'Full Time',
        description: 'ClassPass is looking for Product Designer to help us...',
        tags: ['Marketing', 'Design'],
        tagColors: ['bg-orange-50 text-orange-600', 'bg-green-50 text-green-600']
    },
    {
        logo: 'https://www.vectorlogo.zone/logos/canva/canva-icon.svg',
        company: 'Canva',
        title: 'Lead Designer',
        location: 'Ontario, Canada',
        type: 'Full Time',
        description: 'Canva is looking for Lead Engineer to help develop n...',
        tags: ['Design', 'Business'],
        tagColors: ['bg-green-50 text-green-600', 'bg-blue-50 text-blue-600']
    },
    {
        logo: 'https://www.vectorlogo.zone/logos/godaddy/godaddy-icon.svg',
        company: 'GoDaddy',
        title: 'Brand Strategist',
        location: 'Marseille, France',
        type: 'Full Time',
        description: 'GoDaddy is looking for Brand Strategist to join the team...',
        tags: ['Marketing'],
        tagColors: ['bg-orange-50 text-orange-600']
    },
    {
        logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
        company: 'Twitter',
        title: 'Data Analyst',
        location: 'San Diego, US',
        type: 'Full Time',
        description: 'Twitter is looking for Data Analyst to help team desi...',
        tags: ['Technology'],
        tagColors: ['bg-red-50 text-red-600']
    }
]

const FeaturedJobs = () => {
    return (
        <section className="py-24 bg-[#F8F9FD]">
            <div className="container px-6 mx-auto lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <span className="w-12 h-[2px] bg-[#3129B8]" />
                            <span className="text-[#3129B8] font-bold tracking-widest uppercase text-sm">Opportunities</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#18191C] tracking-tight">
                            Featured <span className="text-[#3129B8]">Job Openings</span>
                        </h2>
                    </div>
                    <button className="group flex items-center gap-3 bg-white text-[#3129B8] border border-[#3129B8]/20 px-8 py-4 font-bold rounded-[4px] hover:bg-[#3129B8] hover:text-white transition-all duration-300">
                        Explore All Jobs
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {JOBS.map((job, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="relative p-8 bg-white border border-[#E2E8F0] rounded-[4px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:border-[#3129B8]/30 transition-all duration-500 cursor-pointer group"
                        >
                            {/* Decorative Top Line */}
                            <div className="absolute top-0 left-0 w-0 h-[3px] bg-[#3129B8] group-hover:w-full transition-all duration-500" />

                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 p-2 flex items-center justify-center bg-white border border-gray-50 rounded-[4px] shadow-sm">
                                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                                </div>
                                <span className="px-3 py-1 bg-[#F0F5FF] text-[#3129B8] text-[10px] font-black rounded-[2px] uppercase tracking-wider">
                                    {job.type}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-extrabold text-[#18191C] mb-2 group-hover:text-[#3129B8] transition-colors line-clamp-1">
                                    {job.title}
                                </h3>
                                <div className="flex items-center text-[#7C8493] text-sm font-medium">
                                    <span className="text-[#3129B8]/80">{job.company}</span>
                                    <span className="mx-2 opacity-30">•</span>
                                    <span className="truncate">{job.location}</span>
                                </div>
                            </div>

                            <p className="text-[#515B6F] text-sm leading-relaxed mb-8 line-clamp-2">
                                {job.description}
                            </p>

                            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-50">
                                {job.tags.slice(0, 2).map((tag, tIdx) => (
                                    <span
                                        key={tIdx}
                                        className="px-3 py-1 bg-gray-50 text-[#515B6F] rounded-[4px] text-[11px] font-bold border border-gray-100 uppercase tracking-tighter group-hover:bg-[#F0F5FF] group-hover:text-[#3129B8] transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedJobs
