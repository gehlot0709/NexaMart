import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ShoppingCart, Eye, Star, Heart } from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const querySearch = searchParams.get('search') || '';
    const queryCategory = searchParams.get('category') || 'All';
    const [searchTerm, setSearchTerm] = useState(querySearch);
    const [sortBy, setSortBy] = useState('newest');
    const [activeCategory, setActiveCategory] = useState(queryCategory);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    const categories = ['All', 'Electronics', 'Mens Wear', 'Women Wear', 'Kids Wear', 'Furniture', 'Mens Accessories', 'Women Accessories'];

    useEffect(() => {
        setSearchTerm(querySearch);
    }, [querySearch]);

    const handleQuickAdd = (p) => {
        if (!user) {
            navigate('/login');
            return;
        }
        addToCart(p, 1);
        toast.success(`${p.name} added to cart!`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: prodData } = await axios.get('/api/products');
                setProducts(prodData);

                if (user && user.token) {
                    const config = {
                        headers: { Authorization: `Bearer ${user.token}` }
                    };
                    const { data: wishData } = await axios.get('/api/users/wishlist', config);
                    setWishlist(wishData.map(i => i._id));
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const toggleWishlist = async (productId) => {
        if (!user || !user.token) {
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            if (wishlist.includes(productId)) {
                await axios.delete(`/api/users/wishlist/${productId}`, config);
                setWishlist(wishlist.filter(id => id !== productId));
                toast.success('Removed from wishlist');
            } else {
                await axios.post('/api/users/wishlist', { productId }, config);
                setWishlist([...wishlist, productId]);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    const filteredProducts = products
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(p => activeCategory === 'All' || p.category === activeCategory)
        .sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            return 0; // Default
        });

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <h1 className="text-4xl font-extrabold">Shop Collection</h1>

                <div className="flex flex-col md:flex-row gap-4 flex-grow max-w-2xl">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <select
                                className="appearance-none bg-slate-800 border border-slate-700 rounded-2xl py-3 px-6 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                            <SlidersHorizontal className="absolute right-4 top-3.5 text-slate-500 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Categories Sidebar */}
                <aside className="w-full lg:w-64 space-y-8">
                    <div className="glass p-8 rounded-[32px] border-l-4 border-blue-600">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                            <Filter className="w-5 h-5" /> Categories
                        </h3>
                        <div className="flex flex-wrap lg:flex-col gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all text-left ${activeCategory === cat ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="flex-grow">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-slate-800 h-80 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {filteredProducts.map((product) => (
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
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                <button
                                                    onClick={() => toggleWishlist(product._id)}
                                                    className={`p-3 rounded-full transition-all hover:scale-110 ${wishlist.includes(product._id) ? 'bg-pink-600 text-white' : 'bg-white text-slate-900 hover:text-pink-600'}`}
                                                >
                                                    <Heart size={20} fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} />
                                                </button>
                                                <Link to={`/product/${product._id}`} className="bg-white text-slate-900 p-3 rounded-full hover:scale-110 transition-transform hover:text-blue-600">
                                                    <Eye className="w-6 h-6" />
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">{product.category}</p>
                                                    <h3 className="text-lg font-bold truncate pr-4">{product.name}</h3>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="flex text-yellow-500">
                                                            <Star size={14} fill={product.rating > 0 ? 'currentColor' : 'none'} className={product.rating > 0 ? 'text-yellow-500' : 'text-slate-600'} />
                                                        </div>
                                                        <span className="text-xs text-slate-400 font-bold">{product.rating.toFixed(1)} ({product.numReviews})</span>
                                                    </div>
                                                </div>
                                                <span className="text-xl font-black text-white">₹{product.price}</span>
                                            </div>

                                            <button
                                                onClick={() => handleQuickAdd(product)}
                                                disabled={product.countInStock === 0}
                                                className={`w-full py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${product.countInStock === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-white hover:text-slate-950 text-white'}`}
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                {product.countInStock === 0 ? 'Sold Out' : 'Quick Add'}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {
                !loading && filteredProducts.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-2xl text-slate-500">No products found matching your search.</p>
                    </div>
                )
            }
        </div >
    );
};

export default ShopPage;
