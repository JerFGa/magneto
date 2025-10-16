import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Middleware para log de requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Mock user database
const users = [];

// Ping endpoint
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

// Register endpoint
app.post('/api/register', (req, res) => {
  const { fullName, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'El usuario ya existe', user: null });
  }
  const user = { 
    id: users.length + 1, 
    fullName, 
    email, 
    password,
    level: 1,
    totalXP: 0,
    badges: [],
    weeklyMissions: []
  };
  users.push(user);
  res.status(201).json({ message: 'Registro realizado con éxito', user });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Credenciales incorrectas', user: null });
  }
  res.status(200).json({ message: 'Acceso concedido', user });
});

// Update user configuration endpoint
app.post('/api/user/config', (req, res) => {
  const { email, workExperience, targetSector, targetRole } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado', success: false });
  }
  
  user.workExperience = workExperience;
  user.targetSector = targetSector;
  user.targetRole = targetRole;
  user.configCompleted = true;
  
  res.status(200).json({ 
    message: 'Configuración guardada exitosamente', 
    user,
    success: true 
  });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});