import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, RefreshCcw, Heart, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);

                if (user && user.token) {
                    const config = {
                        headers: { Authorization: `Bearer ${user.token}` }
                    };
                    const { data: wishData } = await axios.get('/api/users/wishlist', config);
                    setIsWishlisted(wishData.some(item => item._id === id));
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    const toggleWishlist = async () => {
        if (!user || !user.token) {
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            if (isWishlisted) {
                await axios.delete(`/api/users/wishlist/${id}`, config);
                setIsWishlisted(false);
                toast.success('Removed from wishlist');
            } else {
                await axios.post('/api/users/wishlist', { productId: id }, config);
                setIsWishlisted(true);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: product?.name,
            text: product?.description,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard');
            }
        } catch (err) {
            console.error('Sharing failed', err);
        }
    };

    const handleAddToCart = () => {
        if (!user || !user.token) {
            navigate('/login');
            return;
        }
        addToCart(product, qty);
        toast.success(`${product.name} added to cart!`);
        navigate('/cart');
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        if (!user || !user.token) {
            navigate('/login');
            return;
        }
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        setSubmitting(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config);
            toast.success('Review Submitted Successfully!');
            setRating(0);
            setComment('');
            // Refresh product data
            const { data } = await axios.get(`/api/products/${id}`);
            setProduct(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold">Loading Experience...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold">Product not found.</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <Link to="/shop" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-12 transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Shop
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative bg-slate-800 rounded-[48px] overflow-hidden aspect-square border border-white/5 group"
                >
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />

                    {/* Floating Heart Button */}
                    <button
                        onClick={toggleWishlist}
                        className={`absolute top-8 right-8 p-4 rounded-2xl backdrop-blur-md transition-all shadow-xl ${isWishlisted ? 'bg-pink-500 text-white shadow-pink-500/30' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
                    >
                        <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <div className="absolute top-8 left-8 bg-blue-600 px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-blue-500/20">
                        {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
                    </div>
                </motion.div>

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <h1 className="text-5xl font-black flex-grow">{product.name}</h1>
                            <button
                                onClick={handleShare}
                                className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all border border-white/5 active:scale-90"
                                title="Share product"
                            >
                                <Share2 className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} className="w-5 h-5" />)}
                            </div>
                            <span className="text-slate-400">{product.numReviews} Reviews</span>
                        </div>
                    </div>

                    <div className="text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        ₹{product.price}
                    </div>

                    <p className="text-xl text-slate-400 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="h-px bg-slate-800" />

                    {product.countInStock > 0 ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <span className="font-bold text-lg">Quantity</span>
                                <div className="flex items-center border border-slate-700 rounded-2xl p-1 bg-slate-900/50">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 hover:bg-slate-800 rounded-xl font-bold">-</button>
                                    <span className="px-6 font-bold text-xl">{qty}</span>
                                    <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))} className="px-4 py-2 hover:bg-slate-800 rounded-xl font-bold">+</button>
                                </div>
                                <span className="text-slate-500 text-sm font-bold">Only {product.countInStock} left!</span>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-blue-900/40 transition-all flex items-center justify-center gap-4"
                            >
                                <ShoppingCart className="w-7 h-7" />
                                Add to Experience
                            </button>
                        </div>
                    ) : (
                        <button
                            disabled
                            className="w-full bg-slate-800 text-slate-500 py-6 rounded-3xl font-black text-xl cursor-not-allowed border border-white/5"
                        >
                            Sold Out
                        </button>
                    )}

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-4 mt-12">
                        <div className="glass p-4 rounded-2xl flex items-center gap-4">
                            <ShieldCheck className="text-blue-400 w-8 h-8" />
                            <span className="text-sm font-semibold text-slate-300">2-Year Warranty</span>
                        </div>
                        <div className="glass p-4 rounded-2xl flex items-center gap-4">
                            <RefreshCcw className="text-blue-400 w-8 h-8" />
                            <span className="text-sm font-semibold text-slate-300">30-Day Returns</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Reviews Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                    <h2 className="text-4xl font-black">Customer Experience</h2>
                    {(product.reviews?.length || 0) === 0 && <p className="text-slate-500 text-lg">No reviews yet. Be the first to share your experience!</p>}
                    <div className="space-y-6">
                        {(product.reviews || []).map((review) => (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={review._id} className="glass p-8 rounded-[32px] space-y-4">
                                <div className="flex justify-between items-center">
                                    <strong className="text-xl">{review.name}</strong>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => <Star key={i} fill={i < review.rating ? 'currentColor' : 'none'} className="w-4 h-4" />)}
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                                <p className="text-slate-300 leading-relaxed italic">"{review.comment}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="glass p-12 rounded-[40px] h-fit sticky top-12">
                    <h3 className="text-3xl font-black mb-8">Share Your Thoughts</h3>
                    {user ? (
                        <form onSubmit={submitReviewHandler} className="space-y-6">
                            <div className="space-y-4">
                                <label className="block font-bold">Rating</label>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setRating(num)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all ${rating === num ? 'bg-blue-600 scale-110 shadow-lg shadow-blue-900/40' : 'bg-slate-800 hover:bg-slate-700'}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block font-bold">Comment</label>
                                <textarea
                                    className="w-full bg-slate-900 border border-white/5 rounded-2xl p-6 outline-none focus:ring-2 focus:ring-blue-500 h-32 transition-all resize-none"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about your purchase..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
                            >
                                {submitting ? 'Sharing...' : 'Submit Review'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8 space-y-6">
                            <p className="text-slate-400 text-lg">Please login to write a review</p>
                            <Link to="/login" className="inline-block bg-blue-600 px-8 py-3 rounded-xl font-bold">Login Now</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
