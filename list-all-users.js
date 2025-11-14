const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Conectado a MongoDB\n');
    
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    const users = await User.find({}).select('fullName email level totalXP xp');
    
    if (users.length > 0) {
      console.log(`📊 Total de usuarios: ${users.length}\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.fullName}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🎚️  Nivel: ${user.level || 1}`);
        console.log(`   ⭐ Total XP: ${user.totalXP || 0}`);
        console.log(`   ✨ XP actual: ${user.xp || 0}`);
        console.log('');
      });
    } else {
      console.log('❌ No hay usuarios en la base de datos');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
