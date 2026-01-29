import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, Package, Users, ShoppingCart, CheckCircle, XCircle, LayoutDashboard, Database, ListOrdered, UserCheck, BarChart2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [chartType, setChartType] = useState('daily');
    const [currentProduct, setCurrentProduct] = useState({ name: '', price: 0, image: '', brand: '', category: '', countInStock: 0, description: '' });
    const { user } = useAuth();

    useEffect(() => {
        if (user?.isAdmin) {
            fetchData();
        }
    }, [activeTab, user]);

    const fetchData = async () => {
        if (!user?.token) return;
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            if (activeTab === 'analytics') {
                const { data } = await axios.get('/api/orders/summary', config);
                setSummary(data);
            } else if (activeTab === 'products') {
                const { data } = await axios.get('/api/products');
                setProducts(data);
            } else if (activeTab === 'orders') {
                const { data } = await axios.get('/api/orders', config);
                setOrders(data);
            } else if (activeTab === 'users') {
                const { data } = await axios.get('/api/users', config);
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Delete this product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/products/${id}`, config);
                setProducts(products.filter(p => p._id !== id));
            } catch (error) { alert('Delete failed'); }
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editMode) {
                await axios.put(`/api/products/${currentProduct._id}`, currentProduct, config);
            } else {
                await axios.post('/api/products', currentProduct, config);
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const deliverHandler = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/orders/${id}/deliver`, {}, config);
            fetchData();
            toast.success('Order marked as delivered');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delivery update failed');
        }
    };

    const [uploading, setUploading] = useState(false);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);

            setCurrentProduct({ ...currentProduct, image: data });
            setUploading(false);
            toast.success('Image uploaded!');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image upload failed');
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950">
            {/* Sidebar */}
            <div className="w-80 glass border-r border-white/5 p-8 space-y-8 hidden lg:block">
                <h2 className="text-3xl font-black mb-12">NexaAdmin</h2>
                <nav className="space-y-4">
                    {[
                        { id: 'analytics', name: 'Analytics', icon: BarChart2 },
                        { id: 'products', name: 'Products', icon: Database },
                        { id: 'orders', name: 'Orders', icon: ListOrdered },
                        { id: 'users', name: 'Users', icon: UserCheck }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-grow p-8 lg:p-16 overflow-y-auto">
                <div className="flex items-center justify-between mb-16">
                    <h1 className="text-5xl font-black capitalize">{activeTab}</h1>
                    {activeTab === 'products' && (
                        <button onClick={() => { setEditMode(false); setCurrentProduct({ name: '', price: 0, image: '', brand: '', category: '', countInStock: 0, description: '' }); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl">
                            <Plus /> Add Product
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-2xl" />)}
                    </div>
                ) : (
                    <div className="space-y-12">
                        {activeTab === 'analytics' && (!summary || summary.totalOrders === 0) && (
                            <div className="glass p-20 rounded-[40px] text-center space-y-4 border border-white/5">
                                <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto" />
                                <h3 className="text-2xl font-black">No Analytics Data Yet</h3>
                                <p className="text-slate-500">Analytics will appear here once you have products and orders. Check console if issues persist.</p>
                                <button onClick={fetchData} className="text-blue-400 font-bold hover:underline">Retry Loading</button>
                            </div>
                        )}

                        {activeTab === 'analytics' && summary && summary.totalOrders > 0 && (
                            <div className="space-y-8 pb-12">
                                {/* Overview Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="glass p-8 rounded-[32px] border-b-4 border-blue-500 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <TrendingUp className="w-16 h-16" />
                                        </div>
                                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">Total Sales</p>
                                        <h3 className="text-4xl font-black text-white">₹{(summary?.totalSales || 0).toFixed(2)}</h3>
                                        <div className="mt-4 flex flex-col gap-2">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-blue-400">Monthly</span>
                                                <span className="text-white">₹{(summary?.monthlySales || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-purple-400">Weekly</span>
                                                <span className="text-white">₹{(summary?.weeklySales || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-indigo-400">Yearly</span>
                                                <span className="text-white">₹{(summary?.yearlySales || 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="glass p-8 rounded-[32px] border-b-4 border-green-500">
                                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">Completed</p>
                                        <h3 className="text-4xl font-black">{summary.completedOrders}</h3>
                                        <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-bold">
                                            <CheckCircle className="w-4 h-4" /> Delivered orders
                                        </div>
                                    </div>
                                    <div className="glass p-8 rounded-[32px] border-b-4 border-orange-500">
                                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">Pending</p>
                                        <h3 className="text-4xl font-black">{summary.pendingOrders}</h3>
                                        <div className="mt-4 flex items-center gap-2 text-orange-400 text-sm font-bold">
                                            <ListOrdered className="w-4 h-4" /> Needs attention
                                        </div>
                                    </div>
                                    <div className="glass p-8 rounded-[32px] border-b-4 border-purple-500">
                                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">Items Sold</p>
                                        <h3 className="text-4xl font-black">{summary.totalItemsSold}</h3>
                                        <div className="mt-4 flex items-center gap-2 text-purple-400 text-sm font-bold">
                                            <Package className="w-4 h-4" /> Total inventory out
                                        </div>
                                    </div>
                                </div>

                                {/* Main Chart Area */}
                                <div className="glass p-10 rounded-[40px] border border-white/5">
                                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                                        <h3 className="text-2xl font-black">Sales Performance</h3>
                                        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 space-x-2">
                                            <button
                                                onClick={() => setChartType('daily')}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${chartType === 'daily' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                Daily (30D)
                                            </button>
                                            <button
                                                onClick={() => setChartType('weekly')}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${chartType === 'weekly' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                Weekly
                                            </button>
                                            <button
                                                onClick={() => setChartType('monthly')}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${chartType === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                Monthly
                                            </button>
                                            <button
                                                onClick={() => setChartType('yearly')}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${chartType === 'yearly' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                Yearly
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-[400px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={
                                                chartType === 'daily' ? summary.salesByDay :
                                                    chartType === 'weekly' ? summary.salesByWeek :
                                                        chartType === 'monthly' ? summary.salesByMonth :
                                                            summary.salesByYear
                                            }>
                                                <defs>
                                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                <XAxis dataKey="_id" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                                    itemStyle={{ color: '#3b82f6' }}
                                                />
                                                <Area type="monotone" dataKey="totalSales" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Product Trends & Stock */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="glass p-10 rounded-[40px] border border-white/5">
                                        <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                            <TrendingUp className="text-green-400" /> Best Sellers
                                        </h3>
                                        <div className="space-y-6">
                                            {summary.topSelling.map((p, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl group hover:bg-white/10 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <span className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">{idx + 1}</span>
                                                        <span className="font-bold group-hover:text-blue-400 transition-colors">{p.name}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black">{p.qty || 0} sold</p>
                                                        <p className="text-xs text-slate-500">${(p.sales || 0).toFixed(0)} revenue</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="glass p-10 rounded-[40px] border border-white/5">
                                        <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                            <AlertTriangle className="text-orange-400" /> Inventory Alerts
                                        </h3>
                                        <div className="space-y-6">
                                            {summary.stockStatus.slice(0, 5).map((p, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                                    <div>
                                                        <span className="font-bold">{p.name}</span>
                                                        <p className="text-xs text-slate-400">{p.category}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${p.stock <= 5 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                            {p.stock} units left
                                                        </span>
                                                        {p.stock <= 2 && <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="glass rounded-[40px] overflow-hidden border border-white/5">
                            {activeTab === 'products' && (
                                <table className="w-full text-left">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Name</th>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Price</th>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Category</th>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Stock</th>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {products.map(p => (
                                            <tr key={p._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6 font-bold">{p.name}</td>
                                                <td className="px-8 py-6 font-black">₹{p.price}</td>
                                                <td className="px-8 py-6 text-blue-400">{p.category}</td>
                                                <td className="px-8 py-6">{p.countInStock}</td>
                                                <td className="px-8 py-6 flex gap-3">
                                                    <button onClick={() => { setCurrentProduct(p); setEditMode(true); setShowModal(true); }} className="p-3 bg-slate-800 hover:bg-white hover:text-slate-900 rounded-xl transition-all">
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => deleteHandler(p._id)} className="p-3 bg-slate-800 hover:bg-red-500 rounded-xl transition-all">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'orders' && (
                                <table className="w-full text-left">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">ID</th>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">User</th>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Products</th>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Total</th>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Delivered</th>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {orders.map(o => (
                                            <tr key={o._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6 font-mono text-xs text-slate-500">{o._id}</td>
                                                <td className="px-8 py-6 font-bold">{o.user?.name || 'Guest'}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        {o.orderItems.map((item, i) => (
                                                            <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded-md border border-white/5 whitespace-nowrap">
                                                                {item.qty}x {item.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 font-black">₹{o.totalPrice}</td>
                                                <td className="px-8 py-6">
                                                    {o.isDelivered ? <span className="text-green-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Delivered</span> : <span className="text-red-400 flex items-center gap-2"><XCircle className="w-4 h-4" /> Pending</span>}
                                                </td>
                                                <td className="px-8 py-6">
                                                    {!o.isDelivered && (
                                                        <button onClick={() => deliverHandler(o._id)} className="px-4 py-2 bg-slate-800 hover:bg-green-600 rounded-xl transition-all text-xs font-bold">
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'users' && (
                                <table className="w-full text-left">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Name</th>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Email</th>
                                            <th className="px-8 py-6 text-slate-400 font-bold uppercase tracking-widest text-xs">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map(u => (
                                            <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-6 font-bold">{u.name}</td>
                                                <td className="px-8 py-6 text-slate-400">{u.email}</td>
                                                <td className="px-8 py-6">
                                                    {u.isAdmin ? <span className="bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-xs font-bold ring-1 ring-blue-500/50">Admin</span> : <span className="text-slate-500 text-xs">User</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative glass w-full max-w-2xl rounded-[40px] p-10 overflow-hidden">
                            <h2 className="text-3xl font-black mb-8">{editMode ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={submitHandler} className="grid grid-cols-2 gap-6">
                                <input type="text" placeholder="Product Name" className="bg-slate-900 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 col-span-2" value={currentProduct.name} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })} required />
                                <input type="number" placeholder="Price" className="bg-slate-900 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={currentProduct.price} onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })} required />
                                <input type="number" placeholder="In Stock" className="bg-slate-900 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={currentProduct.countInStock} onChange={e => setCurrentProduct({ ...currentProduct, countInStock: e.target.value })} required />
                                <select
                                    className="bg-slate-900 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                                    value={currentProduct.category}
                                    onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Mens Wear">Mens Wear</option>
                                    <option value="Women Wear">Women Wear</option>
                                    <option value="Kids Wear">Kids Wear</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Mens Accessories">Mens Accessories</option>
                                    <option value="Women Accessories">Women Accessories</option>
                                </select>
                                <input type="text" placeholder="Brand" className="bg-slate-900 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={currentProduct.brand} onChange={e => setCurrentProduct({ ...currentProduct, brand: e.target.value })} required />
                                <div className="col-span-2">
                                    <label className="block text-slate-400 text-sm font-bold mb-2">Product Image</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            placeholder="Image URL"
                                            className="bg-slate-900 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                                            value={currentProduct.image}
                                            onChange={e => setCurrentProduct({ ...currentProduct, image: e.target.value })}
                                            required
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="image-file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={uploadFileHandler}
                                            />
                                            <button type="button" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-4 rounded-2xl font-bold transition-all border border-white/10">
                                                {uploading ? 'Uploading...' : 'Upload File'}
                                            </button>
                                        </div>
                                    </div>
                                    {currentProduct.image && (
                                        <div className="mt-4 w-full h-32 bg-slate-900 rounded-2xl overflow-hidden border border-white/10">
                                            <img src={currentProduct.image} alt="Preview" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                                <textarea placeholder="Description" className="bg-slate-900 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 col-span-2 h-32" value={currentProduct.description} onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })} required />
                                <div className="col-span-2 flex gap-4 mt-4">
                                    <button type="submit" className="flex-grow bg-blue-600 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/40">{editMode ? 'Update Product' : 'Create Product'}</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="px-8 bg-slate-800 rounded-2xl font-bold">Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default AdminDashboard;
