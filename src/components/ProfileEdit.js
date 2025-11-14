import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { workExperienceOptions, targetSectorOptions, skillsOptions } from '../data/mockData';
/**
 * Profile editing component that allows users to update their professional information
 *
 * @param {ProfileEditProps} props - Component props
 * @returns {JSX.Element} Rendered profile edit form
 */
export function ProfileEdit({ user, onSave, onCancel }) {
    // Initialize form data with current user values
    const [formData, setFormData] = useState({
        workExperience: user.workExperience || '',
        targetSector: user.targetSector || '',
        targetPosition: user.targetPosition || '',
        mainSkills: user.mainSkills || [],
        areasToImprove: user.areasToImprove || []
    });
    /**
     * Handles toggling skills in the main skills or areas to improve lists
     *
     * @param {string} skill - The skill to toggle
     * @param {'mainSkills' | 'areasToImprove'} field - Which field to update
     */
    const handleSkillToggle = (skill, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(skill)
                ? prev[field].filter(s => s !== skill)
                : [...prev[field], skill]
        }));
    };
    /**
     * Handles form submission and saves the updated profile data
     *
     * @param {React.FormEvent} e - Form submit event
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-6", children: [_jsx(Button, { variant: "ghost", onClick: onCancel, children: _jsx(ArrowLeft, { className: "h-4 w-4" }) }), _jsx("h1", { className: "text-2xl font-bold", children: "Editar Perfil" })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Configuraci\u00F3n Actual" }) }), _jsxs(CardContent, { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Experiencia laboral" }), _jsx("p", { className: "font-medium", children: user.workExperience || 'No especificada' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Sector objetivo" }), _jsx("p", { className: "font-medium", children: user.targetSector || 'No especificado' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Puesto objetivo" }), _jsx("p", { className: "font-medium", children: user.targetPosition || 'No especificado' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Nivel actual" }), _jsxs("p", { className: "font-medium", children: ["Nivel ", user.level, " - ", user.totalXP, " XP"] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Actualizar Informaci\u00F3n" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "workExperience", children: "Experiencia laboral" }), _jsxs(Select, { value: formData.workExperience, onValueChange: (value) => setFormData(prev => ({ ...prev, workExperience: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Selecciona tu experiencia" }) }), _jsx(SelectContent, { children: workExperienceOptions.map(option => (_jsx(SelectItem, { value: option, children: option }, option))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "targetSector", children: "Sector o industria objetivo" }), _jsxs(Select, { value: formData.targetSector, onValueChange: (value) => setFormData(prev => ({ ...prev, targetSector: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Selecciona el sector" }) }), _jsx(SelectContent, { children: targetSectorOptions.map(option => (_jsx(SelectItem, { value: option, children: option }, option))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "targetPosition", children: "Puesto o rol al que aspiras" }), _jsx(Input, { id: "targetPosition", value: formData.targetPosition, onChange: (e) => setFormData(prev => ({ ...prev, targetPosition: e.target.value })), placeholder: "ej. Gerente de Ventas, Analista Financiero, Coordinator de Marketing..." })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(Label, { children: "Habilidades principales" }), _jsx("div", { className: "grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded", children: skillsOptions.map(skill => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: `main-${skill}`, checked: formData.mainSkills.includes(skill), onCheckedChange: () => handleSkillToggle(skill, 'mainSkills') }), _jsx(Label, { htmlFor: `main-${skill}`, className: "text-sm", children: skill })] }, skill))) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Seleccionadas: ", formData.mainSkills.length] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(Label, { children: "\u00C1reas que deseas fortalecer" }), _jsx("div", { className: "grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded", children: skillsOptions.map(skill => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: `improve-${skill}`, checked: formData.areasToImprove.includes(skill), onCheckedChange: () => handleSkillToggle(skill, 'areasToImprove') }), _jsx(Label, { htmlFor: `improve-${skill}`, className: "text-sm", children: skill })] }, skill))) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Seleccionadas: ", formData.areasToImprove.length] })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx(Button, { type: "submit", className: "flex-1", children: "Guardar cambios" }), _jsx(Button, { type: "button", variant: "outline", onClick: onCancel, className: "flex-1", children: "Cancelar" })] })] }) })] })] }) }));
}
