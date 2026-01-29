import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, CheckCircle, ArrowRight, Wallet, QrCode, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import upiQr from '../assets/upi-qr.jpg';

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState({ street: '', city: '', postalCode: '', country: '' });
    const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // Razorpay, COD, UPI
    const [upiScreenshot, setUpiScreenshot] = useState(null); // New state for file
    const [placingOrder, setPlacingOrder] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const handleNextStep = () => {
        if (!address.street || !address.city || !address.postalCode) {
            alert('Please fill all shipping details');
            return;
        }
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        if (placingOrder) return;
        if (!address.street || !address.city || !address.postalCode) {
            alert('Shipping address is missing. Please go back and fill it.');
            setStep(1);
            return;
        }

        setPlacingOrder(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) {
                alert('Please login to place an order');
                navigate('/login');
                setPlacingOrder(false);
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const taxPrice = subtotal * 0.18;
            const shippingPrice = subtotal > 1000 ? 0 : 50;
            const totalPrice = subtotal + shippingPrice + taxPrice;

            if (paymentMethod === 'Razorpay') {
                // 1. Create Razorpay order on backend
                const { data: razorpayOrder } = await axios.post('/api/orders/razorpay', { amount: totalPrice }, config);

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id',
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: "NexaMart",
                    description: "Purchase from NexaMart",
                    order_id: razorpayOrder.id,
                    handler: async function (response) {
                        try {
                            const orderData = {
                                orderItems: cartItems.map(item => ({
                                    name: item.name,
                                    qty: item.qty,
                                    image: item.image,
                                    price: item.price,
                                    product: item._id
                                })),
                                shippingAddress: {
                                    address: address.street,
                                    city: address.city,
                                    postalCode: address.postalCode,
                                    country: address.country || 'India'
                                },
                                paymentMethod: 'Razorpay',
                                itemsPrice: subtotal,
                                shippingPrice: shippingPrice,
                                taxPrice: taxPrice,
                                totalPrice: totalPrice,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderDetails: {
                                    orderItems: cartItems.map(item => ({
                                        name: item.name,
                                        qty: item.qty,
                                        image: item.image,
                                        price: item.price,
                                        product: item._id
                                    })),
                                    shippingAddress: {
                                        address: address.street,
                                        city: address.city,
                                        postalCode: address.postalCode,
                                        country: address.country || 'India'
                                    },
                                    itemsPrice: subtotal,
                                    shippingPrice: shippingPrice,
                                    taxPrice: taxPrice,
                                    totalPrice: totalPrice
                                }
                            };

                            await axios.post('/api/orders/verify', orderData, config);

                            setStep(3);
                            setTimeout(() => {
                                clearCart();
                                navigate('/orders');
                            }, 3000);
                        } catch (err) {
                            console.error(err);
                            alert('Payment verification failed');
                            setPlacingOrder(false);
                        }
                    },
                    prefill: {
                        name: userInfo.name,
                        email: userInfo.email,
                    },
                    theme: {
                        color: "#2563eb",
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    alert(response.error.description);
                    setPlacingOrder(false);
                });
                rzp.open();

            } else {
                // Handle COD or UPI (Manual)
                let paymentProofUrl = '';

                if (paymentMethod === 'UPI') {
                    if (!upiScreenshot) {
                        toast.error('Please upload a payment screenshot for UPI orders.');
                        return;
                    }
                    const formData = new FormData();
                    formData.append('image', upiScreenshot);
                    try {
                        const { data: uploadData } = await axios.post('/api/upload', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Bearer ${userInfo.token}`, // Re-using auth token if needed, usually upload is protected or not
                            }
                        });
                        paymentProofUrl = uploadData;
                    } catch (error) {
                        console.error('Upload failed', error);
                        alert('Failed to upload screenshot. Proceeding without it.');
                    }
                }

                const orderData = {
                    orderItems: cartItems.map(item => ({
                        name: item.name,
                        qty: item.qty,
                        image: item.image,
                        price: item.price,
                        product: item._id
                    })),
                    shippingAddress: {
                        address: address.street,
                        city: address.city,
                        postalCode: address.postalCode,
                        country: address.country || 'India'
                    },
                    paymentMethod: paymentMethod, // 'COD' or 'UPI'
                    paymentProof: paymentProofUrl,
                    itemsPrice: subtotal,
                    shippingPrice: subtotal > 1000 ? 0 : 50,
                    taxPrice: subtotal * 0.18,
                    totalPrice: subtotal + (subtotal > 1000 ? 0 : 50) + (subtotal * 0.18),
                    isPaid: paymentMethod === 'UPI', // Mark UPI as Paid (assuming user paid manually) - In real app, admin verifies
                    paidAt: paymentMethod === 'UPI' ? Date.now() : null,
                };

                await axios.post('/api/orders', orderData, config);

                setStep(3);
                setTimeout(() => {
                    clearCart();
                    navigate('/orders');
                }, 3000);
            }

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Order failed to place. Please check your connection.');
            setPlacingOrder(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-24">
            <div className="flex justify-between mb-16 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2" />
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${step >= s ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-900/40' : 'bg-slate-800 text-slate-500'}`}>
                        {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-10 rounded-[40px] space-y-8">
                    <h2 className="text-3xl font-black flex items-center gap-4"><MapPin className="text-blue-400" /> Shipping Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Street Address" className="bg-slate-800 p-4 rounded-2xl outline-none border border-slate-700 col-span-2" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
                        <input type="text" placeholder="City" className="bg-slate-800 p-4 rounded-2xl outline-none border border-slate-700" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
                        <input type="text" placeholder="Postal Code" className="bg-slate-800 p-4 rounded-2xl outline-none border border-slate-700" value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} />
                    </div>
                    <button onClick={handleNextStep} className="w-full bg-blue-600 py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4">
                        Next: Payment <ArrowRight />
                    </button>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-10 rounded-[40px] space-y-8">
                    <h2 className="text-3xl font-black flex items-center gap-4"><CreditCard className="text-blue-400" /> Payment Method</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                            onClick={() => setPaymentMethod('Razorpay')}
                            className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col items-center gap-4 ${paymentMethod === 'Razorpay' ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-900/40' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                        >
                            <CreditCard className="w-8 h-8" />
                            <span className="font-bold">Online (Razorpay)</span>
                        </div>
                        <div
                            onClick={() => setPaymentMethod('UPI')}
                            className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col items-center gap-4 ${paymentMethod === 'UPI' ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-900/40' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                        >
                            <QrCode className="w-8 h-8" />
                            <span className="font-bold">UPI QR Scan</span>
                        </div>
                        <div
                            onClick={() => setPaymentMethod('COD')}
                            className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col items-center gap-4 ${paymentMethod === 'COD' ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-900/40' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                        >
                            <Truck className="w-8 h-8" />
                            <span className="font-bold">Cash on Delivery</span>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-8 rounded-3xl border border-blue-500/30 space-y-4">
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-slate-400">Subtotal</span>
                            <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-slate-400">Shipping</span>
                            <span className="font-bold">{subtotal > 1000 ? 'Free' : '₹50.00'}</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex justify-between items-center text-2xl font-black text-blue-400">
                            <span>Total</span>
                            <span>₹{(subtotal + (subtotal > 1000 ? 0 : 50) + (subtotal * 0.18)).toFixed(2)}</span>
                        </div>
                    </div>

                    {paymentMethod === 'UPI' && (
                        <div className="bg-white p-6 rounded-3xl mx-auto w-fit text-center space-y-4">
                            <img src={upiQr} alt="UPI QR" className="w-64 h-64 object-contain mx-auto" />
                            <div>
                                <p className="text-slate-900 font-bold text-lg">Scan to Pay</p>
                                <p className="text-blue-600 font-mono font-black">7041963189@upi</p>
                            </div>
                            <div className="pt-4 border-t border-slate-200 w-full">
                                <label className="block text-slate-900 font-bold mb-2">Upload Payment Screenshot</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-blue-50 file:text-blue-700
                                      hover:file:bg-blue-100"
                                    onChange={(e) => setUpiScreenshot(e.target.files[0])}
                                />
                                <p className="text-xs text-slate-400 mt-2">Required for verification</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                        className={`w-full py-6 rounded-3xl font-black text-xl transition-all ${placingOrder ? 'bg-slate-700 cursor-not-allowed text-slate-400' : 'bg-white text-slate-900 hover:scale-[1.02]'}`}
                    >
                        {placingOrder ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order (COD)' : paymentMethod === 'UPI' ? 'I Have Paid & Place Order' : 'Pay & Place Order'}
                    </button>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-12">
                    <div className="bg-green-500/20 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/50">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <h2 className="text-5xl font-black">Order Successful!</h2>
                    <p className="text-xl text-slate-400">Your futuristic gear is on its way. Redirecting to your orders...</p>
                </motion.div>
            )}
        </div>
    );
};

export default CheckoutPage;
