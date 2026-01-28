import bcrypt from 'bcryptjs';
import { query } from '../src/config/database.js';

const fixAllPasswords = async () => {
  console.log('\n🔧 Verificando y corrigiendo contraseñas en la base de datos...\n');

  try {
    // Obtener todos los usuarios
    const users = await query('SELECT id, email, password, password_hash FROM users');
    
    console.log(`📊 Total usuarios encontrados: ${users.length}\n`);

    for (const user of users) {
      console.log(`\n👤 Usuario: ${user.email}`);
      
      let needsUpdate = false;
      let newHash = null;

      // Caso 1: password_hash es NULL
      if (!user.password_hash) {
        console.log('   ⚠️  password_hash es NULL');
        
        if (user.password) {
          console.log('   🔄 Hasheando desde campo "password"...');
          newHash = await bcrypt.hash(user.password, 10);
          needsUpdate = true;
        } else {
          console.log('   ⚠️  No hay contraseña disponible, usando "123456" por defecto');
          newHash = await bcrypt.hash('123456', 10);
          needsUpdate = true;
        }
      }
      // Caso 2: password_hash no es formato bcrypt
      else if (!user.password_hash.startsWith('$2a$') && 
               !user.password_hash.startsWith('$2b$') && 
               !user.password_hash.startsWith('$2y$')) {
        console.log('   ⚠️  password_hash no es formato bcrypt válido');
        console.log(`   Valor actual: ${user.password_hash.substring(0, 30)}...`);
        console.log('   🔄 Hasheando...');
        newHash = await bcrypt.hash(user.password_hash, 10);
        needsUpdate = true;
      }
      // Caso 3: Todo OK
      else {
        console.log('   ✅ password_hash es válido (formato bcrypt)');
      }

      if (needsUpdate) {
        await query(
          'UPDATE users SET password_hash = ?, password = NULL WHERE id = ?',
          [newHash, user.id]
        );
        console.log('   ✅ Actualizado correctamente');
      }
    }

    console.log('\n\n✅ Proceso completado\n');
    console.log('📋 Para probar el login:');
    console.log('   - Si se hasheó desde "password": usa la contraseña original');
    console.log('   - Si no había contraseña: usa "123456"\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
};

fixAllPasswords();
