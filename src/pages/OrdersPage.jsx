import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();


    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="max-w-6xl mx-auto px-6 py-20">
            <h1 className="text-5xl font-black mb-12 flex items-center gap-4">
                <Package className="w-12 h-12 text-blue-500" />
                Your Orders
            </h1>

            {orders.length === 0 ? (
                <div className="glass p-20 rounded-[40px] text-center space-y-6 border border-white/5">
                    <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-10 h-10 text-slate-500" />
                    </div>
                    <h2 className="text-3xl font-black">No orders yet</h2>
                    <p className="text-slate-500 max-w-md mx-auto">You haven't placed any orders. Start exploring our premium collection and get your first item today!</p>
                    <Link to="/shop" className="inline-block bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-900/40">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={order._id}
                            className="glass rounded-[40px] overflow-hidden border border-white/5 hover:border-white/10 transition-all group"
                        >
                            <div className="bg-white/5 px-10 py-6 flex flex-wrap items-center justify-between gap-6 border-b border-white/5">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Order Placed</span>
                                        <span className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Total Amount</span>
                                        <span className="font-bold text-blue-400">₹{order.totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex flex-col h-full border-l border-white/10 pl-6">
                                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Order ID</span>
                                        <span className="font-mono text-xs text-slate-400">#{order._id}</span>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-xs uppercase tracking-tighter ${order.isDelivered ? 'bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)] animate-pulse'}`}>
                                    {order.isDelivered ? <><CheckCircle size={14} /> Delivered</> : <><Clock size={14} /> In Transit</>}
                                </div>
                            </div>

                            <div className="p-10 flex flex-col md:flex-row gap-8">
                                <div className="flex-grow space-y-6">
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-6 group/item">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform" />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-lg">{item.name}</h4>
                                                <p className="text-slate-500 text-sm font-bold">Qty: {item.qty} × ₹{item.price}</p>
                                            </div>
                                            <Link to={`/product/${item.product}`} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                                                <ChevronRight className="w-5 h-5 text-slate-400" />
                                            </Link>
                                        </div>
                                    ))}
                                </div>

                                <div className="md:w-64 flex flex-col justify-end">
                                    {order.isDelivered ? (
                                        <div className="p-6 bg-green-500/5 rounded-3xl border border-green-500/10">
                                            <p className="text-green-400 text-sm font-black uppercase text-center">Delivered Successfully!</p>
                                            <p className="text-slate-500 text-[10px] text-center mt-1">On {new Date(order.deliveredAt).toLocaleDateString()}</p>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-orange-500/5 rounded-3xl border border-orange-500/10">
                                            <p className="text-orange-400 text-sm font-black uppercase text-center">Estimation: 2-3 Days</p>
                                            <p className="text-slate-500 text-[10px] text-center mt-1">Tracking updates available soon</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
