import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { projectId } from '../utils/supabase/info';
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
import { 
  Settings, 
  FileQuestion, 
  Award, 
  Target, 
  BarChart3, 
  Users, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Upload
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-04d474db`;

interface AdminPanelProps {
  user: User;
  accessToken: string;
  onLogout: () => void;
}

interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: string;
  sector?: string;
}

interface PlatformBadge {
  id: string;
  name: string;
  description: string;
  color: string;
  requirement: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  maxProgress: number;
  xpReward: number;
}

interface PlatformSettings {
  maxInterviewDuration: number;
  questionsPerInterview: number;
  xpPerPoint: number;
  xpForLevelUp: number;
}

interface Statistics {
  totalUsers: number;
  totalInterviews: number;
  completedInterviews: number;
  avgScore: number;
  avgDuration: number;
  usersByLevel: { [key: number]: number };
}

interface UserPerformance {
  userId: string;
  fullName: string;
  email: string;
  level: number;
  totalXP: number;
  interviewsCompleted: number;
  avgScore: number;
  avgDuration: number;
  lastActivity: string | null;
}

export function AdminPanel({ user, accessToken, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<PlatformSettings>({
    maxInterviewDuration: 60,
    questionsPerInterview: 5,
    xpPerPoint: 10,
    xpForLevelUp: 500
  });

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: '',
    category: 'general',
    difficulty: 'medium',
    sector: ''
  });

  // Badges state
  const [badges, setBadges] = useState<PlatformBadge[]>([]);
  const [editingBadge, setEditingBadge] = useState<PlatformBadge | null>(null);
  const [newBadge, setNewBadge] = useState<Partial<PlatformBadge>>({
    name: '',
    description: '',
    color: 'blue',
    requirement: ''
  });

  // Missions state
  const [missions, setMissions] = useState<Mission[]>([]);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [newMission, setNewMission] = useState<Partial<Mission>>({
    title: '',
    description: '',
    maxProgress: 1,
    xpReward: 100
  });

  // Statistics state
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [userPerformance, setUserPerformance] = useState<UserPerformance[]>([]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'settings') {
      fetchSettings();
    } else if (activeTab === 'questions') {
      fetchQuestions();
    } else if (activeTab === 'badges') {
      fetchBadges();
    } else if (activeTab === 'missions') {
      fetchMissions();
    } else if (activeTab === 'statistics') {
      fetchStatistics();
    } else if (activeTab === 'performance') {
      fetchUserPerformance();
    }
  }, [activeTab]);

  // API calls
  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/settings`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        toast.success('Configuración actualizada');
      } else {
        toast.error('Error al actualizar configuración');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Error al actualizar configuración');
    }
    setLoading(false);
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/questions`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const createQuestion = async () => {
    if (!newQuestion.text) {
      toast.error('El texto de la pregunta es requerido');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(newQuestion)
      });
      
      if (response.ok) {
        toast.success('Pregunta creada');
        setNewQuestion({ text: '', category: 'general', difficulty: 'medium', sector: '' });
        fetchQuestions();
      } else {
        toast.error('Error al crear pregunta');
      }
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Error al crear pregunta');
    }
    setLoading(false);
  };

  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        toast.success('Pregunta actualizada');
        setEditingQuestion(null);
        fetchQuestions();
      } else {
        toast.error('Error al actualizar pregunta');
      }
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Error al actualizar pregunta');
    }
    setLoading(false);
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/questions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (response.ok) {
        toast.success('Pregunta eliminada');
        fetchQuestions();
      } else {
        toast.error('Error al eliminar pregunta');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Error al eliminar pregunta');
    }
    setLoading(false);
  };

  const fetchBadges = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/badges`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges || []);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const createBadge = async () => {
    if (!newBadge.name || !newBadge.description) {
      toast.error('Nombre y descripción son requeridos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/badges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(newBadge)
      });
      
      if (response.ok) {
        toast.success('Insignia creada');
        setNewBadge({ name: '', description: '', color: 'blue', requirement: '' });
        fetchBadges();
      } else {
        toast.error('Error al crear insignia');
      }
    } catch (error) {
      console.error('Error creating badge:', error);
      toast.error('Error al crear insignia');
    }
    setLoading(false);
  };

  const updateBadge = async (id: string, updates: Partial<PlatformBadge>) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/badges/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        toast.success('Insignia actualizada');
        setEditingBadge(null);
        fetchBadges();
      } else {
        toast.error('Error al actualizar insignia');
      }
    } catch (error) {
      console.error('Error updating badge:', error);
      toast.error('Error al actualizar insignia');
    }
    setLoading(false);
  };

  const deleteBadge = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta insignia?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/badges/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (response.ok) {
        toast.success('Insignia eliminada');
        fetchBadges();
      } else {
        toast.error('Error al eliminar insignia');
      }
    } catch (error) {
      console.error('Error deleting badge:', error);
      toast.error('Error al eliminar insignia');
    }
    setLoading(false);
  };

  const fetchMissions = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/missions`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMissions(data.missions || []);
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
    }
  };

  const createMission = async () => {
    if (!newMission.title || !newMission.description) {
      toast.error('Título y descripción son requeridos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/missions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(newMission)
      });
      
      if (response.ok) {
        toast.success('Misión creada');
        setNewMission({ title: '', description: '', maxProgress: 1, xpReward: 100 });
        fetchMissions();
      } else {
        toast.error('Error al crear misión');
      }
    } catch (error) {
      console.error('Error creating mission:', error);
      toast.error('Error al crear misión');
    }
    setLoading(false);
  };

  const updateMission = async (id: string, updates: Partial<Mission>) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/missions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        toast.success('Misión actualizada');
        setEditingMission(null);
        fetchMissions();
      } else {
        toast.error('Error al actualizar misión');
      }
    } catch (error) {
      console.error('Error updating mission:', error);
      toast.error('Error al actualizar misión');
    }
    setLoading(false);
  };

  const deleteMission = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta misión?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/missions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (response.ok) {
        toast.success('Misión eliminada');
        fetchMissions();
      } else {
        toast.error('Error al eliminar misión');
      }
    } catch (error) {
      console.error('Error deleting mission:', error);
      toast.error('Error al eliminar misión');
    }
    setLoading(false);
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/statistics`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchUserPerformance = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users/performance`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserPerformance(data.userPerformance || []);
      }
    } catch (error) {
      console.error('Error fetching user performance:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-blue-600">Jobsy Admin</h1>
              <Badge variant="secondary">Administrador</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.fullName}</span>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configuración</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              <span className="hidden sm:inline">Preguntas</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Insignias</span>
            </TabsTrigger>
            <TabsTrigger value="missions" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Misiones</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Estadísticas</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Usuarios</span>
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de la Plataforma</CardTitle>
                <CardDescription>
                  Ajusta los parámetros generales del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Duración máxima de entrevista (minutos)</Label>
                    <Input
                      type="number"
                      value={settings.maxInterviewDuration}
                      onChange={(e) => setSettings({ ...settings, maxInterviewDuration: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preguntas por entrevista</Label>
                    <Input
                      type="number"
                      value={settings.questionsPerInterview}
                      onChange={(e) => setSettings({ ...settings, questionsPerInterview: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>XP por punto de calificación</Label>
                    <Input
                      type="number"
                      value={settings.xpPerPoint}
                      onChange={(e) => setSettings({ ...settings, xpPerPoint: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>XP necesaria para subir de nivel</Label>
                    <Input
                      type="number"
                      value={settings.xpForLevelUp}
                      onChange={(e) => setSettings({ ...settings, xpForLevelUp: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <Button onClick={updateSettings} disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <div className="space-y-6">
              {/* Create Question Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nueva Pregunta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Texto de la pregunta</Label>
                    <Textarea
                      value={newQuestion.text}
                      onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                      placeholder="Escribe la pregunta aquí..."
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Select
                        value={newQuestion.category}
                        onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="soft-skills">Soft Skills</SelectItem>
                          <SelectItem value="technical">Técnica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Dificultad</Label>
                      <Select
                        value={newQuestion.difficulty}
                        onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Fácil</SelectItem>
                          <SelectItem value="medium">Medio</SelectItem>
                          <SelectItem value="hard">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Sector (opcional)</Label>
                      <Input
                        value={newQuestion.sector}
                        onChange={(e) => setNewQuestion({ ...newQuestion, sector: e.target.value })}
                        placeholder="Ej: Tecnología"
                      />
                    </div>
                  </div>
                  <Button onClick={createQuestion} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Pregunta
                  </Button>
                </CardContent>
              </Card>

              {/* Questions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Preguntas Existentes ({questions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {questions.map((question) => (
                        <Card key={question.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 space-y-2">
                                <p className="font-medium">{question.text}</p>
                                <div className="flex gap-2">
                                  <Badge variant="outline">{question.category}</Badge>
                                  <Badge variant="outline">{question.difficulty}</Badge>
                                  {question.sector && <Badge variant="secondary">{question.sector}</Badge>}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(question)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Editar Pregunta</DialogTitle>
                                    </DialogHeader>
                                    {editingQuestion && (
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <Label>Texto</Label>
                                          <Textarea
                                            value={editingQuestion.text}
                                            onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                                            rows={3}
                                          />
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                          <div className="space-y-2">
                                            <Label>Categoría</Label>
                                            <Select
                                              value={editingQuestion.category}
                                              onValueChange={(value) => setEditingQuestion({ ...editingQuestion, category: value })}
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="general">General</SelectItem>
                                                <SelectItem value="soft-skills">Soft Skills</SelectItem>
                                                <SelectItem value="technical">Técnica</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Dificultad</Label>
                                            <Select
                                              value={editingQuestion.difficulty}
                                              onValueChange={(value) => setEditingQuestion({ ...editingQuestion, difficulty: value })}
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="easy">Fácil</SelectItem>
                                                <SelectItem value="medium">Medio</SelectItem>
                                                <SelectItem value="hard">Difícil</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                        <Button onClick={() => updateQuestion(editingQuestion.id, editingQuestion)} disabled={loading}>
                                          Guardar Cambios
                                        </Button>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteQuestion(question.id)}
                                  disabled={loading}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <div className="space-y-6">
              {/* Create Badge Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nueva Insignia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input
                        value={newBadge.name}
                        onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                        placeholder="Nombre de la insignia"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Select
                        value={newBadge.color}
                        onValueChange={(value) => setNewBadge({ ...newBadge, color: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Azul</SelectItem>
                          <SelectItem value="green">Verde</SelectItem>
                          <SelectItem value="yellow">Amarillo</SelectItem>
                          <SelectItem value="red">Rojo</SelectItem>
                          <SelectItem value="purple">Púrpura</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={newBadge.description}
                      onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                      placeholder="Descripción de la insignia"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Requisito</Label>
                    <Input
                      value={newBadge.requirement}
                      onChange={(e) => setNewBadge({ ...newBadge, requirement: e.target.value })}
                      placeholder="Ej: Completar 10 entrevistas"
                    />
                  </div>
                  <Button onClick={createBadge} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Insignia
                  </Button>
                </CardContent>
              </Card>

              {/* Badges List */}
              <Card>
                <CardHeader>
                  <CardTitle>Insignias Existentes ({badges.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {badges.map((badge) => (
                      <Card key={badge.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <Badge className={`bg-${badge.color}-500`}>{badge.name}</Badge>
                              <div className="flex gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => setEditingBadge(badge)}>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Editar Insignia</DialogTitle>
                                    </DialogHeader>
                                    {editingBadge && (
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <Label>Nombre</Label>
                                          <Input
                                            value={editingBadge.name}
                                            onChange={(e) => setEditingBadge({ ...editingBadge, name: e.target.value })}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Descripción</Label>
                                          <Textarea
                                            value={editingBadge.description}
                                            onChange={(e) => setEditingBadge({ ...editingBadge, description: e.target.value })}
                                            rows={2}
                                          />
                                        </div>
                                        <Button onClick={() => updateBadge(editingBadge.id, editingBadge)} disabled={loading}>
                                          Guardar Cambios
                                        </Button>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteBadge(badge.id)}
                                  disabled={loading}
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{badge.description}</p>
                            <p className="text-xs text-gray-500">Requisito: {badge.requirement}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions">
            <div className="space-y-6">
              {/* Create Mission Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nueva Misión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={newMission.title}
                      onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                      placeholder="Título de la misión"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea
                      value={newMission.description}
                      onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                      placeholder="Descripción de la misión"
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Progreso máximo</Label>
                      <Input
                        type="number"
                        value={newMission.maxProgress}
                        onChange={(e) => setNewMission({ ...newMission, maxProgress: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Recompensa XP</Label>
                      <Input
                        type="number"
                        value={newMission.xpReward}
                        onChange={(e) => setNewMission({ ...newMission, xpReward: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button onClick={createMission} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Misión
                  </Button>
                </CardContent>
              </Card>

              {/* Missions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Misiones Existentes ({missions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {missions.map((mission) => (
                      <Card key={mission.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 space-y-2">
                              <h4 className="font-medium">{mission.title}</h4>
                              <p className="text-sm text-gray-600">{mission.description}</p>
                              <div className="flex gap-4 text-sm text-gray-500">
                                <span>Progreso: {mission.maxProgress}</span>
                                <span>Recompensa: {mission.xpReward} XP</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setEditingMission(mission)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Editar Misión</DialogTitle>
                                  </DialogHeader>
                                  {editingMission && (
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label>Título</Label>
                                        <Input
                                          value={editingMission.title}
                                          onChange={(e) => setEditingMission({ ...editingMission, title: e.target.value })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Descripción</Label>
                                        <Textarea
                                          value={editingMission.description}
                                          onChange={(e) => setEditingMission({ ...editingMission, description: e.target.value })}
                                          rows={2}
                                        />
                                      </div>
                                      <Button onClick={() => updateMission(editingMission.id, editingMission)} disabled={loading}>
                                        Guardar Cambios
                                      </Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMission(mission.id)}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            {statistics && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Usuarios Totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{statistics.totalUsers}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Entrevistas Totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{statistics.totalInterviews}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {statistics.completedInterviews} completadas
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Puntuación Promedio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{statistics.avgScore}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Duración Promedio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{statistics.avgDuration}</p>
                    <p className="text-sm text-gray-500 mt-2">minutos</p>
                  </CardContent>
                </Card>
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Distribución por Nivel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(statistics.usersByLevel).map(([level, count]) => (
                        <div key={level} className="flex justify-between items-center">
                          <span>Nivel {level}</span>
                          <Badge>{count} usuarios</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Desempeño de Usuarios</CardTitle>
                <CardDescription>
                  Métricas detalladas de rendimiento de cada candidato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>XP Total</TableHead>
                        <TableHead>Entrevistas</TableHead>
                        <TableHead>Puntuación Prom.</TableHead>
                        <TableHead>Duración Prom.</TableHead>
                        <TableHead>Última Actividad</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userPerformance.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell className="font-medium">{user.fullName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.level}</Badge>
                          </TableCell>
                          <TableCell>{user.totalXP}</TableCell>
                          <TableCell>{user.interviewsCompleted}</TableCell>
                          <TableCell>{user.avgScore}</TableCell>
                          <TableCell>{user.avgDuration} min</TableCell>
                          <TableCell>
                            {user.lastActivity
                              ? new Date(user.lastActivity).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
