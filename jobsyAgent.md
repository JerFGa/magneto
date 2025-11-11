# Integración de Ollama con Llama 3.1 - Simulador de Entrevistas

## 📋 Descripción

La aplicación ahora utiliza **Ollama con Llama 3.1** para generar preguntas de entrevista personalizadas y dinámicas basadas en el perfil del usuario.

## 🚀 Cómo funciona

### 1. Backend (server.js)
- Se agregó el paquete `ollama` para comunicarse con la instancia local de Ollama
- Nuevo endpoint: `POST /api/generate-question`
- El endpoint recibe:
  - **userProfile**: Datos del usuario (experiencia, sector objetivo, rol, fortalezas, mejoras)
  - **questionNumber**: Número de la pregunta actual
  - **totalQuestions**: Total de preguntas en la entrevista
  - **previousQuestions**: Preguntas ya generadas (para evitar repetición)

### 2. Frontend (InterviewSimulator.tsx)
- Al iniciar el simulador, se genera la primera pregunta automáticamente
- Cada vez que el usuario avanza, se genera la siguiente pregunta
- Muestra un indicador de carga mientras se genera la pregunta
- Si Ollama no está disponible, usa preguntas de respaldo predefinidas

## 🎯 Personalización de Preguntas

Las preguntas generadas por Llama 3.1 son personalizadas según:
- ✅ Experiencia laboral del usuario
- ✅ Sector objetivo (ej: tecnología, finanzas, marketing)
- ✅ Puesto objetivo (ej: desarrollador, gerente, analista)
- ✅ Fortalezas identificadas
- ✅ Áreas de mejora
- ✅ Contexto de preguntas anteriores

## 🛠️ Requisitos

### Ollama debe estar instalado y corriendo
```bash
# Verificar que Ollama está corriendo
curl http://localhost:11434/api/tags

# Si no está corriendo, iniciarlo
ollama serve
```

### Modelo Llama 3.1 descargado
```bash
# Descargar el modelo si no lo tienes
ollama pull llama3.1

# Verificar que el modelo está disponible
ollama list
```

## 🔧 Configuración

El servidor se conecta a Ollama en: `http://localhost:11434` (puerto por defecto)

Si necesitas cambiar el puerto, edita la línea en `server.js`:
```javascript
const ollama = new Ollama({ host: 'http://localhost:11434' });
```

## 🧪 Modo de Respaldo

Si Ollama no está disponible o hay un error:
- ⚠️ Se mostrarán preguntas predefinidas de respaldo
- 🔄 El usuario puede continuar con la entrevista sin interrupciones
- 🏷️ Las preguntas se marcan como "Pregunta estándar" en lugar de "Generada por IA"

## 📝 Ejemplo de Prompt

```
Eres un experto entrevistador de recursos humanos. Genera UNA pregunta de entrevista laboral relevante y profesional.

Perfil del candidato:
- Experiencia: 3 años como desarrollador web
- Sector objetivo: Tecnología
- Puesto objetivo: Desarrollador Full Stack Senior
- Fortalezas: React, Node.js, trabajo en equipo
- Áreas de mejora: Liderazgo de proyectos

Preguntas anteriores (evita repetir temas similares):
¿Puedes contarme sobre tu experiencia más relevante con React?

Esta es la pregunta 2 de 5 en la entrevista.

INSTRUCCIONES:
- Genera SOLO la pregunta, sin numeración ni formato adicional
- La pregunta debe ser clara, profesional y relevante para el perfil
- Debe ser apropiada para una entrevista real
- No incluyas múltiples preguntas
- No agregues explicaciones ni contexto adicional

Pregunta:
```

## 🎨 Interfaz de Usuario

### Indicadores visuales:
- 🔄 **Spinner de carga**: "Generando pregunta personalizada con IA..."
- 🤖 **Badge "Generada por IA"**: Pregunta creada por Llama 3.1
- 📄 **Badge "Pregunta estándar"**: Pregunta de respaldo

## 🐛 Solución de Problemas

### Error: "Cannot find module 'ollama'"
```bash
npm install ollama
```

### Error: "ECONNREFUSED localhost:11434"
```bash
# Asegúrate de que Ollama está corriendo
ollama serve
```

### Error: "model 'llama3.1' not found"
```bash
ollama pull llama3.1
```

### Las preguntas son genéricas
- Verifica que el usuario haya completado su perfil en la aplicación
- Los datos del perfil se usan para personalizar las preguntas

## 📊 Ventajas

1. **Preguntas Personalizadas**: Adaptadas al perfil específico del candidato
2. **No Repetitivas**: El sistema evita hacer preguntas similares
3. **Contextualizadas**: Considera el progreso de la entrevista
4. **Offline**: No requiere APIs externas o conexión a internet
5. **Privacidad**: Los datos se procesan localmente
6. **Escalable**: Fácil de extender con más modelos o personalización

## 🚀 Próximas Mejoras

- [ ] Análisis de respuestas con IA
- [ ] Feedback personalizado por pregunta
- [ ] Diferentes niveles de dificultad dinámicos
- [ ] Seguimiento de temas específicos según las respuestas
- [ ] Integración con más modelos de Ollama (mistral, codellama, etc.)

## 📞 Soporte

Si encuentras problemas con la integración:
1. Verifica que Ollama esté corriendo: `ollama serve`
2. Verifica que llama3.1 esté instalado: `ollama list`
3. Revisa los logs del servidor en la consola
4. Verifica la consola del navegador para errores de frontend
