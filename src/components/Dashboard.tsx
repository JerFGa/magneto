import { useState } from 'react';
import { User } from '../types/user';
import { mockQuestions, mockInterviews } from '../data/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Home, Target, BarChart3, LogOut, Settings, Heart, Clock, Star } from 'lucide-react';
import { InterviewSimulator } from './InterviewSimulator';
import { ProfileEdit } from './ProfileEdit';

/**
 * Props for the Dashboard component
 */
interface DashboardProps {
  /** Current authenticated user */
  user: User;
  /** Current active view in the dashboard */
  currentView: string;
  /** Function to change the current view */
  onViewChange: (view: string) => void;
  /** Function to logout the user */
  onLogout: () => void;
  /** Function to update user data */
  onUpdateUser: (updates: Partial<User>) => void;
}

/**
 * Main dashboard component that renders the entire application interface
 * Includes header, navigation, and view switching between home, training, and stats
 * 
 * @param {DashboardProps} props - Component props
 * @returns {JSX.Element} Rendered dashboard
 */
export function Dashboard({ user, currentView, onViewChange, onLogout, onUpdateUser }: DashboardProps) {
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  /**
   * Updates user XP by calling backend endpoint
   * @param xpGained - Amount of XP to add
   */
  const addUserXP = async (xpGained: number) => {
    console.log('🎯 addUserXP llamado con:', xpGained, 'XP');
    console.log('📧 Email del usuario:', user.email);
    
    try {
      console.log('📤 Enviando petición al backend...');
      const response = await fetch('http://localhost:3001/api/user/add-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          xpGained: xpGained
        })
      });

      console.log('📥 Respuesta recibida, status:', response.status);
      const data = await response.json();
      console.log('📊 Datos:', data);
      
      if (data.success) {
        console.log(`✅ XP actualizado: +${xpGained} XP (Total: ${data.newTotalXP}, Nivel: ${data.newLevel})`);
        
        // Update local user state
        onUpdateUser({
          totalXP: data.newTotalXP,
          xp: data.user.xp,
          level: data.newLevel
        });
        
        return true;
      } else {
        console.error('❌ Error al actualizar XP:', data.message);
        return false;
      }
    } catch (error) {
      console.error('💥 Error al conectar con el servidor:', error);
      return false;
    }
  };

  if (showProfileEdit) {
    return (
      <ProfileEdit
        user={user}
        onSave={(userData) => {
          onUpdateUser(userData);
          setShowProfileEdit(false);
        }}
        onCancel={() => setShowProfileEdit(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Jobsy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.fullName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && <HomeView user={user} onEditProfile={() => setShowProfileEdit(true)} onUpdateUser={onUpdateUser} onAddXP={addUserXP} />}
        {currentView === 'training' && <TrainingView user={user} onAddXP={addUserXP} />}
        {currentView === 'stats' && <StatsView user={user} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-8 py-3">
            <Button
              variant={currentView === 'home' ? 'default' : 'ghost'}
              onClick={() => onViewChange('home')}
              className="flex-1 max-w-[120px]"
            >
              <Home className="h-4 w-4 mr-2" />
              Inicio
            </Button>
            <Button
              variant={currentView === 'training' ? 'default' : 'ghost'}
              onClick={() => onViewChange('training')}
              className="flex-1 max-w-[120px]"
            >
              <Target className="h-4 w-4 mr-2" />
              Modo entrenamiento
            </Button>
            <Button
              variant={currentView === 'stats' ? 'default' : 'ghost'}
              onClick={() => onViewChange('stats')}
              className="flex-1 max-w-[120px]"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Estadísticas
            </Button>
          </div>
        </div>
      </nav>

      {/* Add padding bottom to prevent content from being hidden behind nav */}
      <div className="h-20"></div>
    </div>
  );
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
function HomeView({ user, onEditProfile, onUpdateUser, onAddXP }: { 
  user: User; 
  onEditProfile: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
  onAddXP: (xpGained: number) => Promise<boolean>;
}) {
  const [showLevelInterview, setShowLevelInterview] = useState(false);
  const currentLevel = user.level || 1;
  const levels = [currentLevel, currentLevel + 1, currentLevel + 2, currentLevel + 3, currentLevel + 4];

  /**
   * Handles completion of level interview with XP and level progression
   * 
   * @param {number} score - Interview score achieved
   * @param {any[]} answers - User's answers (not used in current implementation)
   */
  const handleLevelInterviewComplete = async (score: number, answers: any[]) => {
    console.log('🎬 handleLevelInterviewComplete llamado');
    console.log('   📊 Score:', score);
    
    const xpGained = score;
    console.log('   ⭐ XP a otorgar:', xpGained);
    
    // Call backend to update XP
    console.log('   📤 Llamando a onAddXP...');
    await onAddXP(xpGained);
    
    setShowLevelInterview(false);
  };

  if (showLevelInterview) {
    return (
      <InterviewSimulator
        category="general"
        onComplete={handleLevelInterviewComplete}
        onCancel={() => setShowLevelInterview(false)}
        userProfile={user}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* User Profile Section */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span>Perfil</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nivel actual</p>
              <p className="text-2xl font-bold">{currentLevel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">XP Total</p>
              <p className="text-xl font-semibold">{user.totalXP}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progreso al siguiente nivel</p>
              <Progress value={((user.totalXP % 500) / 500) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {user.totalXP % 500}/500 XP
              </p>
            </div>
            <Button variant="outline" className="w-full" onClick={onEditProfile}>
              <Settings className="h-4 w-4 mr-2" />
              Editar perfil
            </Button>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Insignias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.badges.map(badge => (
                <div
                  key={badge.id}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                    badge.earned ? badge.color : 'bg-gray-300'
                  }`}
                  title={badge.description}
                >
                  {badge.name.charAt(0)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Missions */}
        <Card>
          <CardHeader>
            <CardTitle>Misiones semanales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.weeklyMissions.map(mission => (
              <div key={mission.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{mission.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {mission.progress}/{mission.maxProgress}
                  </span>
                </div>
                <Progress value={(mission.progress / mission.maxProgress) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">{mission.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Level Map */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Camino de Progreso</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa entrevistas de nivel para avanzar por el camino
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 bg-gradient-to-t from-green-50 via-blue-50 to-purple-50 rounded-lg p-6 overflow-hidden">
              {/* Mountain/Path Background */}
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  <path d="M0,250 Q100,200 200,180 Q300,160 400,140" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="5,5" />
                </svg>
              </div>
              
              {/* Level Path */}
              <div className="relative h-full">
                {levels.map((level, index) => {
                  const positions = [
                    { bottom: '10%', left: '10%' },  // Current level
                    { bottom: '25%', left: '30%' },  // Next level
                    { bottom: '45%', left: '50%' },  // Level +2
                    { bottom: '65%', left: '70%' },  // Level +3
                    { bottom: '85%', left: '85%' },  // Level +4
                  ];
                  
                  const isUnlocked = level <= currentLevel;
                  const isCurrent = level === currentLevel;
                  const isNext = level === currentLevel + 1;
                  
                  return (
                    <div key={level} className="absolute" style={positions[index]}>
                      {/* Connecting path to next level */}
                      {index < levels.length - 1 && (
                        <div
                          className="absolute w-16 h-0.5 border-t-2 border-dotted border-blue-300"
                          style={{
                            top: '50%',
                            left: '100%',
                            transform: 'rotate(-20deg)',
                            transformOrigin: '0 50%'
                          }}
                        />
                      )}
                      
                      {/* Level circle */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer transition-all transform hover:scale-105 ${
                          isCurrent
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 ring-4 ring-blue-300 shadow-lg animate-pulse'
                            : isNext
                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md'
                            : isUnlocked
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        onClick={() => {
                          if (isCurrent) {
                            setShowLevelInterview(true);
                          }
                        }}
                        title={isCurrent ? `Nivel ${level} - ¡Haz clic para entrenar!` : `Nivel ${level}`}
                      >
                        {level}
                      </div>
                      
                      {/* Level label */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <p className="text-xs font-medium">
                          {isCurrent ? 'Actual' : isNext ? 'Siguiente' : `Nivel ${level}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Instructions */}
              <div className="absolute bottom-4 left-4 right-4">
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-3">
                    <p className="text-sm">
                      🎯 <span className="font-medium">Haz clic en tu nivel actual</span> para comenzar una entrevista personalizada
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Training view component for practice interviews and skill development
 * 
 * @param {Object} props - Component props
 * @param {User} props.user - Current user data
 * @returns {JSX.Element} Rendered training view
 */
function TrainingView({ user, onAddXP }: { user: User; onAddXP: (xpGained: number) => Promise<boolean> }) {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [activeSection, setActiveSection] = useState<'favorites' | 'history' | 'main'>('main');
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorCategory, setSimulatorCategory] = useState<'soft-skills' | 'technical' | 'general' | undefined>();
  
  const favoriteQuestions = mockQuestions.filter(q => q.isFavorite);

  /**
   * Starts an interview simulation with optional category filter
   * 
   * @param {string} [category] - Interview category to focus on
   */
  const startInterview = (category?: 'soft-skills' | 'technical' | 'general') => {
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
  const handleInterviewComplete = async (score: number, answers: any[]) => {
    console.log('🎬 handleInterviewComplete llamado');
    console.log('   📊 Score:', score);
    console.log('   📝 Respuestas:', answers.length);
    
    // Calculate XP based on score
    const xpGained = Math.floor(score / 2) + 20; // 20-70 XP based on score
    console.log('   ⭐ XP a otorgar:', xpGained);
    
    // Update XP in backend
    console.log('   📤 Llamando a onAddXP...');
    const success = await onAddXP(xpGained);
    console.log('   ✅ Resultado:', success ? 'Éxito' : 'Fallo');
    
    setShowSimulator(false);
    setActiveSection('history');
  };

  if (showSimulator) {
    return (
      <InterviewSimulator
        category={simulatorCategory}
        onComplete={handleInterviewComplete}
        onCancel={() => setShowSimulator(false)}
        userProfile={user}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <Card className={`cursor-pointer transition-all ${activeSection === 'favorites' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardHeader onClick={() => setActiveSection('favorites')}>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Favoritos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {favoriteQuestions.length} preguntas guardadas
            </p>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${activeSection === 'history' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardHeader onClick={() => setActiveSection('history')}>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Historial</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {mockInterviews.length} entrevistas realizadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {activeSection === 'main' && (
          <Card>
            <CardHeader>
              <CardTitle>Fortalece...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-12"
                  onClick={() => startInterview('soft-skills')}
                >
                  💬 Habilidades blandas
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12"
                  onClick={() => startInterview('technical')}
                >
                  ⚙️ Conocimientos técnicos
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12"
                  onClick={() => startInterview('general')}
                >
                  📚 Conceptos generales
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="O alguna habilidad de tu preferencia"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button 
                    className="bg-gray-700 hover:bg-gray-800"
                    onClick={() => startInterview()}
                  >
                    ⭐ Generate
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Entrenamiento personalizado</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Button variant="outline" onClick={() => startInterview()}>
                    🎯 Enfocar en debilidades
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Para entrevistas completas, usa el nivel actual desde la página de inicio
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'favorites' && (
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Favoritas</CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteQuestions.length === 0 ? (
                <p className="text-muted-foreground">No tienes preguntas favoritas aún.</p>
              ) : (
                <div className="space-y-4">
                  {favoriteQuestions.map(question => (
                    <div key={question.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{question.text}</h4>
                        <Badge variant="outline">{question.category}</Badge>
                      </div>
                      {question.feedback && (
                        <p className="text-sm text-muted-foreground">{question.feedback}</p>
                      )}
                      {question.score && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{question.score}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeSection === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle>Historial de Entrevistas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInterviews.map(interview => (
                  <div key={interview.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{interview.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {interview.date.toLocaleDateString()} - {interview.duration} min
                        </p>
                      </div>
                      <Badge variant={interview.score >= 80 ? 'default' : 'secondary'}>
                        {interview.score}%
                      </Badge>
                    </div>
                    <p className="text-sm">{interview.feedback}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {interview.questions.length} preguntas respondidas
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * Statistics view component showing user performance analytics
 * 
 * @param {Object} props - Component props
 * @param {User} props.user - Current user data
 * @returns {JSX.Element} Rendered statistics view
 */
function StatsView({ user }: { user: User }) {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Entrevistas totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{mockStats.totalInterviews}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Puntuación promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{mockStats.averageScore}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nivel actual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{user.level}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Áreas de mejora</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockStats.improvementAreas.map(area => (
            <div key={area.area} className="space-y-2">
              <div className="flex justify-between">
                <span>{area.area}</span>
                <span>{area.score}%</span>
              </div>
              <Progress value={area.score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progreso a lo largo del tiempo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockStats.progressOverTime.map(point => (
              <div key={point.date} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{point.date}</span>
                <span className="font-medium">{point.score}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}