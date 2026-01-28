import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function checkPassword() {
  try {
    const [users] = await pool.query('SELECT id, email, password_hash FROM users');
    
    console.log('\n🔐 VERIFICACIÓN DE CONTRASEÑAS:\n');
    console.log('='.repeat(80));
    
    for (const user of users) {
      console.log(`\n📧 Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      
      if (!user.password_hash) {
        console.log(`   ❌ password_hash es NULL`);
      } else if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$') || user.password_hash.startsWith('$2y$')) {
        console.log(`   ✅ password_hash es un hash bcrypt válido`);
        console.log(`   Hash: ${user.password_hash.substring(0, 30)}...`);
        
        // Verificar si la contraseña es "123456"
        const isValid = await bcrypt.compare('123456', user.password_hash);
        console.log(`   Password "123456": ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
      } else {
        console.log(`   ⚠️  password_hash NO es bcrypt (contraseña en texto plano o formato inválido)`);
        console.log(`   Valor: ${user.password_hash}`);
      }
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPassword();
