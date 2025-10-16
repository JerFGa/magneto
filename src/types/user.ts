/**
 * Main user interface representing a registered user in the system
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's full name */
  fullName: string;
  /** User's email address */
  email: string;
  /** User's work experience level (optional) */
  workExperience?: string;
  /** Target industry or sector (optional) */
  targetSector?: string;
  /** Desired job position (optional) */
  targetPosition?: string;
  /** List of user's main professional skills (optional) */
  mainSkills?: string[];
  /** List of areas the user wants to improve (optional) */
  areasToImprove?: string[];
  /** Current gamification level */
  level: number;
  /** Total experience points earned */
  totalXP: number;
  /** Array of earned and available badges */
  badges: Badge[];
  /** Array of current weekly missions/challenges */
  weeklyMissions: Mission[];
  /** Target role (optional) */
  targetRole?: string;
  /** Configuration status (optional) */
  configCompleted?: boolean;
}

/**
 * Badge interface representing gamification achievements
 */
export interface Badge {
  /** Unique identifier for the badge */
  id: string;
  /** Display name of the badge */
  name: string;
  /** Description of what the badge represents */
  description: string;
  /** CSS color class for the badge display */
  color: string;
  /** Whether the user has earned this badge */
  earned: boolean;
  /** Date when the badge was earned (if applicable) */
  earnedAt?: Date;
}

/**
 * Mission interface representing weekly challenges
 */
export interface Mission {
  /** Unique identifier for the mission */
  id: string;
  /** Mission title/name */
  title: string;
  /** Detailed description of the mission */
  description: string;
  /** Current progress towards completion */
  progress: number;
  /** Maximum progress needed to complete */
  maxProgress: number;
  /** Whether the mission is completed */
  completed: boolean;
  /** XP reward for completing the mission */
  xpReward: number;
}

/**
 * Interview interface representing a completed interview session
 */
export interface Interview {
  /** Unique identifier for the interview */
  id: string;
  /** Date when the interview was conducted */
  date: Date;
  /** Type/category of the interview */
  type: string;
  /** Array of questions asked in the interview */
  questions: Question[];
  /** Overall score achieved in the interview */
  score: number;
  /** Feedback provided for the interview */
  feedback: string;
  /** Duration of the interview in minutes */
  duration: number;
}

/**
 * Question interface representing an interview question
 */
export interface Question {
  /** Unique identifier for the question */
  id: string;
  /** The actual question text */
  text: string;
  /** Category of the question */
  category: 'soft-skills' | 'technical' | 'general';
  /** Difficulty level of the question */
  difficulty: 'easy' | 'medium' | 'hard';
  /** User's answer to the question (optional) */
  userAnswer?: string;
  /** Feedback on the user's answer (optional) */
  feedback?: string;
  /** Score received for this question (optional) */
  score?: number;
  /** Whether this question is marked as favorite */
  isFavorite: boolean;
}

/**
 * Statistics interface representing user performance analytics
 */
export interface Statistics {
  /** Total number of interviews completed */
  totalInterviews: number;
  /** Average score across all interviews */
  averageScore: number;
  /** Areas that need improvement with scores */
  improvementAreas: { area: string; score: number }[];
  /** Progress tracking over time */
  progressOverTime: { date: string; score: number }[];
  /** Breakdown of skills with current levels */
  skillBreakdown: { skill: string; level: number }[];
}