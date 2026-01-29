import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/users/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            return false;
        }
    };

    const register = async (name, email, password, emailOTP) => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/users', { name, email, password, emailOTP });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            return false;
        }
    };

    const googleLogin = async (credential) => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/users/google', { credential });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
