import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck, Cpu, Globe, Zap, Database } from 'lucide-react';
import Model3D from '../components/Model3D';
import ParticleBackground from '../components/ParticleBackground';

const FloatingIcon = ({ icon: Icon, delay = 0, x = 0, y = 0 }) => (
    <motion.div
        animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
        }}
        transition={{
            duration: 4,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
        }}
        className="absolute p-4 glass rounded-2xl text-blue-400/50 hidden lg:block"
        style={{ left: x, top: y }}
    >
        <Icon size={32} />
    </motion.div>
);

const HomePage = () => {
    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            <ParticleBackground />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                {/* Background Accent */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 relative z-10 w-full">
                    <div className="space-y-10 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-black tracking-widest uppercase mb-6">
                                The Future of E-Commerce
                            </span>
                            <h1 className="text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter mb-8">
                                NEXA<br />
                                <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-400 bg-clip-text text-transparent">
                                    CORE
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed font-medium mx-auto lg:mx-0"
                        >
                            Experience a new dimension of luxury. Powered by next-gen tech,
                            curated for the avant-garde aesthetic.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
                        >
                            <Link
                                to="/shop"
                                className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/30"
                            >
                                Start Exploring
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/categories" className="glass px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                                View Categories
                            </Link>
                        </motion.div>
                    </div>

                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <Model3D />
                        </motion.div>

                        {/* Floating elements for tech feel */}
                        <FloatingIcon icon={Cpu} x="10%" y="10%" delay={0} />
                        <FloatingIcon icon={Globe} x="85%" y="20%" delay={1} />
                        <FloatingIcon icon={Zap} x="0%" y="70%" delay={2} />
                        <FloatingIcon icon={Database} x="80%" y="80%" delay={1.5} />
                    </div>
                </div>
            </section>

            {/* Tech Specs / Features */}
            <section className="max-w-7xl mx-auto px-6 py-32 space-y-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { icon: ShieldCheck, title: "Quantum Security", desc: "Military-grade encryption for every heartbeat of your transaction." },
                        { icon: Truck, title: "Neural Delivery", desc: "Optimized logistics platform with hyper-fast global fulfillment." },
                        { icon: Star, title: "Curation AI", desc: "Hand-picked luxury items selected by our industry-leading algorithms." }
                    ].map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="glass p-10 rounded-[40px] group hover:border-blue-500/50 transition-all text-center lg:text-left"
                        >
                            <div className="bg-blue-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                                <feat.icon size={40} className="text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{feat.title}</h3>
                            <p className="text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative p-12 md:p-24 rounded-[60px] overflow-hidden text-center border border-white/5"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-indigo-900/20" />
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter italic">BEYOND THE HORIZON.</h2>
                        <p className="text-xl text-slate-400 max-w-xl mx-auto font-medium">
                            Join the next generation of digital commerce. Get priority access to limited collections.
                        </p>
                        <Link to="/register" className="inline-block bg-white text-slate-950 px-14 py-6 rounded-2xl font-black text-xl hover:bg-blue-50 transition-transform active:scale-95">
                            JOIN THE CLUB
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default HomePage;
