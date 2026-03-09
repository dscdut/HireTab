import { motion } from 'framer-motion'

const PostJobCTA = () => {
    return (
        <section className="relative py-24 overflow-hidden bg-white">
            <div className="container px-6 mx-auto lg:px-12">
                <div className="relative overflow-visible">
                    {/* Main Blue Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative bg-[#4640DE] rounded-[48px] overflow-hidden flex flex-col lg:flex-row items-center min-h-[500px] shadow-2xl shadow-[#4640DE]/20"
                    >
                        {/* Geometric Background Decorative Elements */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4 pointer-events-none" />
                        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-full bg-white/5 rounded-full blur-3xl pointer-events-none" />

                        {/* Left Content Column */}
                        <div className="relative z-10 flex-1 p-10 md:p-16 lg:p-20 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.15] tracking-tight">
                                    Start posting <br className="hidden md:block" /> jobs today
                                </h2>
                                <p className="text-white/80 text-lg md:text-xl mb-12 font-medium max-w-md mx-auto lg:mx-0">
                                    Join thousands of companies and start posting jobs for only $10. Reach the world's top talent.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.2)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white text-[#4640DE] px-10 py-5 text-xl font-bold rounded-2xl shadow-xl transition-all duration-300 active:scale-95"
                                >
                                    Sign Up For Free
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Right Image/Dashboard Column */}
                        <div className="relative flex-1 w-full lg:h-full min-h-[400px] lg:min-h-[550px] overflow-visible">
                            <motion.div
                                initial={{ opacity: 0, y: 100, rotate: 5 }}
                                whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute top-10 lg:top-24 left-10 lg:left-0 w-[110%] lg:w-[130%] shadow-[0_40px_100px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden border-4 border-white/10"
                            >
                                <img
                                    src="https://cdn.dribbble.com/users/1615584/screenshots/15710288/media/be87d3a040b3c662886c8d28e75eacec.png?compress=1&resize=1200x900"
                                    alt="Recruiter Dashboard Preview"
                                    className="w-full h-auto object-cover"
                                />
                            </motion.div>

                            {/* Decorative Floating Stats Badge */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/4 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl hidden md:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                                        <div className="w-5 h-5 bg-white rounded-full opacity-50" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">2,543</p>
                                        <p className="text-white/60 text-[10px] font-medium tracking-wider uppercase">New Applicants</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default PostJobCTA
