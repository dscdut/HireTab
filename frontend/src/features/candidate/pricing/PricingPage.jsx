import { motion } from 'framer-motion'
import { Check, HelpCircle, Star, Quote, ArrowRight, X, ShieldCheck, Zap, Globe, CreditCard } from 'lucide-react'
import { useState } from 'react'
import CandidateLayout from '@/shared/layout/candidate-layout/candidate-layout'

const PRICING_PLANS = [
    {
        name: 'Starter',
        price: { monthly: 0, annual: 0 },
        description: 'Perfect for small teams just getting started',
        features: [
            'Infinite job searches',
            'Create 1 professional resume',
            'Track up to 5 job applications',
            'Email job alerts',
            'Basic profile visibility'
        ],
        notIncluded: [
            'AI Resume Score',
            'Priority Support',
            'Custom Branding',
            'Advanced Analytics'
        ],
        buttonText: 'Get started',
        isPopular: false,
        color: 'gray'
    },
    {
        name: 'Pro',
        price: { monthly: 19, annual: 15 },
        description: 'For growing teams ready to scale',
        features: [
            'Premium resume templates',
            'Unlimited application tracking',
            'AI Resume Score & Analysis',
            'Priority profile in recruiter searches',
            'Express email support',
            'Smart Job Recommendations'
        ],
        notIncluded: [
            'Dedicated Career Consultant',
            'Personal branding audit'
        ],
        buttonText: 'Get started',
        isPopular: true,
        color: 'blue'
    },
    {
        name: 'Enterprise',
        price: { monthly: 49, annual: 39 },
        description: 'Custom solutions for large organizations',
        features: [
            'Everything in Professional',
            'Dedicated Career Consultant',
            'Interview coaching session',
            'Personal branding audit',
            'Custom integrations',
            '24/7 Priority Support',
            'Advanced hiring analytics'
        ],
        notIncluded: [],
        buttonText: 'Contact sales',
        isPopular: false,
        color: 'indigo'
    }
]

const COMPARISON_FEATURES = [
    { category: 'Search & Applications', features: [
        { name: 'Monthly Job Searches', starter: 'Unlimited', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Application Tracking', starter: '5 / month', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Email Notifications', starter: true, pro: true, enterprise: true },
        { name: 'Company History', starter: false, pro: true, enterprise: true },
    ]},
    { category: 'Resume & AI Tools', features: [
        { name: 'Resume Builder', starter: '1 Resume', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'AI Resume Score', starter: false, pro: true, enterprise: true },
        { name: 'Smart Keywords Analysis', starter: false, pro: true, enterprise: true },
        { name: 'CV Design Templates', starter: 'Basic', pro: 'Premium', enterprise: 'Custom' },
    ]},
    { category: 'Visibility & Career', features: [
        { name: 'Profile Visibility', starter: 'Standard', pro: 'Leveled Up', enterprise: 'Top Priority' },
        { name: 'Recruiter Direct Messages', starter: false, pro: true, enterprise: true },
        { name: 'Career Consultant', starter: false, pro: false, enterprise: 'Weekly Session' },
        { name: 'Interview Coaching', starter: false, pro: 'Discounted', enterprise: 'FREE' },
    ]},
    { category: 'Support & Security', features: [
        { name: 'Customer Support', starter: 'Email', pro: 'Express Email', enterprise: '24/7 VIP' },
        { name: 'SSO & Advanced Security', starter: false, pro: false, enterprise: true },
        { name: 'Data Export', starter: true, pro: true, enterprise: true },
    ]}
]

const FAQS = [
    {
        question: 'Can I change my plan later?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be applied at the start of your next billing cycle.'
    },
    {
        question: 'Is there a free trial?',
        answer: 'All our paid plans come with a 14-day free trial. No credit card is required to start your trial of the Pro or Enterprise plan.'
    },
    {
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel your subscription at any time with just one click in your billing panel. You will still have access to your features until the end of the period.'
    },
    {
        question: 'Are there any hidden fees?',
        answer: 'No. The price you see is the price you pay. There are no setup fees or hidden charges in any of our plans.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Google Pay for all our subscription plans.'
    },
    {
        question: 'Do you offer student discounts?',
        answer: 'Yes! Students with a valid .edu email address are eligible for a 50% discount on the Pro plan. Please contact our support team to verify.'
    }
]

const TESTIMONIALS = [
    {
        name: 'Alex Johnson',
        role: 'Senior Developer at TechFlow',
        content: 'HireTab’s Pro plan helped me land my dream job in just 3 weeks. The AI Resume Analysis is a game changer!',
        avatar: 'AJ'
    },
    {
        name: 'Sarah Chen',
        role: 'Marketing Manager',
        content: 'The priority profile feature really works. I received 3x more recruiter messages after upgrading to Pro.',
        avatar: 'SC'
    }
]

const PricingPage = () => {
    const [isAnnual, setIsAnnual] = useState(false)

    return (
        <CandidateLayout>
            <div className="bg-[#FDFDFE] min-h-screen pt-32 pb-40 font-['Inter'] overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full overflow-hidden -z-10 h-[800px]">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-blue-50/50 rounded-full blur-[120px]" />
                    <div className="absolute top-[10%] right-[-5%] w-[30%] h-[40%] bg-indigo-50/50 rounded-full blur-[100px]" />
                </div>

                <div className="container px-6 mx-auto max-w-[1400px]">
                    {/* Header */}
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6"
                        >
                            <Zap size={16} />
                            <span>Transparent pricing for your growth</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-[48px] md:text-[72px] font-bold text-[#1E293B] mb-6 tracking-tight leading-[1.1]"
                        >
                            Plans that fit <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">your career stage</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-[#64748B] text-xl font-medium mb-12 max-w-2xl mx-auto"
                        >
                            Join 50,000+ professionals using HireTab to find better opportunities. Choose the plan that’s right for you.
                        </motion.p>

                        {/* Toggle */}
                        <div className="flex items-center justify-center gap-6 mb-24">
                            <span className={`text-base font-bold transition-colors ${!isAnnual ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>Monthly billing</span>
                            <button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className="relative w-[64px] h-[34px] bg-[#E2E8F0] rounded-full p-1.5 transition-all duration-300 hover:bg-[#CBD5E1]"
                            >
                                <div
                                    className={`w-[22px] h-[22px] bg-white rounded-full shadow-lg transition-transform duration-300 ${isAnnual ? 'translate-x-[30px]' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                            <div className="flex items-center gap-2">
                                <span className={`text-base font-bold transition-colors ${isAnnual ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>Annual billing</span>
                                <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Save 20%</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-40 relative">
                        {PRICING_PLANS.map((plan, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.15 + 0.3 }}
                                className={`relative flex flex-col p-10 bg-white border ${plan.isPopular ? 'border-blue-500 shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-sm'
                                    } rounded-[32px] transition-all duration-500 hover:border-blue-200 group`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[11px] font-black tracking-[0.1em] uppercase shadow-lg">
                                        Most Popular choice
                                    </div>
                                )}

                                <div className="mb-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-black text-[#1E293B] tracking-tight">{plan.name}</h3>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                            plan.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                                            plan.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-600'
                                        }`}>
                                            {plan.name === 'Starter' ? <ShieldCheck /> : plan.name === 'Pro' ? <Zap /> : <Globe />}
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-[#64748B] mb-8 leading-relaxed line-clamp-2 min-h-[40px]">
                                        {plan.description}
                                    </p>
                                    <div className="flex items-baseline mb-2">
                                        <span className="text-[64px] font-black text-[#1E293B] tracking-tighter">
                                            ${isAnnual ? plan.price.annual : plan.price.monthly}
                                        </span>
                                        <span className="text-[#64748B] font-bold text-lg ml-2">/mo</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400">
                                        {isAnnual ? `Billed $${plan.price.annual * 12} per year` : 'Billed monthly'}
                                    </p>
                                </div>

                                <div className="space-y-5 mb-10 flex-1">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Included Features</p>
                                    {plan.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-3">
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                            <span className="text-[15px] font-bold text-[#475569]">{feature}</span>
                                        </div>
                                    ))}
                                    {plan.notIncluded.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-3 opacity-40">
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center">
                                                <X size={12} strokeWidth={4} />
                                            </div>
                                            <span className="text-[15px] font-bold text-[#475569]">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className={`w-full py-5 px-8 rounded-2xl font-black text-base transition-all duration-300 ${plan.isPopular
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-[0.98]'
                                        : 'bg-white text-[#1E293B] border-2 border-gray-100 hover:border-blue-500 hover:text-blue-600 active:scale-[0.98]'
                                        }`}
                                >
                                    {plan.buttonText}
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Comparison Table Section */}
                    <div className="mb-48">
                        <div className="text-center mb-16">
                            <h2 className="text-[32px] md:text-[42px] font-black text-[#1E293B] mb-4 tracking-tight">Compare plans in detail</h2>
                            <p className="text-[#64748B] text-lg font-medium">Find exactly what you need for your career growth.</p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl overflow-hidden">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="p-8 text-left text-sm font-black text-gray-400 uppercase tracking-widest w-1/4">Feature</th>
                                        {PRICING_PLANS.map((plan, i) => (
                                            <th key={i} className="p-8 text-center w-1/4">
                                                <span className={`text-lg font-black ${plan.isPopular ? 'text-blue-600' : 'text-[#1E293B]'}`}>{plan.name}</span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARISON_FEATURES.map((group, gIdx) => (
                                        <React.Fragment key={gIdx}>
                                            <tr className="border-t border-gray-100 bg-blue-50/30">
                                                <td colSpan={4} className="px-8 py-4 text-xs font-black text-blue-600 uppercase tracking-[0.2em]">
                                                    {group.category}
                                                </td>
                                            </tr>
                                            {group.features.map((feature, fIdx) => (
                                                <tr key={fIdx} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-8 text-[15px] font-bold text-[#1E293B]">{feature.name}</td>
                                                    {[feature.starter, feature.pro, feature.enterprise].map((val, i) => (
                                                        <td key={i} className="p-8 text-center">
                                                            {typeof val === 'boolean' ? (
                                                                val ? <Check className="mx-auto text-emerald-500" size={24} strokeWidth={3} /> : <X className="mx-auto text-gray-200" size={24} />
                                                            ) : (
                                                                <span className="text-[15px] font-black text-[#475569]">{val}</span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Trusted Section */}
                    <div className="mb-48 border-y border-gray-100 py-20">
                        <p className="text-center text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-12">Trusted by teams at</p>
                        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale contrast-125">
                            {['Google', 'Netflix', 'Airbnb', 'Spotify', 'Stripe'].map(brand => (
                                <span key={brand} className="text-2xl font-black text-[#1E293B] tracking-tighter">{brand}</span>
                            ))}
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div className="mb-48 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-blue-600 font-black tracking-widest uppercase text-xs mb-4 block">Candidate Feedback</span>
                            <h2 className="text-[40px] font-black text-[#1E293B] mb-8 tracking-tight leading-tight">Join thousands of <br /> happy professionals.</h2>
                            <div className="flex gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-14 h-14 rounded-full border-4 border-white shadow-lg shadow-blue-100" />
                                    ))}
                                </div>
                                <div className="text-sm">
                                    <div className="flex text-yellow-400 mb-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                                    </div>
                                    <p className="text-[#64748B] font-bold text-base">4.9/5 <span className="text-gray-400 font-medium">from 15,000+ users</span></p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {TESTIMONIALS.map((t, idx) => (
                                <motion.div 
                                    key={idx} 
                                    whileHover={{ x: 10 }}
                                    className="p-10 bg-white border border-gray-100 rounded-[32px] shadow-xl shadow-gray-100/20 relative"
                                >
                                    <Quote className="absolute top-8 right-10 text-blue-50/50 w-20 h-20 -z-0" />
                                    <p className="text-[#475569] text-xl font-bold italic mb-8 relative z-10 leading-relaxed">"{t.content}"</p>
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg">
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <h4 className="text-[#1E293B] font-black text-base">{t.name}</h4>
                                            <p className="text-[#64748B] font-bold text-sm uppercase tracking-widest">{t.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mb-48 max-w-5xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-[40px] font-black text-[#1E293B] mb-4">Questions & Answers</h2>
                            <p className="text-[#64748B] text-xl font-medium">Everything you need to know about our plans.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                            {FAQS.map((faq, idx) => (
                                <div key={idx} className="group">
                                    <h4 className="text-[#1E293B] font-black text-xl mb-4 flex items-start gap-3 transition-colors group-hover:text-blue-600">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                        {faq.question}
                                    </h4>
                                    <p className="text-[#64748B] font-bold leading-relaxed pl-5 text-[15px]">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Banner */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#1E293B] rounded-[48px] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20"
                    >
                        {/* Animated background Blobs */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/40 rounded-full blur-[100px] -mr-48 -mt-48" />
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/40 rounded-full blur-[100px] -ml-48 -mb-48" />
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h2 className="text-[40px] md:text-[64px] font-black mb-8 tracking-tighter leading-none">Ready to land your <br /> dream job?</h2>
                            <p className="text-gray-400 text-xl md:text-2xl font-bold mb-16 max-w-2xl mx-auto">No commitment required. Try any Pro plan free for 14 days and cancel anytime.</p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <button className="bg-blue-600 text-white px-12 py-6 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-blue-600/40">
                                    Get Started for Free <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="bg-white/5 backdrop-blur-md text-white border-2 border-white/10 px-12 py-6 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                                    <CreditCard size={24} />
                                    How it works
                                </button>
                            </div>

                            <div className="mt-16 flex items-center justify-center gap-8 opacity-50 grayscale contrast-200">
                                <ShieldCheck size={40} />
                                <Lock size={40} />
                                <CreditCard size={40} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </CandidateLayout>
    )
}

// Dummy Lock component since lucide-react might not have it or spelled differently
const Lock = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export default PricingPage
