import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { mockQuestions } from '../data/mockData';
import { Mic, MicOff, SkipForward, Loader2 } from 'lucide-react';
/**
 * Interview simulator component that presents questions and collects answers
 * Simulates a real interview experience with progress tracking and audio recording options
 *
 * @param {InterviewSimulatorProps} props - Component props
 * @returns {JSX.Element} Rendered interview simulator
 */
export function InterviewSimulator({ category, onComplete, onCancel, userProfile }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [aiQuestions, setAiQuestions] = useState([]);
    const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
    const [useFallback, setUseFallback] = useState(false);
    const totalQuestions = 5; // Número de preguntas en la entrevista
    // Generar pregunta con IA
    const generateQuestion = async (questionNumber) => {
        setIsLoadingQuestion(true);
        try {
            const response = await fetch('http://localhost:3001/api/generate-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userProfile,
                    questionNumber,
                    totalQuestions,
                    previousQuestions: aiQuestions,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setAiQuestions(prev => [...prev, data.question]);
                if (data.fallback) {
                    setUseFallback(true);
                }
            }
            else {
                throw new Error('Error al generar pregunta');
            }
        }
        catch (error) {
            console.error('Error generando pregunta:', error);
            // En caso de error, usar pregunta de respaldo
            const fallbackQuestion = mockQuestions[questionNumber - 1]?.text ||
                '¿Puedes contarme sobre tu experiencia profesional?';
            setAiQuestions(prev => [...prev, fallbackQuestion]);
            setUseFallback(true);
        }
        finally {
            setIsLoadingQuestion(false);
        }
    };
    // Cargar la primera pregunta al iniciar
    useEffect(() => {
        generateQuestion(1);
    }, []);
    // Filter questions by category if specified, otherwise use sample questions
    const questions = category
        ? mockQuestions.filter(q => q.category === category)
        : mockQuestions.slice(0, 3); // Use fewer sample questions
    const currentQuestion = aiQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    /**
     * Handles moving to next question or completing the interview
     * Saves current answer and progresses through questions
     */
    const handleNextQuestion = async () => {
        if (currentAnswer.trim()) {
            setAnswers(prev => [...prev, {
                    questionId: `question-${currentQuestionIndex + 1}`,
                    answer: currentAnswer
                }]);
        }
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentAnswer('');
            // Generar la siguiente pregunta si aún no existe
            if (!aiQuestions[currentQuestionIndex + 1]) {
                await generateQuestion(currentQuestionIndex + 2);
            }
        }
        else {
            // Interview complete - generate mock score for demonstration
            const mockScore = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
            onComplete(mockScore, answers);
        }
    };
    /**
     * Handles skipping current question without saving answer
     */
    const handleSkipQuestion = async () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentAnswer('');
            // Generar la siguiente pregunta si aún no existe
            if (!aiQuestions[currentQuestionIndex + 1]) {
                await generateQuestion(currentQuestionIndex + 2);
            }
        }
    };
    /**
     * Toggles audio recording state
     * In a real implementation, this would start/stop actual audio recording
     */
    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // In a real app, you would start/stop audio recording here
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx(Card, { className: "mb-6", children: _jsxs(CardHeader, { children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(CardTitle, { children: "Simulador de Entrevista" }), _jsx(Button, { variant: "outline", onClick: onCancel, children: "Cancelar" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm text-muted-foreground", children: [_jsxs("span", { children: ["Pregunta ", currentQuestionIndex + 1, " de ", totalQuestions] }), _jsxs("span", { children: ["Tiempo: ", Math.floor(timeElapsed / 60), ":", (timeElapsed % 60).toString().padStart(2, '0')] })] }), _jsx(Progress, { value: progress, className: "h-2" })] })] }) }), isLoadingQuestion ? (_jsx(Card, { className: "mb-6", children: _jsx(CardContent, { className: "py-12", children: _jsxs("div", { className: "flex flex-col items-center justify-center space-y-4", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin text-blue-600" }), _jsx("p", { className: "text-lg text-muted-foreground", children: "Generando pregunta personalizada con IA..." })] }) }) })) : currentQuestion ? (_jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsx(CardTitle, { className: "text-xl", children: currentQuestion }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Badge, { variant: "outline", children: useFallback ? 'Pregunta estándar' : 'Generada por IA' }), _jsx(Badge, { variant: "default", children: category || 'general' })] })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx(Textarea, { placeholder: "Escribe tu respuesta aqu\u00ED...", value: currentAnswer, onChange: (e) => setCurrentAnswer(e.target.value), className: "min-h-[120px]" }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: isRecording ? "destructive" : "outline", onClick: toggleRecording, size: "sm", children: [isRecording ? _jsx(MicOff, { className: "h-4 w-4" }) : _jsx(Mic, { className: "h-4 w-4" }), isRecording ? "Detener" : "Grabar"] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentAnswer(''), children: "Limpiar" })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "ghost", onClick: handleSkipQuestion, disabled: currentQuestionIndex === totalQuestions - 1, children: [_jsx(SkipForward, { className: "h-4 w-4 mr-2" }), "Saltar"] }), _jsx(Button, { onClick: handleNextQuestion, disabled: !currentAnswer.trim() || isLoadingQuestion, children: currentQuestionIndex === totalQuestions - 1 ? 'Finalizar' : 'Siguiente' })] })] })] })] })) : (_jsx(Card, { className: "mb-6", children: _jsx(CardContent, { className: "py-12", children: _jsx("div", { className: "flex flex-col items-center justify-center", children: _jsx("p", { className: "text-lg text-muted-foreground", children: "Cargando pregunta..." }) }) }) })), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Progreso de la Entrevista" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-blue-600", children: answers.length }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Respondidas" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-orange-600", children: totalQuestions - answers.length }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Restantes" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("p", { className: "text-2xl font-bold text-green-600", children: [Math.floor(progress), "%"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Completado" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("p", { className: "text-2xl font-bold text-purple-600", children: [timeElapsed, "s"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Tiempo total" })] })] }) })] })] }) }));
}
