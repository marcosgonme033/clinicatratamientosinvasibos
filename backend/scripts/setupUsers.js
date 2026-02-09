import bcrypt from 'bcryptjs';
import { query } from '../src/config/database.js';

const setupUsers = async () => {
  console.log('\n🔐 Configurando usuarios...\n');

  try {
    // Usuario Admin
    const adminEmail = 'admin@clinica.com';
    const adminPassword = 'admin123';
    const adminHash = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    
    if (existingAdmin.length > 0) {
      await query('UPDATE users SET password_hash = ?, password = NULL WHERE email = ?', [adminHash, adminEmail]);
      console.log('✅ Admin actualizado');
    } else {
      await query(
        'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
        [adminEmail, adminHash, 'admin', 'Administrador']
      );
      console.log('✅ Admin creado');
    }

    // Usuario Clínica
    const clinicaEmail = 'clinica@clinica.com';
    const clinicaPassword = 'clinica123';
    const clinicaHash = await bcrypt.hash(clinicaPassword, 10);

    const existingClinica = await query('SELECT id FROM users WHERE email = ?', [clinicaEmail]);
    
    if (existingClinica.length > 0) {
      await query('UPDATE users SET password_hash = ?, password = NULL WHERE email = ?', [clinicaHash, clinicaEmail]);
      console.log('✅ Clínica actualizado');
    } else {
      await query(
        'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
        [clinicaEmail, clinicaHash, 'clinica', 'Personal Clínica']
      );
      console.log('✅ Clínica creado');
    }

    console.log('\n📋 Credenciales:\n');
    console.log(`   Admin:   ${adminEmail} / ${adminPassword}`);
    console.log(`   Clínica: ${clinicaEmail} / ${clinicaPassword}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

setupUsers();
