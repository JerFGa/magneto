const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Ollama } = require('ollama');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Inicializar Ollama
const ollama = new Ollama({ host: 'http://localhost:11434' });

app.use(cors());
app.use(express.json());

// Conexión a MongoDB Local
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Local'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Esquema y modelo de usuario
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  level: { type: Number, default: 1 },
  totalXP: { type: Number, default: 0 },
  badges: { type: Array, default: [] },
  weeklyMissions: { type: Array, default: [] },
  workExperience: String,
  targetSector: String,
  targetRole: String,
  configCompleted: { type: Boolean, default: false }
});

// Después de definir userSchema, añade nuevos campos:
userSchema.add({
  strengths: { type: [String], default: [] },
  improvements: { type: [String], default: [] },
  notes: { type: String, default: '' },
});
// Opcional: timestamps en el esquema (si aún no lo tienes)
// userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

// Ping endpoint
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos', user: null });
  }
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'El correo ya está registrado. Por favor usa otro.', user: null });
    }
    const user = await User.create({ fullName, email, password });
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ message: 'Registro realizado con éxito', user: userObj });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', user: null });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado', user: null });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta', user: null });
    }
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({ message: 'Acceso concedido', user: userObj });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', user: null });
  }
});

// Helpers para clasificar y sanear entradas
function sanitizeList(list) {
  return [...new Set(
    (list || [])
      .map((s) => String(s).trim())
      .filter((s) => s.length > 0)
  )];
}
function classifyPoints(summaryText) {
  const negatives = [
    'mejorar', 'falta', 'débil', 'debilidad', 'necesito', 'por mejorar',
    'aprendiendo', 'pendiente', 'no domino', 'quiero mejorar'
  ];
  const items = String(summaryText || '')
    .split(/\n|,|;|•|-|\u2022/g)
    .map((s) => s.trim())
    .filter(Boolean);

  const strengths = [];
  const improvements = [];

  for (const it of items) {
    const lower = it.toLowerCase();
    const isNegative = negatives.some((n) => lower.includes(n));
    if (isNegative) improvements.push(it);
    else strengths.push(it);
  }
  return {
    strengths: sanitizeList(strengths),
    improvements: sanitizeList(improvements),
  };
}

// Update user configuration endpoint
app.post('/api/user/config', async (req, res) => {
  const { email, workExperience, targetSector, targetRole } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { workExperience, targetSector, targetRole, configCompleted: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado', success: false });
    }
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({ 
      message: 'Configuración guardada exitosamente', 
      user: userObj,
      success: true 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', success: false });
  }
});

// Nuevo endpoint para guardar perfil + clasificación
app.post('/api/user/profile', async (req, res) => {
  try {
    const {
      email,
      workExperience,
      targetSector,
      targetRole,
      summaryText,     // texto libre del formulario (opcional)
      strengths,       // array opcional
      improvements,    // array opcional
    } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email es requerido' });
    }

    let sets = {};
    if (typeof workExperience === 'string') sets.workExperience = workExperience;
    if (typeof targetSector === 'string') sets.targetSector = targetSector;
    if (typeof targetRole === 'string') sets.targetRole = targetRole;

    // Si vienen arrays directos, se usan; si no, se clasifican desde summaryText
    let finalStrengths = Array.isArray(strengths) ? strengths : [];
    let finalImprovements = Array.isArray(improvements) ? improvements : [];

    if ((!finalStrengths.length && !finalImprovements.length) && summaryText) {
      const cls = classifyPoints(summaryText);
      finalStrengths = cls.strengths;
      finalImprovements = cls.improvements;
      sets.notes = summaryText;
    }

    if (finalStrengths.length) sets.strengths = sanitizeList(finalStrengths);
    if (finalImprovements.length) sets.improvements = sanitizeList(finalImprovements);

    // marca configuración como completa si hay datos clave
    if (sets.workExperience || sets.targetSector || sets.targetRole || sets.strengths || sets.improvements) {
      sets.configCompleted = true;
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $set: sets },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: 'Perfil actualizado correctamente',
      user: userObj,
    });
  } catch (err) {
    console.error('Error /api/user/profile:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Endpoint para generar preguntas con Ollama
app.post('/api/generate-question', async (req, res) => {
  try {
    const { userProfile, questionNumber, totalQuestions, previousQuestions } = req.body;
    
    // Construir el contexto para el prompt
    const context = userProfile ? `
Perfil del candidato:
- Experiencia: ${userProfile.workExperience || 'No especificada'}
- Sector objetivo: ${userProfile.targetSector || 'No especificado'}
- Puesto objetivo: ${userProfile.targetRole || 'No especificado'}
- Fortalezas: ${userProfile.strengths?.join(', ') || 'No especificadas'}
- Áreas de mejora: ${userProfile.improvements?.join(', ') || 'No especificadas'}
    `.trim() : '';

    const previousQuestionsText = previousQuestions?.length 
      ? `\n\nPreguntas anteriores (evita repetir temas similares):\n${previousQuestions.join('\n')}`
      : '';

    const prompt = `Eres un experto entrevistador de recursos humanos. Genera UNA pregunta de entrevista laboral relevante y profesional.

${context}

${previousQuestionsText}

Esta es la pregunta ${questionNumber} de ${totalQuestions} en la entrevista.

INSTRUCCIONES:
- Genera SOLO la pregunta, sin numeración ni formato adicional
- La pregunta debe ser clara, profesional y relevante para el perfil
- Debe ser apropiada para una entrevista real
- No incluyas múltiples preguntas
- No agregues explicaciones ni contexto adicional

Pregunta:`;

    // Llamar a Ollama con Llama 3.1
    const response = await ollama.chat({
      model: 'llama3.1:8b',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    });

    const question = response.message.content.trim();

    res.status(200).json({ 
      success: true,
      question: question,
      questionNumber: questionNumber
    });

  } catch (err) {
    console.error('Error al generar pregunta con Ollama:', err);
    
    // Si Ollama no está disponible, devolver una pregunta de respaldo
    const fallbackQuestions = [
      '¿Puedes contarme sobre tu experiencia profesional más relevante?',
      '¿Cuáles son tus principales fortalezas y cómo las has aplicado en tu trabajo?',
      '¿Por qué estás interesado en este puesto y esta empresa?',
      '¿Puedes describir un desafío que hayas enfrentado y cómo lo resolviste?',
      '¿Dónde te ves en 5 años en tu carrera profesional?'
    ];
    
    res.status(200).json({ 
      success: true,
      question: fallbackQuestions[(req.body.questionNumber - 1) % fallbackQuestions.length],
      questionNumber: req.body.questionNumber,
      fallback: true,
      error: 'Ollama no disponible, usando pregunta de respaldo'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});