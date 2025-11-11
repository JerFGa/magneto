// Test script para verificar la conexión con Ollama
const { Ollama } = require('ollama');

async function testOllama() {
  console.log('🔍 Verificando conexión con Ollama...\n');
  
  const ollama = new Ollama({ host: 'http://localhost:11434' });
  
  try {
    console.log('📡 Intentando generar una pregunta de prueba...');
    
    const response = await ollama.chat({
      model: 'llama3.1:8b',
      messages: [{ 
        role: 'user', 
        content: 'Genera una pregunta corta para una entrevista de trabajo en tecnología.' 
      }],
      stream: false,
    });

    console.log('\n✅ ¡Conexión exitosa con Ollama!\n');
    console.log('📝 Pregunta generada:');
    console.log('------------------');
    console.log(response.message.content);
    console.log('------------------\n');
    console.log('✨ La integración está funcionando correctamente.');
    
  } catch (error) {
    console.error('\n❌ Error al conectar con Ollama:\n');
    console.error(error.message);
    console.log('\n🔧 Soluciones posibles:');
    console.log('1. Asegúrate de que Ollama está corriendo: ollama serve');
    console.log('2. Verifica que llama3.1 está instalado: ollama list');
    console.log('3. Si no tienes el modelo: ollama pull llama3.1\n');
  }
}

testOllama();
