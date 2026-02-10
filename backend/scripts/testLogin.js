import axios from 'axios';

const testLogin = async () => {
  const API_URL = 'http://localhost:5051/api';
  
  console.log('\n🧪 Probando credenciales...\n');
  
  const tests = [
    { email: 'admin@clinica.com', password: 'admin123', name: 'Admin' },
    { email: 'clinica@clinica.com', password: 'clinica123', name: 'Clínica' }
  ];

  for (const test of tests) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: test.email,
        password: test.password
      });
      
      if (response.data.success) {
        console.log(`✅ ${test.name}: Login exitoso`);
        console.log(`   Token: ${response.data.data.token.substring(0, 30)}...`);
        console.log(`   Usuario: ${response.data.data.user.name}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.response?.data?.error || error.message}`);
    }
  }
  
  console.log('\n');
};

testLogin();
