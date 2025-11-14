import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Settings, FileQuestion, Award, Target, BarChart3, Users, LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
const DEFAULT_SETTINGS = {
    maxInterviewDuration: 60,
    questionsPerInterview: 5,
    xpPerPoint: 10,
    xpForLevelUp: 500,
};
const DEFAULT_QUESTIONS = [
    {
        id: 'q-1',
        text: 'Cuéntame sobre un reto reciente en tu trabajo y cómo lo resolviste.',
        category: 'general',
        difficulty: 'medium',
        sector: 'Tecnología',
    },
    {
        id: 'q-2',
        text: '¿Cómo manejas los desacuerdos dentro de tu equipo?',
        category: 'soft-skills',
        difficulty: 'medium',
        sector: 'Servicios',
    },
    {
        id: 'q-3',
        text: 'Explica un sistema que hayas diseñado y qué decisiones tomaste.',
        category: 'technical',
        difficulty: 'hard',
        sector: 'Fintech',
    },
];
const DEFAULT_BADGES = [
    {
        id: 'badge-1',
        name: 'Onboarding Pro',
        description: 'Completó la configuración inicial en tiempo récord.',
        color: 'blue',
        requirement: 'Completar onboarding',
    },
    {
        id: 'badge-2',
        name: 'Mentor',
        description: 'Ayudó a 5 candidatos a mejorar su perfil.',
        color: 'green',
        requirement: 'Apoyar a 5 usuarios',
    },
];
const DEFAULT_MISSIONS = [
    {
        id: 'mission-1',
        title: 'Entrevista express',
        description: 'Completa una entrevista de práctica en menos de 15 minutos.',
        maxProgress: 1,
        xpReward: 120,
    },
    {
        id: 'mission-2',
        title: 'Feedback premium',
        description: 'Entrega retroalimentación estructurada a dos candidatos.',
        maxProgress: 2,
        xpReward: 200,
    },
];
const DEFAULT_STATISTICS = {
    totalUsers: 128,
    totalInterviews: 412,
    completedInterviews: 367,
    avgScore: 82,
    avgDuration: 18,
    usersByLevel: {
        1: 34,
        2: 41,
        3: 28,
        4: 17,
        5: 8,
    },
};
const DEFAULT_USER_PERFORMANCE = [
    {
        userId: 'u-1',
        fullName: 'Lucía Gómez',
        email: 'lucia@example.com',
        level: 4,
        totalXP: 2150,
        interviewsCompleted: 18,
        avgScore: 86,
        avgDuration: 16,
        lastActivity: new Date().toISOString(),
    },
    {
        userId: 'u-2',
        fullName: 'Carlos Pérez',
        email: 'carlos@example.com',
        level: 3,
        totalXP: 1480,
        interviewsCompleted: 11,
        avgScore: 79,
        avgDuration: 19,
        lastActivity: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        userId: 'u-3',
        fullName: 'María Rodríguez',
        email: 'maria@example.com',
        level: 2,
        totalXP: 830,
        interviewsCompleted: 7,
        avgScore: 74,
        avgDuration: 20,
        lastActivity: null,
    },
];
const generateId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));
export function AdminPanel({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('settings');
    const [loading, setLoading] = useState(false);
    // Settings state
    const [settings, setSettings] = useState(() => ({
        ...DEFAULT_SETTINGS,
    }));
    // Questions state
    const [questions, setQuestions] = useState(() => [...DEFAULT_QUESTIONS]);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        category: 'general',
        difficulty: 'medium',
        sector: ''
    });
    // Badges state
    const [badges, setBadges] = useState(() => [...DEFAULT_BADGES]);
    const [editingBadge, setEditingBadge] = useState(null);
    const [newBadge, setNewBadge] = useState({
        name: '',
        description: '',
        color: 'blue',
        requirement: ''
    });
    // Missions state
    const [missions, setMissions] = useState(() => [...DEFAULT_MISSIONS]);
    const [editingMission, setEditingMission] = useState(null);
    const [newMission, setNewMission] = useState({
        title: '',
        description: '',
        maxProgress: 1,
        xpReward: 100
    });
    // Statistics state
    const [statistics] = useState(DEFAULT_STATISTICS);
    const [userPerformance] = useState(DEFAULT_USER_PERFORMANCE);
    const sleep = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
    const updateSettings = async () => {
        setLoading(true);
        await sleep();
        toast.success('Configuración actualizada');
        setLoading(false);
    };
    const createQuestion = async () => {
        if (!newQuestion.text?.trim()) {
            toast.error('El texto de la pregunta es requerido');
            return;
        }
        setLoading(true);
        await sleep();
        const question = {
            id: generateId(),
            text: newQuestion.text.trim(),
            category: newQuestion.category || 'general',
            difficulty: newQuestion.difficulty || 'medium',
            sector: newQuestion.sector || '',
        };
        setQuestions((prev) => [...prev, question]);
        setNewQuestion({ text: '', category: 'general', difficulty: 'medium', sector: '' });
        toast.success('Pregunta creada');
        setLoading(false);
    };
    const updateQuestion = async (id, updates) => {
        setLoading(true);
        await sleep();
        setQuestions((prev) => prev.map((question) => (question.id === id ? { ...question, ...updates } : question)));
        setEditingQuestion(null);
        toast.success('Pregunta actualizada');
        setLoading(false);
    };
    const deleteQuestion = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta pregunta?'))
            return;
        setLoading(true);
        await sleep();
        setQuestions((prev) => prev.filter((question) => question.id !== id));
        toast.success('Pregunta eliminada');
        setLoading(false);
    };
    const createBadge = async () => {
        if (!newBadge.name?.trim() || !newBadge.description?.trim()) {
            toast.error('Nombre y descripción son requeridos');
            return;
        }
        setLoading(true);
        await sleep();
        const badge = {
            id: generateId(),
            name: newBadge.name.trim(),
            description: newBadge.description.trim(),
            color: newBadge.color || 'blue',
            requirement: newBadge.requirement || 'Sin requisito definido',
        };
        setBadges((prev) => [...prev, badge]);
        setNewBadge({ name: '', description: '', color: 'blue', requirement: '' });
        toast.success('Insignia creada');
        setLoading(false);
    };
    const updateBadge = async (id, updates) => {
        setLoading(true);
        await sleep();
        setBadges((prev) => prev.map((badge) => (badge.id === id ? { ...badge, ...updates } : badge)));
        setEditingBadge(null);
        toast.success('Insignia actualizada');
        setLoading(false);
    };
    const deleteBadge = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta insignia?'))
            return;
        setLoading(true);
        await sleep();
        setBadges((prev) => prev.filter((badge) => badge.id !== id));
        toast.success('Insignia eliminada');
        setLoading(false);
    };
    const createMission = async () => {
        if (!newMission.title?.trim() || !newMission.description?.trim()) {
            toast.error('Título y descripción son requeridos');
            return;
        }
        setLoading(true);
        await sleep();
        const mission = {
            id: generateId(),
            title: newMission.title.trim(),
            description: newMission.description.trim(),
            maxProgress: newMission.maxProgress || 1,
            xpReward: newMission.xpReward || 100,
        };
        setMissions((prev) => [...prev, mission]);
        setNewMission({ title: '', description: '', maxProgress: 1, xpReward: 100 });
        toast.success('Misión creada');
        setLoading(false);
    };
    const updateMission = async (id, updates) => {
        setLoading(true);
        await sleep();
        setMissions((prev) => prev.map((mission) => (mission.id === id ? { ...mission, ...updates } : mission)));
        setEditingMission(null);
        toast.success('Misión actualizada');
        setLoading(false);
    };
    const deleteMission = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta misión?'))
            return;
        setLoading(true);
        await sleep();
        setMissions((prev) => prev.filter((mission) => mission.id !== id));
        toast.success('Misión eliminada');
        setLoading(false);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("h1", { className: "text-2xl font-bold text-blue-600", children: "Jobsy Admin" }), _jsx(Badge, { variant: "secondary", children: "Administrador" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("span", { className: "text-sm text-gray-600", children: user.fullName }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onLogout, children: _jsx(LogOut, { className: "h-4 w-4" }) })] })] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [_jsxs(TabsList, { className: "grid w-full grid-cols-6 mb-8", children: [_jsxs(TabsTrigger, { value: "settings", className: "flex items-center gap-2", children: [_jsx(Settings, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Configuraci\u00F3n" })] }), _jsxs(TabsTrigger, { value: "questions", className: "flex items-center gap-2", children: [_jsx(FileQuestion, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Preguntas" })] }), _jsxs(TabsTrigger, { value: "badges", className: "flex items-center gap-2", children: [_jsx(Award, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Insignias" })] }), _jsxs(TabsTrigger, { value: "missions", className: "flex items-center gap-2", children: [_jsx(Target, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Misiones" })] }), _jsxs(TabsTrigger, { value: "statistics", className: "flex items-center gap-2", children: [_jsx(BarChart3, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Estad\u00EDsticas" })] }), _jsxs(TabsTrigger, { value: "performance", className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Usuarios" })] })] }), _jsx(TabsContent, { value: "settings", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Configuraci\u00F3n de la Plataforma" }), _jsx(CardDescription, { children: "Ajusta los par\u00E1metros generales del sistema" })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Duraci\u00F3n m\u00E1xima de entrevista (minutos)" }), _jsx(Input, { type: "number", value: settings.maxInterviewDuration, onChange: (e) => setSettings({ ...settings, maxInterviewDuration: parseInt(e.target.value) }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Preguntas por entrevista" }), _jsx(Input, { type: "number", value: settings.questionsPerInterview, onChange: (e) => setSettings({ ...settings, questionsPerInterview: parseInt(e.target.value) }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "XP por punto de calificaci\u00F3n" }), _jsx(Input, { type: "number", value: settings.xpPerPoint, onChange: (e) => setSettings({ ...settings, xpPerPoint: parseInt(e.target.value) }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "XP necesaria para subir de nivel" }), _jsx(Input, { type: "number", value: settings.xpForLevelUp, onChange: (e) => setSettings({ ...settings, xpForLevelUp: parseInt(e.target.value) }) })] })] }), _jsx(Button, { onClick: updateSettings, disabled: loading, children: loading ? 'Guardando...' : 'Guardar Cambios' })] })] }) }), _jsx(TabsContent, { value: "questions", children: _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Crear Nueva Pregunta" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Texto de la pregunta" }), _jsx(Textarea, { value: newQuestion.text, onChange: (e) => setNewQuestion({ ...newQuestion, text: e.target.value }), placeholder: "Escribe la pregunta aqu\u00ED...", rows: 3 })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Categor\u00EDa" }), _jsxs(Select, { value: newQuestion.category, onValueChange: (value) => setNewQuestion({ ...newQuestion, category: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "general", children: "General" }), _jsx(SelectItem, { value: "soft-skills", children: "Soft Skills" }), _jsx(SelectItem, { value: "technical", children: "T\u00E9cnica" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Dificultad" }), _jsxs(Select, { value: newQuestion.difficulty, onValueChange: (value) => setNewQuestion({ ...newQuestion, difficulty: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "easy", children: "F\u00E1cil" }), _jsx(SelectItem, { value: "medium", children: "Medio" }), _jsx(SelectItem, { value: "hard", children: "Dif\u00EDcil" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Sector (opcional)" }), _jsx(Input, { value: newQuestion.sector, onChange: (e) => setNewQuestion({ ...newQuestion, sector: e.target.value }), placeholder: "Ej: Tecnolog\u00EDa" })] })] }), _jsxs(Button, { onClick: createQuestion, disabled: loading, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Crear Pregunta"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Preguntas Existentes (", questions.length, ")"] }) }), _jsx(CardContent, { children: _jsx(ScrollArea, { className: "h-[500px]", children: _jsx("div", { className: "space-y-4", children: questions.map((question) => (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1 space-y-2", children: [_jsx("p", { className: "font-medium", children: question.text }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Badge, { variant: "outline", children: question.category }), _jsx(Badge, { variant: "outline", children: question.difficulty }), question.sector && _jsx(Badge, { variant: "secondary", children: question.sector })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setEditingQuestion(question), children: _jsx(Edit, { className: "h-4 w-4" }) }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Editar Pregunta" }) }), editingQuestion && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Texto" }), _jsx(Textarea, { value: editingQuestion.text, onChange: (e) => setEditingQuestion({ ...editingQuestion, text: e.target.value }), rows: 3 })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Categor\u00EDa" }), _jsxs(Select, { value: editingQuestion.category, onValueChange: (value) => setEditingQuestion({ ...editingQuestion, category: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "general", children: "General" }), _jsx(SelectItem, { value: "soft-skills", children: "Soft Skills" }), _jsx(SelectItem, { value: "technical", children: "T\u00E9cnica" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Dificultad" }), _jsxs(Select, { value: editingQuestion.difficulty, onValueChange: (value) => setEditingQuestion({ ...editingQuestion, difficulty: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "easy", children: "F\u00E1cil" }), _jsx(SelectItem, { value: "medium", children: "Medio" }), _jsx(SelectItem, { value: "hard", children: "Dif\u00EDcil" })] })] })] })] }), _jsx(Button, { onClick: () => updateQuestion(editingQuestion.id, editingQuestion), disabled: loading, children: "Guardar Cambios" })] }))] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => deleteQuestion(question.id), disabled: loading, children: _jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })] })] }) }) }, question.id))) }) }) })] })] }) }), _jsx(TabsContent, { value: "badges", children: _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Crear Nueva Insignia" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Nombre" }), _jsx(Input, { value: newBadge.name, onChange: (e) => setNewBadge({ ...newBadge, name: e.target.value }), placeholder: "Nombre de la insignia" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Color" }), _jsxs(Select, { value: newBadge.color, onValueChange: (value) => setNewBadge({ ...newBadge, color: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "blue", children: "Azul" }), _jsx(SelectItem, { value: "green", children: "Verde" }), _jsx(SelectItem, { value: "yellow", children: "Amarillo" }), _jsx(SelectItem, { value: "red", children: "Rojo" }), _jsx(SelectItem, { value: "purple", children: "P\u00FArpura" })] })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Descripci\u00F3n" }), _jsx(Textarea, { value: newBadge.description, onChange: (e) => setNewBadge({ ...newBadge, description: e.target.value }), placeholder: "Descripci\u00F3n de la insignia", rows: 2 })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Requisito" }), _jsx(Input, { value: newBadge.requirement, onChange: (e) => setNewBadge({ ...newBadge, requirement: e.target.value }), placeholder: "Ej: Completar 10 entrevistas" })] }), _jsxs(Button, { onClick: createBadge, disabled: loading, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Crear Insignia"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Insignias Existentes (", badges.length, ")"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: badges.map((badge) => (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx(Badge, { className: `bg-${badge.color}-500`, children: badge.name }), _jsxs("div", { className: "flex gap-1", children: [_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setEditingBadge(badge), children: _jsx(Edit, { className: "h-3 w-3" }) }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Editar Insignia" }) }), editingBadge && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Nombre" }), _jsx(Input, { value: editingBadge.name, onChange: (e) => setEditingBadge({ ...editingBadge, name: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Descripci\u00F3n" }), _jsx(Textarea, { value: editingBadge.description, onChange: (e) => setEditingBadge({ ...editingBadge, description: e.target.value }), rows: 2 })] }), _jsx(Button, { onClick: () => updateBadge(editingBadge.id, editingBadge), disabled: loading, children: "Guardar Cambios" })] }))] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => deleteBadge(badge.id), disabled: loading, children: _jsx(Trash2, { className: "h-3 w-3 text-destructive" }) })] })] }), _jsx("p", { className: "text-sm text-gray-600", children: badge.description }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Requisito: ", badge.requirement] })] }) }) }, badge.id))) }) })] })] }) }), _jsx(TabsContent, { value: "missions", children: _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Crear Nueva Misi\u00F3n" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "T\u00EDtulo" }), _jsx(Input, { value: newMission.title, onChange: (e) => setNewMission({ ...newMission, title: e.target.value }), placeholder: "T\u00EDtulo de la misi\u00F3n" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Descripci\u00F3n" }), _jsx(Textarea, { value: newMission.description, onChange: (e) => setNewMission({ ...newMission, description: e.target.value }), placeholder: "Descripci\u00F3n de la misi\u00F3n", rows: 2 })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Progreso m\u00E1ximo" }), _jsx(Input, { type: "number", value: newMission.maxProgress, onChange: (e) => setNewMission({ ...newMission, maxProgress: parseInt(e.target.value) }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Recompensa XP" }), _jsx(Input, { type: "number", value: newMission.xpReward, onChange: (e) => setNewMission({ ...newMission, xpReward: parseInt(e.target.value) }) })] })] }), _jsxs(Button, { onClick: createMission, disabled: loading, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Crear Misi\u00F3n"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Misiones Existentes (", missions.length, ")"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: missions.map((mission) => (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1 space-y-2", children: [_jsx("h4", { className: "font-medium", children: mission.title }), _jsx("p", { className: "text-sm text-gray-600", children: mission.description }), _jsxs("div", { className: "flex gap-4 text-sm text-gray-500", children: [_jsxs("span", { children: ["Progreso: ", mission.maxProgress] }), _jsxs("span", { children: ["Recompensa: ", mission.xpReward, " XP"] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setEditingMission(mission), children: _jsx(Edit, { className: "h-4 w-4" }) }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Editar Misi\u00F3n" }) }), editingMission && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "T\u00EDtulo" }), _jsx(Input, { value: editingMission.title, onChange: (e) => setEditingMission({ ...editingMission, title: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Descripci\u00F3n" }), _jsx(Textarea, { value: editingMission.description, onChange: (e) => setEditingMission({ ...editingMission, description: e.target.value }), rows: 2 })] }), _jsx(Button, { onClick: () => updateMission(editingMission.id, editingMission), disabled: loading, children: "Guardar Cambios" })] }))] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => deleteMission(mission.id), disabled: loading, children: _jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })] })] }) }) }, mission.id))) }) })] })] }) }), _jsx(TabsContent, { value: "statistics", children: statistics && (_jsxs("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Usuarios Totales" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-4xl font-bold", children: statistics.totalUsers }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Entrevistas Totales" }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-4xl font-bold", children: statistics.totalInterviews }), _jsxs("p", { className: "text-sm text-gray-500 mt-2", children: [statistics.completedInterviews, " completadas"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Puntuaci\u00F3n Promedio" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-4xl font-bold", children: statistics.avgScore }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Duraci\u00F3n Promedio" }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-4xl font-bold", children: statistics.avgDuration }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: "minutos" })] })] }), _jsxs(Card, { className: "md:col-span-2", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Distribuci\u00F3n por Nivel" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-2", children: Object.entries(statistics.usersByLevel).map(([level, count]) => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { children: ["Nivel ", level] }), _jsxs(Badge, { children: [count, " usuarios"] })] }, level))) }) })] })] })) }), _jsx(TabsContent, { value: "performance", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Desempe\u00F1o de Usuarios" }), _jsx(CardDescription, { children: "M\u00E9tricas detalladas de rendimiento de cada candidato" })] }), _jsx(CardContent, { children: _jsx(ScrollArea, { className: "h-[600px]", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Usuario" }), _jsx(TableHead, { children: "Email" }), _jsx(TableHead, { children: "Nivel" }), _jsx(TableHead, { children: "XP Total" }), _jsx(TableHead, { children: "Entrevistas" }), _jsx(TableHead, { children: "Puntuaci\u00F3n Prom." }), _jsx(TableHead, { children: "Duraci\u00F3n Prom." }), _jsx(TableHead, { children: "\u00DAltima Actividad" })] }) }), _jsx(TableBody, { children: userPerformance.map((user) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: user.fullName }), _jsx(TableCell, { children: user.email }), _jsx(TableCell, { children: _jsx(Badge, { variant: "outline", children: user.level }) }), _jsx(TableCell, { children: user.totalXP }), _jsx(TableCell, { children: user.interviewsCompleted }), _jsx(TableCell, { children: user.avgScore }), _jsxs(TableCell, { children: [user.avgDuration, " min"] }), _jsx(TableCell, { children: user.lastActivity
                                                                        ? new Date(user.lastActivity).toLocaleDateString()
                                                                        : 'N/A' })] }, user.userId))) })] }) }) })] }) })] }) })] }));
}
