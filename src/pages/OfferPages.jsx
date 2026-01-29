import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Zap, Percent, Gift } from 'lucide-react';

const categories = ['Electronics', 'Mens Wear', 'Women Wear', 'Kids Wear', 'Furniture', 'Mens Accessories', 'Women Accessories'];

export const CategoriesPage = () => (
    <div className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-6xl font-black mb-16">Browse Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
                <Link key={cat} to={`/shop?category=${cat}`} className="group relative h-80 glass rounded-[40px] overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors" />
                    <div className="absolute inset-x-8 bottom-8">
                        <p className="text-blue-400 font-bold uppercase tracking-widest mb-2">Collection</p>
                        <h3 className="text-3xl font-black group-hover:translate-x-2 transition-transform">{cat}</h3>
                    </div>
                </Link>
            ))}
        </div>
    </div>
);

export const OffersPage = () => (
    <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
            <h1 className="text-6xl font-black mb-4">Limited Time Offers</h1>
            <p className="text-slate-400 text-xl font-bold">Exclusive savings for our NexaClub members</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-blue-600 to-blue-800 p-12 rounded-[40px] flex flex-col justify-between h-[400px]">
                <div>
                    <Zap className="w-12 h-12 mb-6" />
                    <h2 className="text-4xl font-black mb-4">Summer Flash Sale</h2>
                    <p className="text-blue-100 text-lg">Get 30% off all electronics and gadgets. Limited time only!</p>
                </div>
                <div className="text-6xl font-black">30% OFF</div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-purple-600 to-purple-800 p-12 rounded-[40px] flex flex-col justify-between h-[400px]">
                <div>
                    <Gift className="w-12 h-12 mb-6" />
                    <h2 className="text-4xl font-black mb-4">Bundle & Save</h2>
                    <p className="text-purple-100 text-lg">Buy any two accessories and get a third one absolutely free.</p>
                </div>
                <div className="text-6xl font-black">BUY 2 GET 1</div>
            </motion.div>
        </div>
    </div>
);
