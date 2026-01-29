import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import { SupportPage, TermsPage, PrivacyPage, ShippingPage } from './pages/InfoPages';
import { CategoriesPage, OffersPage } from './pages/OfferPages';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user && user.isAdmin ? children : <Navigate to="/login" />;
};

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Toaster position="top-center" reverseOrder={false} />
                    <ScrollToTop />
                    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
                        <Navbar />
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/shop" element={<ShopPage />} />
                                <Route path="/product/:id" element={<ProductPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/profile" element={
                                    <PrivateRoute>
                                        <ProfilePage />
                                    </PrivateRoute>
                                } />
                                <Route path="/orders" element={
                                    <PrivateRoute>
                                        <OrdersPage />
                                    </PrivateRoute>
                                } />
                                <Route path="/wishlist" element={
                                    <PrivateRoute>
                                        <WishlistPage />
                                    </PrivateRoute>
                                } />
                                <Route path="/admin" element={
                                    <AdminRoute>
                                        <AdminDashboard />
                                    </AdminRoute>
                                } />
                                <Route path="/support" element={<SupportPage />} />
                                <Route path="/terms" element={<TermsPage />} />
                                <Route path="/privacy" element={<PrivacyPage />} />
                                <Route path="/shipping" element={<ShippingPage />} />
                                <Route path="/categories" element={<CategoriesPage />} />
                                <Route path="/offers" element={<OffersPage />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
