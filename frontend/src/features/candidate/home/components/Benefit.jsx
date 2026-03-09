import { motion } from 'framer-motion'

const benefits = [
	{
		number: '01',
		title: 'Smart Job Matching',
		description:
			'Our AI-driven algorithm learns your preferences to connect you with the most relevant opportunities.',
		bgColor: 'bg-[#E9EFFF]/60',
		glowColor: 'group-hover:shadow-[0_20px_60px_rgba(70,64,222,0.15)]',
		accent: '#4640DE'
	},
	{
		number: '02',
		title: 'Efficient Recruitment',
		description:
			'Reduce time-to-hire by 50% with our automated screening and streamlined communication tools.',
		bgColor: 'bg-[#E9FBF3]/60',
		glowColor: 'group-hover:shadow-[0_20px_60px_rgba(86,205,173,0.15)]',
		accent: '#56CDAD'
	},
	{
		number: '03',
		title: 'Trusted Platform',
		description:
			'Every employer and job posting is verified to ensure a safe and transparent experience for everyone.',
		bgColor: 'bg-[#F2EFFF]/60',
		glowColor: 'group-hover:shadow-[0_20px_60px_rgba(123,97,255,0.15)]',
		accent: '#7B61FF'
	},
	{
		number: '04',
		title: 'Career Development',
		description:
			'Access exclusive resources designed to help you grow professionally and land your dream role.',
		bgColor: 'bg-[#FFF5E9]/60',
		glowColor: 'group-hover:shadow-[0_20px_60px_rgba(255,184,54,0.15)]',
		accent: '#FFB836'
	}
]

const Benefit = () => {
	return (
		<section className="relative py-32 overflow-hidden bg-white">
			{/* Decorative Background Elements */}
			<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4640DE]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
			<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#56CDAD]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

			<div className="container relative z-10 px-6 mx-auto lg:px-12">
				{/* Section Header */}
				<div className="max-w-3xl mx-auto mb-20 text-center">
					<motion.span
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-[#4640DE] uppercase bg-[#4640DE]/10 rounded-full"
					>
						Platform Benefits
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.1 }}
						viewport={{ once: true }}
						className="mb-8 text-5xl md:text-6xl font-extrabold text-[#18191C] leading-tight tracking-tight"
					>
						Why Choose <span className="text-[#4640DE]">Hiretab?</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.2 }}
						viewport={{ once: true }}
						className="text-xl text-[#515B6F] leading-relaxed"
					>
						Experience the next generation of recruitment with tools designed to empower your career journey.
					</motion.p>
				</div>

				{/* Benefits Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{benefits.map((benefit, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -12 }}
							className={`group relative p-12 rounded-[48px] ${benefit.bgColor} backdrop-blur-md border border-[#D6DDEB] hover:border-[#4640DE] transition-all duration-500 cursor-pointer overflow-hidden ${benefit.glowColor}`}
						>
							{/* Background Number */}
							<span className="absolute -top-4 -right-2 text-[120px] font-black text-[#18191C] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none select-none">
								{benefit.number}
							</span>

							{/* Icon Alternative: Number Badge */}
							<div className="relative mb-10 w-20 h-20 bg-white rounded-3xl shadow-sm border border-black/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
								<span className="text-2xl font-black" style={{ color: benefit.accent }}>{benefit.number}</span>
								<div className="absolute inset-2 border-2 border-dashed opacity-20 rounded-2xl" style={{ borderColor: benefit.accent }} />
							</div>

							{/* Card Content */}
							<h3 className="mb-4 text-2xl font-bold text-[#18191C] tracking-tight group-hover:text-[#4640DE] transition-colors duration-300">
								{benefit.title}
							</h3>
							<p className="text-[#515B6F] text-lg leading-relaxed font-medium">
								{benefit.description}
							</p>

							{/* Decorative Line */}
							<div
								className="absolute bottom-0 left-0 h-1.5 w-0 transition-all duration-500 group-hover:w-full"
								style={{ backgroundColor: benefit.accent }}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Benefit
