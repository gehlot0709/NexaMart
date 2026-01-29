import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailOTP, setEmailOTP] = useState('');
    const [sentOTP, setSentOTP] = useState(null);
    const [step, setStep] = useState(1); // 1: Input, 2: OTP

    const { register, error, loading } = useAuth();
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/send-otp', { email });
            setSentOTP(data.emailOTP);
            setStep(2);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (emailOTP !== sentOTP) {
            alert('Invalid OTP code. Please try again.');
            return;
        }

        const success = await register(name, email, password, emailOTP);
        if (success) navigate('/');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-md p-10 rounded-[32px] space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-white">{step === 1 ? 'Create Account' : 'Verify Identity'}</h1>
                    <p className="text-slate-400">{step === 1 ? 'Join the NexaMart community' : 'Enter the code sent to your email'}</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center text-sm">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400 px-1">Full Name</label>
                            <div className="relative">
                                <input type="text" required className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={name} onChange={(e) => setName(e.target.value)} />
                                <User className="absolute left-4 top-4 text-slate-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400 px-1">Email Address</label>
                            <div className="relative">
                                <input type="email" required className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Mail className="absolute left-4 top-4 text-slate-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400 px-1">Password</label>
                            <div className="relative">
                                <input type="password" required className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Lock className="absolute left-4 top-4 text-slate-500" />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/30 transition-all flex items-center justify-center gap-2">
                            Next: Send Verification Code
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400 px-1">Email OTP</label>
                            <div className="relative">
                                <input type="text" placeholder="6-digit code" required className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center tracking-[1em] font-black" value={emailOTP} onChange={(e) => setEmailOTP(e.target.value)} />
                                <Mail className="absolute left-4 top-4 text-slate-500" />
                            </div>
                        </div>

                        <button disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/30 transition-all flex items-center justify-center gap-2">
                            {loading ? 'Finalizing...' : (
                                <>
                                    Verify & Create Account
                                    <ShieldCheck className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <button type="button" onClick={() => setStep(1)} className="w-full text-slate-400 text-sm hover:text-white transition-colors">
                            Go Back & Edit Details
                        </button>
                    </form>
                )}

                <p className="text-center text-slate-400 pt-4">
                    Already have an account? <Link to="/login" className="text-blue-400 font-bold hover:underline">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
