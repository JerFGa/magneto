const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

const users = [
  { email: 'user@example.com', workExperience: '5 años', targetSector: 'Tecnología', targetRole: 'Desarrollador', configCompleted: false },
  { email: 'user2@example.com', workExperience: '3 años', targetSector: 'Finanzas', targetRole: 'Analista', configCompleted: false }
];

// Update user configuration endpoint
app.post('/api/user/config', (req, res) => {
  const { email, workExperience, targetSector, targetRole } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado', success: false });
  }
  
  // Actualizar configuración del usuario
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