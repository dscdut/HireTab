import { motion } from 'framer-motion'
import { Zap, Target, Shield, Rocket, Clock, Users, TrendingUp, Award } from 'lucide-react'

const benefits = [
	{
		color: 'bg-gradient-to-br from-blue-500 to-blue-600',
		border: 'border-blue-500',
		title: 'Smart Job Matching',
		description:
			'Advanced algorithm connects candidates with the perfect job opportunities based on skills, experience, and career aspirations.',
		icon: <Target className="w-8 h-8 text-white" />,
		bgColor: 'bg-blue-50',
		iconBg: 'bg-blue-500'
	},
	{
		color: 'bg-gradient-to-br from-green-500 to-green-600',
		border: 'border-green-500',
		title: 'Efficient Recruitment',
		description:
			'Streamlined hiring process that reduces time-to-hire by 50% while ensuring quality candidate matches.',
		icon: <Zap className="w-8 h-8 text-white" />,
		bgColor: 'bg-green-50',
		iconBg: 'bg-green-500'
	},
	{
		color: 'bg-gradient-to-br from-purple-500 to-purple-600',
		border: 'border-purple-500',
		title: 'Trusted Platform',
		description:
			'Secure, reliable recruitment platform with verified employers and authentic job postings for peace of mind.',
		icon: <Shield className="w-8 h-8 text-white" />,
		bgColor: 'bg-purple-50',
		iconBg: 'bg-purple-500'
	},
	{
		color: 'bg-gradient-to-br from-orange-500 to-orange-600',
		border: 'border-orange-500',
		title: 'Career Development',
		description:
			'Comprehensive career support including resume building, interview prep, and professional growth resources.',
		icon: <Rocket className="w-8 h-8 text-white" />,
		bgColor: 'bg-orange-50',
		iconBg: 'bg-orange-500'
	},
]

const cardVariants = [
	{
		initial: { opacity: 0, x: -60, rotate: -8, scale: 0.8 },
		animate: { opacity: 1, x: 0, rotate: 0, scale: 1 },
	},
	{
		initial: { opacity: 0, y: 60, rotate: 8, scale: 0.8 },
		animate: { opacity: 1, y: 0, rotate: 0, scale: 1 },
	},
	{
		initial: { opacity: 0, x: 60, rotate: 8, scale: 0.8 },
		animate: { opacity: 1, x: 0, rotate: 0, scale: 1 },
	},
	{
		initial: { opacity: 0, y: -60, rotate: -8, scale: 0.8 },
		animate: { opacity: 1, y: 0, rotate: 0, scale: 1 },
	},
]

const Benefit = () => {
	return (
		<section className="py-20 bg-gradient-to-b from-gray-50 to-white">
			<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
				{/* Main Benefits Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ amount: 0.3 }}
					className="mb-16 text-center"
				>
					<h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
						Why Choose 
						<span className="text-blue-600"> Hiretab?</span>
					</h2>
					<p className="max-w-4xl mx-auto text-xl text-gray-600">
						Experience the future of recruitment with our innovative platform designed for both employers and job seekers
					</p>
				</motion.div>

				{/* Main Benefit Cards */}
				<div className="grid grid-cols-1 gap-8 mb-20 md:grid-cols-2 lg:grid-cols-4">
					{benefits.map((benefit, index) => (
						<motion.div
							key={index}
							initial={cardVariants[index % cardVariants.length].initial}
							whileInView={cardVariants[index % cardVariants.length].animate}
							transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
							viewport={{ amount: 0.3, once: true }}
							className={`group relative flex flex-col items-center text-center p-6 rounded-2xl ${benefit.bgColor} border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden`}
							whileHover={{
								y: -8,
								scale: 1.02,
								transition: { duration: 0.2, ease: "easeOut" },
							}}
						>
							{/* Background Gradient Overlay */}
							<div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-white/50 to-transparent group-hover:opacity-100" />
							
							{/* Icon */}
							<div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl ${benefit.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
								{benefit.icon}
							</div>
							
							{/* Content */}
							<h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-gray-800">
								{benefit.title}
							</h3>
							<p className="leading-relaxed text-gray-600">
								{benefit.description}
							</p>
							
							{/* Hover Effect Border */}
							<div className="absolute inset-0 transition-colors duration-300 border-2 border-transparent rounded-2xl group-hover:border-gray-300" />
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Benefit