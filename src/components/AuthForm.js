import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
/**
 * Authentication form component that handles both login and registration
 * Provides form validation and error handling
 *
 * @param {AuthFormProps} props - Component props
 * @returns {JSX.Element} Rendered authentication form
 */
export function AuthForm({ mode, onSubmit, onToggleMode }) {
    // Form state management
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    /**
     * Handles form submission with validation
     * Validates required fields and formats before calling onSubmit
     *
     * @param {React.FormEvent} e - Form submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        // Validation
        const newErrors = {};
        if (mode === 'register' && !formData.fullName.trim()) {
            newErrors.fullName = 'El nombre completo es requerido';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'El correo es requerido';
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo no es válido';
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        }
        else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (mode === 'register' && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsLoading(true);
        try {
            await onSubmit(formData);
        }
        catch (error) {
            setErrors({ general: 'Error al procesar la solicitud' });
        }
        finally {
            setIsLoading(false);
        }
    };
    /**
     * Handles input field changes and clears associated errors
     *
     * @param {string} field - The form field being updated
     * @param {string} value - The new value for the field
     */
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4", children: _jsxs(Card, { className: "w-full max-w-md", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx(CardTitle, { className: "text-3xl font-bold text-blue-600", children: "Jobsy" }), _jsx("p", { className: "text-muted-foreground", children: mode === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta' })] }), _jsxs(CardContent, { children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [mode === 'register' && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "fullName", children: "Nombre completo" }), _jsx(Input, { id: "fullName", value: formData.fullName, onChange: (e) => handleChange('fullName', e.target.value), placeholder: "Tu nombre completo" }), errors.fullName && _jsx("p", { className: "text-sm text-red-600", children: errors.fullName })] })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Correo electr\u00F3nico" }), _jsx(Input, { id: "email", type: "email", value: formData.email, onChange: (e) => handleChange('email', e.target.value), placeholder: "tu@email.com" }), errors.email && _jsx("p", { className: "text-sm text-red-600", children: errors.email })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Contrase\u00F1a" }), _jsx(Input, { id: "password", type: "password", value: formData.password, onChange: (e) => handleChange('password', e.target.value), placeholder: "Tu contrase\u00F1a" }), errors.password && _jsx("p", { className: "text-sm text-red-600", children: errors.password })] }), mode === 'register' && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: "Confirmar contrase\u00F1a" }), _jsx(Input, { id: "confirmPassword", type: "password", value: formData.confirmPassword, onChange: (e) => handleChange('confirmPassword', e.target.value), placeholder: "Confirma tu contrase\u00F1a" }), errors.confirmPassword && _jsx("p", { className: "text-sm text-red-600", children: errors.confirmPassword })] })), errors.general && _jsx("p", { className: "text-sm text-red-600", children: errors.general }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : 'Registrarse' })] }), _jsx("div", { className: "mt-4 text-center", children: _jsx("button", { type: "button", onClick: onToggleMode, className: "text-sm text-blue-600 hover:underline", children: mode === 'login'
                                    ? '¿No tienes cuenta? Regístrate'
                                    : '¿Ya tienes cuenta? Inicia sesión' }) })] })] }) }));
}
