import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function listUsers() {
  try {
    const [users] = await pool.query('SELECT id, email, role, created_at FROM users');
    
    console.log('\n📋 USUARIOS EN LA BASE DE DATOS:\n');
    console.log('='.repeat(80));
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. Usuario:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Creado: ${user.created_at}`);
      });
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`\nTotal: ${users.length} usuario(s)\n`);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al consultar usuarios:', error.message);
    process.exit(1);
  }
}

listUsers();
