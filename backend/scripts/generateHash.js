import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const generateHash = async () => {
  console.log('\n🔐 Generador de Hash Bcrypt\n');
  
  const password = await question('Ingresa la contraseña a hashear: ');
  
  if (!password) {
    console.log('❌ La contraseña no puede estar vacía');
    rl.close();
    return;
  }

  console.log('\nGenerando hash...');
  const hash = await bcrypt.hash(password, 10);
  
  console.log('\n✅ Hash generado exitosamente:\n');
  console.log(hash);
  console.log('\n📋 SQL para actualizar usuario:\n');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'tu_email@ejemplo.com';\n`);
  
  rl.close();
};

generateHash();
