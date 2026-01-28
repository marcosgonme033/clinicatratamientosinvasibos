import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConnection } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  let connection;
  
  try {
    connection = await getConnection();
    
    const migrationFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log('🚀 Running migrations...\n');

    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`   Running: ${file}`);
      await connection.query(sql);
      console.log(`   ✅ Completed: ${file}\n`);
    }

    console.log('✅ All migrations completed successfully!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
};

runMigrations();
