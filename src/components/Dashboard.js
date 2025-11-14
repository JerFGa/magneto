import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { mockQuestions, mockInterviews } from '../data/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Home, Target, BarChart3, LogOut, Settings, Heart, Clock, Star } from 'lucide-react';
import { InterviewSimulator } from './InterviewSimulator';
import { ProfileEdit } from './ProfileEdit';
/**
 * Main dashboard component that renders the entire application interface
 * Includes header, navigation, and view switching between home, training, and stats
 *
 * @param {DashboardProps} props - Component props
 * @returns {JSX.Element} Rendered dashboard
 */
export function Dashboard({ user, currentView, onViewChange, onLogout, onUpdateUser }) {
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    if (showProfileEdit) {
        return (_jsx(ProfileEdit, { user: user, onSave: (userData) => {
                onUpdateUser(userData);
                setShowProfileEdit(false);
            }, onCancel: () => setShowProfileEdit(false) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsx("div", { className: "flex items-center", children: _jsx("h1", { className: "text-2xl font-bold text-blue-600", children: "Jobsy" }) }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Avatar, { children: _jsx(AvatarFallback, { children: user.fullName.split(' ').map(n => n[0]).join('') }) }), _jsx("span", { className: "font-medium", children: user.fullName })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onLogout, children: _jsx(LogOut, { className: "h-4 w-4" }) })] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [currentView === 'home' && _jsx(HomeView, { user: user, onEditProfile: () => setShowProfileEdit(true), onUpdateUser: onUpdateUser }), currentView === 'training' && _jsx(TrainingView, { user: user }), currentView === 'stats' && _jsx(StatsView, { user: user })] }), _jsx("nav", { className: "fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg", children: _jsx("div", { className: "max-w-7xl mx-auto px-4", children: _jsxs("div", { className: "flex justify-center space-x-8 py-3", children: [_jsxs(Button, { variant: currentView === 'home' ? 'default' : 'ghost', onClick: () => onViewChange('home'), className: "flex-1 max-w-[120px]", children: [_jsx(Home, { className: "h-4 w-4 mr-2" }), "Inicio"] }), _jsxs(Button, { variant: currentView === 'training' ? 'default' : 'ghost', onClick: () => onViewChange('training'), className: "flex-1 max-w-[120px]", children: [_jsx(Target, { className: "h-4 w-4 mr-2" }), "Modo entrenamiento"] }), _jsxs(Button, { variant: currentView === 'stats' ? 'default' : 'ghost', onClick: () => onViewChange('stats'), className: "flex-1 max-w-[120px]", children: [_jsx(BarChart3, { className: "h-4 w-4 mr-2" }), "Estad\u00EDsticas"] })] }) }) }), _jsx("div", { className: "h-20" })] }));
}
/**
 * Home view component showing user profile, badges, missions, and level progression
 *
 * @param {Object} props - Component props
 * @param {User} props.user - Current user data
 * @param {Function} props.onEditProfile - Function to open profile editing
 * @param {Function} props.onUpdateUser - Function to update user data
 * @returns {JSX.Element} Rendered home view
 */
function HomeView({ user, onEditProfile, onUpdateUser }) {
    const [showLevelInterview, setShowLevelInterview] = useState(false);
    const currentLevel = user.level || 1;
    const levels = [currentLevel, currentLevel + 1, currentLevel + 2, currentLevel + 3, currentLevel + 4];
    /**
     * Handles completion of level interview with XP and level progression
     *
     * @param {number} score - Interview score achieved
     * @param {any[]} answers - User's answers (not used in current implementation)
     */
    const handleLevelInterviewComplete = (score, answers) => {
        const xpGained = score;
        const newTotalXP = user.totalXP + xpGained;
        let newLevel = user.level;
        // Simple level progression: every 500 XP = next level
        if (newTotalXP >= (user.level + 1) * 500) {
            newLevel = user.level + 1;
        }
        onUpdateUser({
            totalXP: newTotalXP,
            level: newLevel
        });
        setShowLevelInterview(false);
    };
    if (showLevelInterview) {
        return (_jsx(InterviewSimulator, { category: "general", onComplete: handleLevelInterviewComplete, onCancel: () => setShowLevelInterview(false), userProfile: user }));
    }
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-1 space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(Avatar, { className: "h-8 w-8", children: _jsx(AvatarFallback, { children: user.fullName.split(' ').map(n => n[0]).join('') }) }), _jsx("span", { children: "Perfil" })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Nivel actual" }), _jsx("p", { className: "text-2xl font-bold", children: currentLevel })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "XP Total" }), _jsx("p", { className: "text-xl font-semibold", children: user.totalXP })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Progreso al siguiente nivel" }), _jsx(Progress, { value: ((user.totalXP % 500) / 500) * 100, className: "h-2" }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [user.totalXP % 500, "/500 XP"] })] }), _jsxs(Button, { variant: "outline", className: "w-full", onClick: onEditProfile, children: [_jsx(Settings, { className: "h-4 w-4 mr-2" }), "Editar perfil"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Insignias" }) }), _jsx(CardContent, { children: _jsx("div", { className: "flex flex-wrap gap-2", children: user.badges.map(badge => (_jsx("div", { className: `w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-semibold ${badge.earned ? badge.color : 'bg-gray-300'}`, title: badge.description, children: badge.name.charAt(0) }, badge.id))) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Misiones semanales" }) }), _jsx(CardContent, { className: "space-y-4", children: user.weeklyMissions.map(mission => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: mission.title }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [mission.progress, "/", mission.maxProgress] })] }), _jsx(Progress, { value: (mission.progress / mission.maxProgress) * 100, className: "h-2" }), _jsx("p", { className: "text-xs text-muted-foreground", children: mission.description })] }, mission.id))) })] })] }), _jsx("div", { className: "lg:col-span-2", children: _jsxs(Card, { className: "h-full", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Camino de Progreso" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Completa entrevistas de nivel para avanzar por el camino" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "relative h-96 bg-gradient-to-t from-green-50 via-blue-50 to-purple-50 rounded-lg p-6 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-20", children: _jsx("svg", { viewBox: "0 0 400 300", className: "w-full h-full", children: _jsx("path", { d: "M0,250 Q100,200 200,180 Q300,160 400,140", stroke: "#3b82f6", strokeWidth: "3", fill: "none", strokeDasharray: "5,5" }) }) }), _jsx("div", { className: "relative h-full", children: levels.map((level, index) => {
                                            const positions = [
                                                { bottom: '10%', left: '10%' }, // Current level
                                                { bottom: '25%', left: '30%' }, // Next level
                                                { bottom: '45%', left: '50%' }, // Level +2
                                                { bottom: '65%', left: '70%' }, // Level +3
                                                { bottom: '85%', left: '85%' }, // Level +4
                                            ];
                                            const isUnlocked = level <= currentLevel;
                                            const isCurrent = level === currentLevel;
                                            const isNext = level === currentLevel + 1;
                                            return (_jsxs("div", { className: "absolute", style: positions[index], children: [index < levels.length - 1 && (_jsx("div", { className: "absolute w-16 h-0.5 border-t-2 border-dotted border-blue-300", style: {
                                                            top: '50%',
                                                            left: '100%',
                                                            transform: 'rotate(-20deg)',
                                                            transformOrigin: '0 50%'
                                                        } })), _jsx("div", { className: `w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer transition-all transform hover:scale-105 ${isCurrent
                                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 ring-4 ring-blue-300 shadow-lg animate-pulse'
                                                            : isNext
                                                                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md'
                                                                : isUnlocked
                                                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md'
                                                                    : 'bg-gray-300 cursor-not-allowed'}`, onClick: () => {
                                                            if (isCurrent) {
                                                                setShowLevelInterview(true);
                                                            }
                                                        }, title: isCurrent ? `Nivel ${level} - ¡Haz clic para entrenar!` : `Nivel ${level}`, children: level }), _jsx("div", { className: "absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center", children: _jsx("p", { className: "text-xs font-medium", children: isCurrent ? 'Actual' : isNext ? 'Siguiente' : `Nivel ${level}` }) })] }, level));
                                        }) }), _jsx("div", { className: "absolute bottom-4 left-4 right-4", children: _jsx(Card, { className: "bg-white/90 backdrop-blur-sm", children: _jsx(CardContent, { className: "p-3", children: _jsxs("p", { className: "text-sm", children: ["\uD83C\uDFAF ", _jsx("span", { className: "font-medium", children: "Haz clic en tu nivel actual" }), " para comenzar una entrevista personalizada"] }) }) }) })] }) })] }) })] }));
}
/**
 * Training view component for practice interviews and skill development
 *
 * @param {Object} props - Component props
 * @param {User} props.user - Current user data
 * @returns {JSX.Element} Rendered training view
 */
function TrainingView({ user }) {
    const [selectedSkill, setSelectedSkill] = useState('');
    const [activeSection, setActiveSection] = useState('main');
    const [showSimulator, setShowSimulator] = useState(false);
    const [simulatorCategory, setSimulatorCategory] = useState();
    const favoriteQuestions = mockQuestions.filter(q => q.isFavorite);
    /**
     * Starts an interview simulation with optional category filter
     *
     * @param {string} [category] - Interview category to focus on
     */
    const startInterview = (category) => {
        setSimulatorCategory(category);
        setShowSimulator(true);
    };
    /**
     * Handles completion of training interview
     * In a real application, this would save results to backend
     *
     * @param {number} score - Interview score achieved
     * @param {any[]} answers - User's answers
     */
    const handleInterviewComplete = (score, answers) => {
        console.log('Interview completed with score:', score);
        setShowSimulator(false);
        setActiveSection('history');
    };
    if (showSimulator) {
        return (_jsx(InterviewSimulator, { category: simulatorCategory, onComplete: handleInterviewComplete, onCancel: () => setShowSimulator(false), userProfile: user }));
    }
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsxs("div", { className: "lg:col-span-1 space-y-4", children: [_jsxs(Card, { className: `cursor-pointer transition-all ${activeSection === 'favorites' ? 'ring-2 ring-blue-500' : ''}`, children: [_jsx(CardHeader, { onClick: () => setActiveSection('favorites'), children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(Heart, { className: "h-4 w-4" }), _jsx("span", { children: "Favoritos" })] }) }), _jsx(CardContent, { children: _jsxs("p", { className: "text-sm text-muted-foreground", children: [favoriteQuestions.length, " preguntas guardadas"] }) })] }), _jsxs(Card, { className: `cursor-pointer transition-all ${activeSection === 'history' ? 'ring-2 ring-blue-500' : ''}`, children: [_jsx(CardHeader, { onClick: () => setActiveSection('history'), children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsx("span", { children: "Historial" })] }) }), _jsx(CardContent, { children: _jsxs("p", { className: "text-sm text-muted-foreground", children: [mockInterviews.length, " entrevistas realizadas"] }) })] })] }), _jsxs("div", { className: "lg:col-span-3", children: [activeSection === 'main' && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Fortalece..." }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Button, { variant: "outline", className: "h-12", onClick: () => startInterview('soft-skills'), children: "\uD83D\uDCAC Habilidades blandas" }), _jsx(Button, { variant: "outline", className: "h-12", onClick: () => startInterview('technical'), children: "\u2699\uFE0F Conocimientos t\u00E9cnicos" }), _jsx(Button, { variant: "outline", className: "h-12", onClick: () => startInterview('general'), children: "\uD83D\uDCDA Conceptos generales" })] }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "text", placeholder: "O alguna habilidad de tu preferencia", value: selectedSkill, onChange: (e) => setSelectedSkill(e.target.value), className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx(Button, { className: "bg-gray-700 hover:bg-gray-800", onClick: () => startInterview(), children: "\u2B50 Generate" })] }) }), _jsxs("div", { className: "border-t pt-6", children: [_jsx("h3", { className: "font-medium mb-4", children: "Entrenamiento personalizado" }), _jsx("div", { className: "grid grid-cols-1 gap-4", children: _jsx(Button, { variant: "outline", onClick: () => startInterview(), children: "\uD83C\uDFAF Enfocar en debilidades" }) }), _jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "\uD83D\uDCA1 Para entrevistas completas, usa el nivel actual desde la p\u00E1gina de inicio" })] })] })] })), activeSection === 'favorites' && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Preguntas Favoritas" }) }), _jsx(CardContent, { children: favoriteQuestions.length === 0 ? (_jsx("p", { className: "text-muted-foreground", children: "No tienes preguntas favoritas a\u00FAn." })) : (_jsx("div", { className: "space-y-4", children: favoriteQuestions.map(question => (_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h4", { className: "font-medium", children: question.text }), _jsx(Badge, { variant: "outline", children: question.category })] }), question.feedback && (_jsx("p", { className: "text-sm text-muted-foreground", children: question.feedback })), question.score && (_jsxs("div", { className: "flex items-center space-x-2 mt-2", children: [_jsx(Star, { className: "h-4 w-4 text-yellow-500" }), _jsxs("span", { className: "text-sm", children: [question.score, "%"] })] }))] }, question.id))) })) })] })), activeSection === 'history' && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Historial de Entrevistas" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: mockInterviews.map(interview => (_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: interview.type }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [interview.date.toLocaleDateString(), " - ", interview.duration, " min"] })] }), _jsxs(Badge, { variant: interview.score >= 80 ? 'default' : 'secondary', children: [interview.score, "%"] })] }), _jsx("p", { className: "text-sm", children: interview.feedback }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [interview.questions.length, " preguntas respondidas"] })] }, interview.id))) }) })] }))] })] }));
}
/**
 * Statistics view component showing user performance analytics
 *
 * @param {Object} props - Component props
 * @param {User} props.user - Current user data
 * @returns {JSX.Element} Rendered statistics view
 */
function StatsView({ user }) {
    // Mock statistics data - in a real app, this would be fetched from backend
    const mockStats = {
        totalInterviews: 0,
        averageScore: 0,
        improvementAreas: [
            { area: 'Área de ejemplo 1', score: 0 },
            { area: 'Área de ejemplo 2', score: 0 },
            { area: 'Área de ejemplo 3', score: 0 }
        ],
        progressOverTime: [
            { date: 'Mes 1', score: 0 },
            { date: 'Mes 2', score: 0 },
            { date: 'Mes 3', score: 0 },
            { date: 'Mes 4', score: 0 }
        ]
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Entrevistas totales" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-3xl font-bold text-blue-600", children: mockStats.totalInterviews }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Puntuaci\u00F3n promedio" }) }), _jsx(CardContent, { children: _jsxs("p", { className: "text-3xl font-bold text-green-600", children: [mockStats.averageScore, "%"] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Nivel actual" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-3xl font-bold text-purple-600", children: user.level }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\u00C1reas de mejora" }) }), _jsx(CardContent, { className: "space-y-4", children: mockStats.improvementAreas.map(area => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: area.area }), _jsxs("span", { children: [area.score, "%"] })] }), _jsx(Progress, { value: area.score, className: "h-2" })] }, area.area))) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Progreso a lo largo del tiempo" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-2", children: mockStats.progressOverTime.map(point => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: point.date }), _jsxs("span", { className: "font-medium", children: [point.score, "%"] })] }, point.date))) }) })] })] }));
}
