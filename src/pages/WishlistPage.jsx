import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useAuth();


    const fetchWishlist = async () => {
        if (!user) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('/api/users/wishlist', config);
            setWishlist(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setLoading(false);
        }
    }, [user]);

    const removeHandler = async (id) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`/api/users/wishlist/${id}`, config);
            setWishlist(wishlist.filter(item => item._id !== id));
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const handleAddToCart = (p) => {
        addToCart(p, 1);
        toast.success(`${p.name} added to cart!`);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <h1 className="text-5xl font-black mb-12 flex items-center gap-4">
                <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
                My Wishlist
            </h1>

            {wishlist.length === 0 ? (
                <div className="glass p-20 rounded-[40px] text-center space-y-6 border border-white/5">
                    <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto">
                        <Heart className="w-10 h-10 text-slate-500" />
                    </div>
                    <h2 className="text-3xl font-black">Your wishlist is empty</h2>
                    <p className="text-slate-500 max-w-md mx-auto">Save items you love here and they'll be waiting for you when you're ready to buy!</p>
                    <Link to="/shop" className="inline-block bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-900/40">
                        Explore Shop
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode='popLayout'>
                        {wishlist.map((product) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={product._id}
                                className="glass group relative rounded-[32px] overflow-hidden hover:border-blue-500/50 transition-colors"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <button
                                        onClick={() => removeHandler(product._id)}
                                        className="absolute top-4 right-4 bg-red-500/20 text-red-400 p-2 rounded-xl border border-red-500/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow overflow-hidden">
                                            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">{product.category}</p>
                                            <h3 className="text-md font-bold truncate pr-4">{product.name}</h3>
                                        </div>
                                        <span className="text-lg font-black text-white">₹{product.price}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex-grow py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            To Cart
                                        </button>
                                        <Link
                                            to={`/product/${product._id}`}
                                            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                                        >
                                            <ArrowRight className="w-5 h-5 text-slate-400" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
