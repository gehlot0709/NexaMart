import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, LogOut, Settings, Package, Star, LifeBuoy, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const searchHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/shop?search=${keyword}`);
        } else {
            navigate('/shop');
        }
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="glass sticky top-0 z-50 px-8 py-5 flex items-center justify-between border-b border-white/5 backdrop-blur-2xl">
            <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                    <span className="text-white font-black text-xl">N</span>
                </div>
                <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
                    Nexa<span className="text-blue-500">Core</span>
                </span>
            </Link>

            <div className="hidden md:flex items-center space-x-10">
                <Link to="/shop" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all">Shop</Link>
                <form onSubmit={searchHandler} className="relative group">
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 w-64 transition-all placeholder:text-slate-600"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit">
                        <Search className="absolute right-3 top-2.5 text-slate-500 h-4 w-4" />
                    </button>
                </form>

                <div className="flex items-center gap-6 border-l border-white/10 pl-6">
                    <Link to="/cart" className="relative p-2 text-slate-400 hover:text-white transition-colors">
                        <ShoppingCart className="h-6 w-6" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-blue-600 text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-black animate-pulse">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user && user.isAdmin && (
                        <Link to="/admin" className="text-xs font-black uppercase tracking-tighter text-blue-500 border border-blue-500/20 px-3 py-1 rounded-md hover:bg-blue-500/10 transition-all">Admin</Link>
                    )}

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 transition-all group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-white">{user.name}</span>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10, rotateX: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10, rotateX: -10 }}
                                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                            className="absolute right-0 mt-4 w-72 bg-[#0a0f1c] rounded-[32px] border border-white/10 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden perspective-1000"
                                        >
                                            <div className="p-4 border-b border-white/5 bg-white/5 mb-2 rounded-t-[24px]">
                                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 mb-1">Signed in as</p>
                                                <p className="font-bold text-white truncate">{user.email}</p>
                                            </div>

                                            <div className="space-y-1 p-2">
                                                {user.isAdmin ? (
                                                    <>
                                                        <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group relative overflow-hidden">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-500/0 group-hover:shadow-blue-500/20">
                                                                <Settings className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-black text-white uppercase tracking-widest">Admin Panel</span>
                                                                <span className="text-[10px] text-slate-500">System Control</span>
                                                            </div>
                                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </Link>
                                                        <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center group-hover:bg-slate-600 group-hover:text-white transition-all">
                                                                <Settings className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-black text-white uppercase tracking-widest">Security</span>
                                                                <span className="text-[10px] text-slate-500">Update Credentials</span>
                                                            </div>
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                                <Settings className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-black text-white uppercase tracking-widest">Profile</span>
                                                                <span className="text-[10px] text-slate-500">Personal Info</span>
                                                            </div>
                                                        </Link>

                                                        <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group">
                                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                                <Package className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-black text-white uppercase tracking-widest">Orders</span>
                                                                <span className="text-[10px] text-slate-500">Purchase History</span>
                                                            </div>
                                                        </Link>

                                                        <Link to="/wishlist" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group">
                                                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all">
                                                                <Heart className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-black text-white uppercase tracking-widest">Wishlist</span>
                                                                <span className="text-[10px] text-slate-500">Your Favorites</span>
                                                            </div>
                                                        </Link>

                                                        <Link to="/support" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group">
                                                            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
                                                                <LifeBuoy className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-black text-white uppercase tracking-widest">Support</span>
                                                                <span className="text-[10px] text-slate-500">Help & Feedback</span>
                                                            </div>
                                                        </Link>
                                                    </>
                                                )}

                                                <div className="h-px bg-white/5 my-2 mx-3" />

                                                <button
                                                    onClick={() => { logout(); setIsProfileOpen(false); }}
                                                    className="w-full flex items-center gap-4 p-3 rounded-[20px] hover:bg-red-500/10 transition-all group"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg shadow-red-500/0 group-hover:shadow-red-500/20">
                                                        <LogOut className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-xs font-black text-red-500 uppercase tracking-widest">Logout</span>
                                                        <span className="text-[10px] text-red-500/50">End current session</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-white text-slate-950 px-8 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95">
                            Login
                        </Link>
                    )}
                </div>
            </div>

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-[#0a0f1c] border-b border-white/5 p-6 flex flex-col space-y-4 md:hidden shadow-2xl backdrop-blur-xl"
                    >
                        <Link to="/shop" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-300 hover:text-white">Shop</Link>
                        <Link to="/cart" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-300 hover:text-white">Cart ({cartCount})</Link>

                        {user ? (
                            <>
                                <div className="h-px bg-white/10 my-2" />
                                <div className="flex items-center gap-3 px-2 py-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-bold text-white">{user.name}</span>
                                </div>

                                {user.isAdmin && (
                                    <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-blue-400 font-bold px-2">
                                        <Settings className="w-5 h-5" /> Admin Panel
                                    </Link>
                                )}
                                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-slate-400 hover:text-white font-bold px-2">
                                    <LogOut className="w-5 h-5" /> Profile
                                </Link>
                                <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-slate-400 hover:text-white font-bold px-2">
                                    <Package className="w-5 h-5" /> Orders
                                </Link>
                                <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-slate-400 hover:text-white font-bold px-2">
                                    <Heart className="w-5 h-5" /> Wishlist
                                </Link>

                                <button onClick={logout} className="text-left text-red-500 font-bold flex items-center gap-3 px-2 pt-2">
                                    <LogOut className="w-5 h-5" /> Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsOpen(false)} className="bg-blue-600 text-white text-center py-3 rounded-xl font-bold">Login</Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;
