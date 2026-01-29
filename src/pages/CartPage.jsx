import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowRight, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
    const { cartItems, addToCart, removeFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

    const checkoutHandler = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8">
                <div className="bg-slate-800 p-12 rounded-full">
                    <ShoppingBag className="w-24 h-24 text-slate-600" />
                </div>
                <h1 className="text-4xl font-black">Your bag is empty</h1>
                <p className="text-slate-400 max-w-md text-center">Looks like you haven't added anything to your cart yet. Let's find something perfect for you.</p>
                <Link to="/shop" className="bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-900/40">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-black mb-16">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-8">
                    <AnimatePresence>
                        {cartItems.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                key={item._id}
                                className="glass p-6 rounded-[32px] flex flex-col md:flex-row items-center gap-8 relative"
                            >
                                <div className="w-40 h-40 bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-grow space-y-2 text-center md:text-left">
                                    <h3 className="text-2xl font-bold">{item.name}</h3>
                                    <p className="text-blue-400 font-bold uppercase tracking-widest text-sm">{item.category}</p>
                                    <p className="text-slate-400 text-sm">{item.brand}</p>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-tighter">Quantity</p>
                                        <select
                                            value={item.qty}
                                            onChange={(e) => addToCart(item, Number(e.target.value))}
                                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            {[...Array(item.countInStock).keys()].map(x => (
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-black">₹{(item.price * item.qty).toFixed(2)}</p>
                                        <p className="text-xs text-slate-500">₹{item.price} each</p>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="h-fit sticky top-32">
                    <div className="glass p-10 rounded-[40px] space-y-8">
                        <h2 className="text-3xl font-black">Summary</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Estimated Shipping</span>
                                <span className="text-green-500 font-bold">FREE</span>
                            </div>
                            <div className="h-px bg-slate-800" />
                            <div className="flex justify-between text-2xl font-black">
                                <span>Total</span>
                                <span>₹{subtotal}</span>
                            </div>
                        </div>

                        <button
                            onClick={checkoutHandler}
                            className="w-full bg-white text-slate-900 py-6 rounded-3xl font-black text-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-4 shadow-2xl"
                        >
                            Checkout Now
                            <CreditCard className="w-6 h-6" />
                        </button>

                        <Link to="/shop" className="block text-center text-slate-400 hover:text-white font-bold transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
