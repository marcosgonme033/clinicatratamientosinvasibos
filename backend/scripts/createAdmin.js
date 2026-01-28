import bcrypt from 'bcryptjs';
import { query } from '../src/config/database.js';

const createAdminUser = async () => {
  console.log('\n🔐 Creando usuario administrador...\n');

  const email = 'admin@clinica.com';
  const password = '123456';
  const name = 'Administrador';
  const role = 'admin';

  try {
    // Verificar si ya existe
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      console.log('⚠️  El usuario ya existe. Actualizando contraseña...');
      
      const hash = await bcrypt.hash(password, 10);
      await query('UPDATE users SET password_hash = ?, password = NULL WHERE email = ?', [hash, email]);
      
      console.log('✅ Contraseña actualizada exitosamente');
    } else {
      console.log('📝 Creando nuevo usuario...');
      
      const hash = await bcrypt.hash(password, 10);
      await query(
        'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
        [email, hash, role, name]
      );
      
      console.log('✅ Usuario creado exitosamente');
    }

    console.log('\n📋 Credenciales:\n');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
};

createAdminUser();
