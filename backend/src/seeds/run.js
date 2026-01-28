import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

const runSeeds = async () => {
  try {
    console.log('🌱 Running seeds...\n');

    // Crear usuarios
    const adminPassword = await bcrypt.hash('admin123', 10);
    const clinicaPassword = await bcrypt.hash('clinica123', 10);

    await query(
      'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
      ['admin@clinica.com', adminPassword, 'admin', 'Administrador']
    );
    
    await query(
      'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
      ['clinica@clinica.com', clinicaPassword, 'clinica', 'Personal Clínica']
    );

    console.log('   ✅ Users created');

    // Crear clientes
    const client1 = await query(
      `INSERT INTO clients (expediente, nombre, apellidos, telefono, email, fecha_nacimiento, notas_generales) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['1001RL', 'María', 'García López', '666123456', 'maria.garcia@email.com', '1985-03-15', 'Cliente VIP']
    );

    const client2 = await query(
      `INSERT INTO clients (expediente, nombre, apellidos, telefono, email, fecha_nacimiento) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['1002RL', 'Carmen', 'Martínez Ruiz', '666789012', 'carmen.martinez@email.com', '1990-07-22']
    );

    console.log('   ✅ Clients created');

    // Crear sesiones
    await query(
      `INSERT INTO sessions (client_id, fecha, profesional, tratamiento, zona, producto, lote, cantidad, tecnica, observaciones, proxima_revision) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client1.insertId,
        '2025-01-15 10:30:00',
        'Dra. Ana Pérez',
        'Relleno ácido hialurónico',
        'Labios',
        'Juvederm Ultra 3',
        'LOT2025A123',
        1.0,
        'Técnica de microgotas',
        'Cliente satisfecha con el resultado',
        '2025-04-15'
      ]
    );

    await query(
      `INSERT INTO sessions (client_id, fecha, profesional, tratamiento, zona, producto, lote, cantidad, tecnica, observaciones) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client1.insertId,
        '2024-11-20 11:00:00',
        'Dra. Ana Pérez',
        'Toxina botulínica',
        'Entrecejo',
        'Botox 50U',
        'LOT2024B456',
        20,
        'Estándar',
        'Primera sesión, buena tolerancia'
      ]
    );

    await query(
      `INSERT INTO sessions (client_id, fecha, profesional, tratamiento, zona, producto, lote, cantidad, observaciones, proxima_revision) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client2.insertId,
        '2025-01-20 16:00:00',
        'Dr. Carlos Ruiz',
        'Relleno ácido hialurónico',
        'Pómulos',
        'Restylane Lyft',
        'LOT2025C789',
        2.0,
        'Excelente resultado, cliente muy contenta',
        '2025-07-20'
      ]
    );

    console.log('   ✅ Sessions created');

    console.log('\n✅ All seeds completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Admin: admin@clinica.com / admin123');
    console.log('   Clínica: clinica@clinica.com / clinica123\n');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    throw error;
  } finally {
    process.exit(0);
  }
};

runSeeds();
