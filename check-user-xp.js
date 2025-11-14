const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Conectado a MongoDB\n');
    
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    const email = 'jeremias@eafit.edu.co';
    const user = await User.findOne({ email });
    
    if (user) {
      console.log(`👤 Usuario: ${user.fullName}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🎚️  Nivel: ${user.level}`);
      console.log(`⭐ Total XP: ${user.totalXP}`);
      console.log(`✨ XP actual: ${user.xp || 0}`);
      console.log(`📊 XP para siguiente nivel: ${((user.level + 1) * 500) - user.totalXP}`);
    } else {
      console.log('❌ Usuario no encontrado');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
