import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleLogin, error, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        /* global google */
        const loadGoogle = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                google.accounts.id.initialize({
                    client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
                    callback: handleGoogleResponse
                });
                google.accounts.id.renderButton(
                    document.getElementById("googleSignIn"),
                    { theme: "outline", size: "large", width: "100%" }
                );
            };
            document.body.appendChild(script);
        };
        loadGoogle();
    }, []);

    const handleGoogleResponse = async (response) => {
        const success = await googleLogin(response.credential);
        if (success) navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
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
                    <h1 className="text-4xl font-black">Welcome Back</h1>
                    <p className="text-slate-400">Please enter your credentials</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400 px-1">Email Address</label>
                        <div className="relative">
                            <input type="email" required className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Mail className="absolute left-4 top-4 text-slate-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between px-1">
                            <label className="text-sm font-semibold text-slate-400">Password</label>
                            <a href="#" className="text-sm text-blue-400 hover:underline">Forgot?</a>
                        </div>
                        <div className="relative">
                            <input type="password" required className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Lock className="absolute left-4 top-4 text-slate-500" />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/30 transition-all flex items-center justify-center gap-2">
                        {loading ? 'Authenticating...' : (
                            <>
                                Login to Account
                                <LogIn className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or continue with</span></div>
                </div>

                <div id="googleSignIn" className="w-full"></div>

                <p className="text-center text-slate-400 pt-4">
                    Don't have an account? <Link to="/register" className="text-blue-400 font-bold hover:underline">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
