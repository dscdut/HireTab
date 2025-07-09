import { motion } from 'framer-motion'
import CommunityIcon from '@/assets/icons/community.svg'
import EventIcon from '@/assets/icons/event.svg'
import TechnologyIcon from '@/assets/icons/technology.svg'
import CultureIcon from '@/assets/icons/culture.svg'

const features = [
	{
		color: 'bg-[#4285F4]',
		border: 'border-[#4285F4]',
		title: 'Innovative Community',
		description:
			'Kết nối sinh viên trên toàn thành phố Đà Nẵng yêu thích công nghệ để cùng học hỏi và phát triển.',
		icon: <img src={CommunityIcon} alt="Community" className="w-10 h-10" />,
	},
	{
		color: 'bg-[#EA4335]',
		border: 'border-[#EA4335]',
		title: 'Impactful Events',
		description:
			'Tổ chức workshop, tech talk và hackathon để chia sẻ kiến thức và nâng cao kỹ năng.',
		icon: <img src={EventIcon} alt="Event" className="w-10 h-10" />,
	},
	{
		color: 'bg-[#FBBC05]',
		border: 'border-[#FBBC05]',
		title: 'Future Technologies',
		description:
			'Khám phá các công nghệ mới như AI, Cloud, Web3 và ứng dụng vào thực tiễn.',
		icon: <img src={TechnologyIcon} alt="Technology" className="w-10 h-10" />,
	},
	{
		color: 'bg-[#34A853]',
		border: 'border-[#34A853]',
		title: 'Dynamic Culture',
		description:
			'Xây dựng môi trường sáng tạo, gắn kết và đầy năng lượng dành cho sinh viên công nghệ.',
		icon: <img src={CultureIcon} alt="Culture" className="w-10 h-10" />,
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

const Features = () => {
	return (
		<section className="py-40 bg-white">
			<div className="max-w-8xl mx-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ amount: 0.3 }}
					className="text-center mb-28"
				>
					<h2 className="text-6xl font-extrabold text-gray-900 mb-2 tracking-tight">
						Highlights of
						<span className="text-[#4285F4]"> G</span>
						<span className="text-[#EA4335]">D</span>
						<span className="text-[#FBBC05]">G</span>
						<span className="text-[#34A853]">o</span>
						<span className="text-[#4285F4]">C</span>
						<span className="text-[#EA4335]"> - </span>
						<span className="text-[#FBBC05]">D</span>
						<span className="text-[#34A853]">U</span>
						<span className="text-[#4285F4]">T</span>
					</h2>
					<p className="text-3xl text-gray-600 font-medium mb-1 my-4">
						Google Developer Groups on Campus
					</p>
				</motion.div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={cardVariants[index % cardVariants.length].initial}
							whileInView={cardVariants[index % cardVariants.length].animate}
							transition={{ duration: 0.3, delay: 0, ease: "linear" }}
							viewport={{ amount: 0.3, once: false }}
							className={`group relative flex flex-col items-center text-center p-8 min-h-[250px] min-w-[300px] rounded-2xl border-2 ${feature.border} bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer will-change-transform`}
							style={{
								zIndex: 2,
								boxShadow: '0 8px 32px 0 rgba(60,60,60,0.10)',
							}}
							whileHover={{
								y: -12,
								scale: 1.06,
								transition: { duration: 0.15, delay: 0, ease: "linear" }, // instant on hover
							}}
						>
							<div
								className={`flex items-center justify-center w-20 h-20 rounded-full mb-6 ${feature.color} bg-opacity-10 group-hover:scale-110 transition-transform duration-150`}
							>
								{feature.icon}
							</div>
							<h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:underline underline-offset-4">
								{feature.title}
							</h3>
							<p className="text-gray-700 text-lg font-medium">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}

export default Features