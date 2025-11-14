import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
export function AuthPage() {
    const [activeTab, setActiveTab] = useState('login');
    return (_jsx("div", { className: "min-h-screen bg-gray-100 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "flex mb-4 bg-white rounded-lg shadow-sm", children: [_jsx("button", { onClick: () => setActiveTab('login'), className: `flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'login'
                                ? 'bg-blue-600 text-white rounded-l-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'}`, children: "Iniciar Sesi\u00F3n" }), _jsx("button", { onClick: () => setActiveTab('register'), className: `flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'register'
                                ? 'bg-green-600 text-white rounded-r-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50'}`, children: "Registrarse" })] }), activeTab === 'login' ? _jsx(LoginForm, {}) : _jsx(RegisterForm, {})] }) }));
}
