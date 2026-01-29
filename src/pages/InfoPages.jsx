import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Book, HelpCircle, Truck } from 'lucide-react';

const InfoPage = ({ title, content, icon: Icon }) => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-24">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-[40px] p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Icon className="w-64 h-64" />
                </div>
                <h1 className="text-6xl font-black mb-12 flex items-center gap-6">
                    <Icon className="w-16 h-16 text-blue-500" />
                    {title}
                </h1>
                <div className="prose prose-invert prose-xl max-w-none text-slate-300 leading-relaxed space-y-8">
                    {content.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
                </div>
            </motion.div>
        </div>
    );
};

export const SupportPage = () => <InfoPage icon={HelpCircle} title="Customer Support" content="Our support team is available 24/7 to assist you with any inquiries regarding your orders, product details, or technical issues. \n\nYou can reach us via email at nexa0207@gmail.com or through our live chat system during business hours. \n\nWe strive to resolve all tickets within 24 hours." />;

export const TermsPage = () => <InfoPage icon={Book} title="Terms of Service" content="By using NexaMart, you agree to comply with our commercial terms. All purchases are final once processed. \n\nUsers must provide accurate information during account registration. We reserve the right to terminate accounts that violate our community guidelines. \n\nIntellectual property on this site is owned by NexaMart Corporation." />;

export const PrivacyPage = () => <InfoPage icon={Shield} title="Privacy Policy" content="Your data security is our top priority. We use advanced encryption to protect your personal and payment information. \n\nWe do not share your data with third-party advertisers. Cookies are used only to improve your shopping experience and remember your cart items. \n\nYou have the right to request data deletion at any time." />;

export const ShippingPage = () => <InfoPage icon={Truck} title="Shipping Info" content="We provide worldwide shipping with real-time tracking. Standard delivery takes 3-5 business days. \n\nExpress shipping options are available at checkout for faster delivery (1-2 days). \n\nOrders over $500 qualify for free premium shipping globally." />;
