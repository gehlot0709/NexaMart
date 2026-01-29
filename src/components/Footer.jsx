import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-1 space-y-6">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                            <span className="text-white font-black text-xl">N</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white uppercase">
                            Nexa<span className="text-blue-500">Core</span>
                        </span>
                    </Link>
                    <p className="text-slate-400 leading-relaxed font-medium">
                        The future of luxury commerce. Engineered for speed, designed for aesthetics.
                    </p>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                    <ul className="space-y-4 text-slate-400">
                        <li><Link to="/shop" className="hover:text-blue-400 transition-colors">Shop All</Link></li>
                        <li><Link to="/categories" className="hover:text-blue-400 transition-colors">Categories</Link></li>
                        <li><Link to="/offers" className="hover:text-blue-400 transition-colors">Special Offers</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-6">Support</h4>
                    <ul className="space-y-4 text-slate-400">
                        <li><Link to="/support" className="hover:text-blue-400 transition-colors">Support Center</Link></li>
                        <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/shipping" className="hover:text-blue-400 transition-colors">Shipping Info</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-6">Connect With Us</h4>
                    <div className="flex space-x-4">
                        <a href="#" className="p-3 bg-slate-900 rounded-full hover:bg-blue-600 transition-all"><Facebook className="h-5 w-5" /></a>
                        <a href="#" className="p-3 bg-slate-900 rounded-full hover:bg-blue-400 transition-all"><Twitter className="h-5 w-5" /></a>
                        <a href="#" className="p-3 bg-slate-900 rounded-full hover:bg-pink-500 transition-all"><Instagram className="h-5 w-5" /></a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 text-center text-slate-500 text-sm">
                <p>&copy; 2026 NexaMart Inc. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
