// Script para verificar la migracion de datos
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/jobsy';

async function verifyMigration() {
  console.log('=================================================');
  console.log('  Verificando Migracion de Datos');
  console.log('=================================================\n');

  try {
    // Conectar a MongoDB local
    console.log('[1/3] Conectando a MongoDB local...');
    await mongoose.connect(MONGODB_URI);
    console.log('      [OK] Conectado exitosamente\n');

    // Definir esquema de usuario (simplificado)
    const userSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', userSchema, 'users');

    // Contar usuarios
    console.log('[2/3] Verificando datos migrados...');
    const userCount = await User.countDocuments();
    console.log(`      [OK] Total de usuarios: ${userCount}\n`);

    // Mostrar usuarios
    if (userCount > 0) {
      console.log('[3/3] Lista de usuarios migrados:');
      const users = await User.find({}, { fullName: 1, email: 1, _id: 0 }).limit(10);
      users.forEach((user, index) => {
        console.log(`      ${index + 1}. ${user.fullName || 'Sin nombre'} (${user.email || 'Sin email'})`);
      });
      console.log('');
    } else {
      console.log('[3/3] No se encontraron usuarios en la base de datos\n');
    }

    console.log('=================================================');
    console.log('  Verificacion Completada');
    console.log('=================================================\n');
    console.log('Estado: EXITOSO');
    console.log(`Base de datos: ${MONGODB_URI}`);
    console.log(`Usuarios migrados: ${userCount}\n`);

  } catch (error) {
    console.error('\n[ERROR] Error durante la verificacion:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

verifyMigration();
