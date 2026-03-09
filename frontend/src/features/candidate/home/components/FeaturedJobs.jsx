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
        <section className="py-24 bg-white">
            <div className="container px-6 mx-auto lg:px-12">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#18191C]">
                        Featured <span className="text-[#4640DE]">jobs</span>
                    </h2>
                    <button className="flex items-center gap-2 text-[#4640DE] font-bold hover:gap-3 transition-all">
                        Show all jobs <ArrowRight size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {JOBS.map((job, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 border border-[#D6DDEB] rounded-lg hover:shadow-xl hover:border-[#4640DE] transition-all duration-300 cursor-pointer group bg-white"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-white">
                                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                                </div>
                                <span className="px-3 py-1 border border-[#4640DE] text-[#4640DE] text-xs font-bold rounded-md uppercase">
                                    {job.type}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-[#18191C] mb-1 group-hover:text-[#4640DE] transition-colors">
                                {job.title}
                            </h3>
                            <p className="text-[#7C8493] text-sm mb-4">
                                {job.company} <span className="inline-block w-1 h-1 bg-gray-300 rounded-full mx-2 align-middle" /> {job.location}
                            </p>

                            <p className="text-[#515B6F] text-sm leading-relaxed mb-6">
                                {job.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {job.tags.map((tag, tIdx) => (
                                    <span
                                        key={tIdx}
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${job.tagColors[tIdx]}`}
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
