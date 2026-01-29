import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.put('/api/users/profile', { name, email, password }, config);

            localStorage.setItem('userInfo', JSON.stringify(data));
            setMessage({ type: 'success', text: 'Profile Updated Successfully!' });
            setLoading(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || error.message });
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[40px] p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />

                <h1 className="text-5xl font-black mb-12 flex items-center gap-4">
                    <User className="w-12 h-12 text-blue-500" />
                    Account Settings
                </h1>

                {message && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`p-4 rounded-2xl mb-8 flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/50' : 'bg-red-500/10 text-red-400 border border-red-500/50'}`}>
                        {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
                        {message.text}
                    </motion.div>
                )}

                <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Full Name</label>
                        <div className="relative">
                            <input type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none" value={name} onChange={(e) => setName(e.target.value)} />
                            <User className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Email Address</label>
                        <div className="relative">
                            <input type="email" className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Mail className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">New Password</label>
                        <div className="relative">
                            <input type="password" placeholder="Leave blank to keep same" className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Lock className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Confirm Password</label>
                        <div className="relative">
                            <input type="password" placeholder="Re-type new password" className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <Lock className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 transition-all">
                            <Save className="w-6 h-6" />
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ProfilePage;
