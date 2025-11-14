import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { workExperienceOptions, targetSectorOptions, skillsOptions } from '../data/mockData';
/**
 * User profile setup component for new users
 * Collects work experience, target sector, skills, and improvement areas
 *
 * @param {UserSetupProps} props - Component props
 * @returns {JSX.Element} Rendered user setup form
 */
export function UserSetup({ user, onComplete }) {
    // Form state initialization with user data or empty defaults
    const [formData, setFormData] = useState({
        workExperience: user.workExperience || '',
        targetSector: user.targetSector || '',
        targetPosition: user.targetPosition || '',
        mainSkills: user.mainSkills || [],
        areasToImprove: user.areasToImprove || []
    });
    /**
     * Handles toggling skills in main skills or areas to improve
     *
     * @param {string} skill - The skill being toggled
     * @param {'mainSkills' | 'areasToImprove'} field - Which array to update
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
     * Handles form submission
     *
     * @param {React.FormEvent} e - Form submit event
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete(formData);
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4", children: _jsxs(Card, { className: "w-full max-w-2xl", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx(CardTitle, { className: "text-2xl", children: "Configura tu perfil" }), _jsx("p", { className: "text-muted-foreground", children: "Cu\u00E9ntanos sobre ti para personalizar tu experiencia de entrenamiento" })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "workExperience", children: "Experiencia laboral" }), _jsxs(Select, { value: formData.workExperience, onValueChange: (value) => setFormData(prev => ({ ...prev, workExperience: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Selecciona tu experiencia" }) }), _jsx(SelectContent, { children: workExperienceOptions.map(option => (_jsx(SelectItem, { value: option, children: option }, option))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "targetSector", children: "Sector o industria objetivo" }), _jsxs(Select, { value: formData.targetSector, onValueChange: (value) => setFormData(prev => ({ ...prev, targetSector: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Selecciona el sector" }) }), _jsx(SelectContent, { children: targetSectorOptions.map(option => (_jsx(SelectItem, { value: option, children: option }, option))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "targetPosition", children: "Puesto o rol al que aspiras" }), _jsx(Input, { id: "targetPosition", value: formData.targetPosition, onChange: (e) => setFormData(prev => ({ ...prev, targetPosition: e.target.value })), placeholder: "ej. Gerente de Ventas, Analista Financiero, Coordinator de Marketing..." })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(Label, { children: "\u00C1reas de conocimiento o habilidades principales" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: skillsOptions.map(skill => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: `main-${skill}`, checked: formData.mainSkills.includes(skill), onCheckedChange: () => handleSkillToggle(skill, 'mainSkills') }), _jsx(Label, { htmlFor: `main-${skill}`, className: "text-sm", children: skill })] }, skill))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(Label, { children: "Principales \u00E1reas que deseas fortalecer" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: skillsOptions.map(skill => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: `improve-${skill}`, checked: formData.areasToImprove.includes(skill), onCheckedChange: () => handleSkillToggle(skill, 'areasToImprove') }), _jsx(Label, { htmlFor: `improve-${skill}`, className: "text-sm", children: skill })] }, skill))) })] }), _jsx(Button, { type: "submit", className: "w-full", children: "Completar configuraci\u00F3n" })] }) })] }) }));
}
