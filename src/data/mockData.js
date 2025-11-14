/**
 * Sample interview questions for demonstration purposes
 * In a real application, these would be fetched from a backend API
 * Questions cover different categories and difficulty levels
 */
export const mockQuestions = [
    {
        id: '1',
        text: 'Pregunta de ejemplo 1',
        category: 'general',
        difficulty: 'easy',
        isFavorite: false,
        feedback: 'Feedback de ejemplo',
        score: 0
    },
    {
        id: '2',
        text: 'Pregunta de ejemplo 2',
        category: 'soft-skills',
        difficulty: 'medium',
        isFavorite: false,
        feedback: 'Feedback de ejemplo',
        score: 0
    },
    {
        id: '3',
        text: 'Pregunta de ejemplo 3',
        category: 'technical',
        difficulty: 'medium',
        isFavorite: false,
        feedback: 'Feedback de ejemplo',
        score: 0
    },
    {
        id: '4',
        text: 'Pregunta de ejemplo 4',
        category: 'soft-skills',
        difficulty: 'hard',
        isFavorite: false,
        feedback: 'Feedback de ejemplo',
        score: 0
    },
    {
        id: '5',
        text: 'Pregunta de ejemplo 5',
        category: 'technical',
        difficulty: 'hard',
        isFavorite: false,
        feedback: 'Feedback de ejemplo',
        score: 0
    }
];
/**
 * Sample interview records for demonstration purposes
 * In a real application, these would be stored in a database
 * Shows user's interview history and progress
 */
export const mockInterviews = [
    {
        id: '1',
        date: new Date(),
        type: 'Entrevista de ejemplo',
        questions: mockQuestions.slice(0, 3),
        score: 0,
        feedback: 'Feedback de ejemplo',
        duration: 0
    }
];
/**
 * Available work experience options for user profile
 */
export const workExperienceOptions = [
    'Sin experiencia',
    'Menos de 1 año',
    '1-2 años',
    '2-5 años',
    '5-10 años',
    'Más de 10 años'
];
/**
 * Available industry sectors for targeting
 */
export const targetSectorOptions = [
    'Tecnología',
    'Finanzas',
    'Salud',
    'Educación',
    'Marketing y Publicidad',
    'Recursos Humanos',
    'Ventas',
    'Consultoría',
    'Manufactura',
    'Retail',
    'Gobierno',
    'Sin fines de lucro',
    'Otro'
];
/**
 * Common professional skills across industries
 */
export const skillsOptions = [
    // Habilidades blandas
    'Comunicación efectiva',
    'Liderazgo de equipos',
    'Trabajo en equipo',
    'Resolución de problemas',
    'Gestión del tiempo',
    'Adaptabilidad',
    'Pensamiento crítico',
    'Creatividad',
    'Negociación',
    'Presentaciones públicas',
    // Habilidades técnicas generales
    'Gestión de proyectos',
    'Análisis de datos',
    'Microsoft Office',
    'Google Workspace',
    'CRM',
    'Redes sociales',
    'Marketing digital',
    'Contabilidad básica',
    'Planificación estratégica',
    'Atención al cliente'
];
