import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

const PostJobCTA = () => {
    return (
        <section className="relative py-28 overflow-hidden bg-white">
            <div className="container px-6 mx-auto max-w-7xl">
                <div className="relative pt-10">
                    {/* Unique Top Notch Cutout */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-56 h-12 bg-white rounded-b-[40px] shadow-[0_4px_20px_-10px_rgba(37,99,235,0.2)] flex items-center justify-center border-x border-b border-blue-50">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        </div>
                    </div>

                    {/* Main Premium Card - Vibrance Boosted */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#1D4ED8] rounded-[60px] overflow-hidden flex flex-col lg:flex-row items-center border border-white/20 shadow-[0_45px_100px_-20px_rgba(37,99,235,0.4)]"
                    >
                        {/* More Vibrant Mesh Gradients */}
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.4, 0.6, 0.4],
                                x: [0, 40, 0],
                                y: [0, -30, 0]
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-[#60A5FA] rounded-full blur-[140px] pointer-events-none opacity-50"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                                x: [0, -50, 0],
                                y: [0, 40, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, delay: 1, ease: "linear" }}
                            className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-[#818CF8] rounded-full blur-[120px] pointer-events-none opacity-40"
                        />

                        {/* Grid Texture */}
                        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                        {/* Left Content Column */}
                        <div className="relative z-10 flex-[1.2] p-12 md:p-20 lg:p-24 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.02] tracking-tighter">
                                    Start posting <br className="hidden md:block" /> jobs today
                                </h2>

                                <p className="text-white/80 text-lg md:text-xl mb-12 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                    Join the elite network of tech companies using our AI-driven ecosystem to find high-signal talent in records time.
                                </p>

                                <div className="flex flex-col md:flex-row items-center gap-8 justify-center lg:justify-start">
                                    <motion.button
                                        whileHover={{
                                            scale: 1.03,
                                            y: -3,
                                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-white text-blue-600 px-10 py-5 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-4 group"
                                    >
                                        Get Started Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>

                                    <div className="flex items-center gap-3 text-white/70 text-[13px] font-bold tracking-[0.05em]">
                                        <CheckCircle2 size={16} className="text-white" />
                                        14-DAY FREE TRIAL
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Image Pillar */}
                        <div className="relative flex-1 w-full lg:h-full py-12 lg:py-0 overflow-visible flex items-center justify-center lg:justify-end lg:pr-16">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                                whileInView={{ opacity: 1, scale: 1, rotateY: -8 }}
                                transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="relative w-[88%] lg:w-[115%] lg:-mr-[10%] shadow-[0_70px_140px_-30px_rgba(30,58,138,0.5)] rounded-[40px] overflow-hidden border border-white/30 group transform-gpu"
                            >
                                <img
                                    src="/dashboard-admin.png"
                                    alt="Recruiter Dashboard Preview"
                                    className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            </motion.div>

                            {/* Re-designed Floating Analytics */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-10 lg:bottom-12 -left-2 lg:-left-12 bg-white/95 backdrop-blur-xl p-6 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] hidden md:flex items-center gap-4 border border-white"
                            >
                                <div className="w-14 h-14 bg-blue-600 rounded-[22px] flex items-center justify-center shadow-lg shadow-blue-200">
                                    <Plus size={24} className="text-white" />
                                </div>
                                <div className="pr-4">
                                    <p className="text-[#0F172A] font-black text-2xl leading-tight">+68%</p>
                                    <p className="text-slate-400 text-[11px] font-black tracking-widest uppercase">Efficiency</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

const Plus = ({ className, size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
)

export default PostJobCTA
