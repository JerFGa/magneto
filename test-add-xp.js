// Script para probar el endpoint de actualización de XP

async function testAddXP() {
  console.log('🧪 Probando endpoint /api/user/add-xp...\n');
  
  // Primero, encuentra un usuario existente
  const testEmail = 'jfigueroag@eafit.edu.co'; // Email correcto de Jeremias
  
  try {
    console.log(`📤 Añadiendo 50 XP al usuario: ${testEmail}`);
    
    const response = await fetch('http://localhost:3001/api/user/add-xp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        xpGained: 50
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('\n✅ XP actualizado exitosamente!');
      console.log('   XP Ganado:', data.xpGained);
      console.log('   Total XP:', data.newTotalXP);
      console.log('   Nivel:', data.newLevel);
      console.log('\n📊 Usuario actualizado:');
      console.log('   Nombre:', data.user.fullName);
      console.log('   Email:', data.user.email);
      console.log('   Nivel:', data.user.level);
      console.log('   Total XP:', data.user.totalXP);
      console.log('   XP actual:', data.user.xp);
    } else {
      console.log('❌ Error:', data.message);
    }
  } catch (error) {
    console.error('❌ Error en la petición:', error.message);
  }
}

testAddXP();
