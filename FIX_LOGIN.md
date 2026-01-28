# Fix Login - Resumen de Cambios

## 🔍 Problemas Identificados

### 1. **Error 500 en Login**
**Causa**: El error handler no diferenciaba entre errores 401 (autenticación) y 500 (servidor). Todos los errores se devolvían como 500 sin statusCode específico.

### 2. **Invalid Credentials sin validación**
**Causa**: No había validación de que `password_hash` fuera un hash bcrypt válido. Si la columna contenía texto plano o NULL, bcrypt.compare() fallaba silenciosamente o daba false.

### 3. **Falta de logging**
**Causa**: No había logs para debuggear el flujo de autenticación ni los errores.

### 4. **Campo password en respuestas**
**Causa**: Solo se excluía `password_hash` pero no el campo `password` si existía.

---

## ✅ Cambios Implementados

### **1. authService.js** - Validación y Logging
```javascript
✅ Validación de entrada (email y password requeridos)
✅ Logging detallado en cada paso del login
✅ Validación de password_hash:
   - Verificar que no sea NULL
   - Verificar que sea formato bcrypt ($2a$, $2b$, $2y$)
✅ Errores con statusCode específico (400, 401, 500)
✅ Manejo de errores inesperados con try/catch
```

### **2. authController.js** - Validación de entrada
```javascript
✅ Validar que email y password existan en req.body
✅ Devolver 400 si faltan datos
✅ Logging de errores con console.error
```

### **3. errorHandler.js** - Diferenciación de errores
```javascript
✅ Usar statusCode del error si existe
✅ Logging estructurado con path y method
✅ No exponer detalles en producción para errores 500
✅ Cambiar "error" por "message" en respuesta JSON
```

### **4. userRepository.js** - Seguridad
```javascript
✅ Excluir tanto password_hash como password de respuestas
```

### **5. server.js** - Logging de configuración
```javascript
✅ Mostrar configuración al arrancar (sin password)
✅ Verificar que JWT_SECRET esté configurado
```

### **6. LoginPage.jsx** - Manejo de errores frontend
```javascript
✅ Diferenciar entre 401, 400, 500 y errores de red
✅ Mensajes específicos según el tipo de error
✅ Console.error para debugging
```

---

## 🔧 Scripts Nuevos

### 1. **Generar Hash Bcrypt**
```bash
npm run generate-hash
```
Genera un hash bcrypt interactivo y muestra el SQL UPDATE.

### 2. **Crear Usuario Admin**
```bash
npm run create-admin
```
Crea o actualiza un usuario admin@clinica.com con password `123456`.

### 3. **Corregir Contraseñas**
```bash
npm run fix-passwords
```
Analiza todos los usuarios y:
- Hashea contraseñas en texto plano
- Convierte password_hash inválidos
- Pone password = NULL
- Reporta el estado de cada usuario

---

## ✅ Checklist de Pruebas

### **Prueba 1: Login Exitoso**
```bash
POST /api/auth/login
{
  "email": "admin@clinica.com",
  "password": "123456"
}

✅ Respuesta esperada: 200 OK
{
  "success": true,
  "data": {
    "token": "jwt...",
    "user": {
      "id": 1,
      "email": "admin@clinica.com",
      "name": "Administrador",
      "role": "admin"
      // NO contiene password ni password_hash
    }
  }
}
```

### **Prueba 2: Credenciales Incorrectas**
```bash
POST /api/auth/login
{
  "email": "admin@clinica.com",
  "password": "wrongpassword"
}

✅ Respuesta esperada: 401 Unauthorized
{
  "success": false,
  "message": "Invalid credentials"
}

❌ NO debe ser 500
```

### **Prueba 3: Datos Faltantes**
```bash
POST /api/auth/login
{
  "email": "admin@clinica.com"
}

✅ Respuesta esperada: 400 Bad Request
{
  "success": false,
  "message": "Email and password are required"
}
```

### **Prueba 4: Usuario con password_hash NULL**
```bash
# En MySQL ejecutar:
UPDATE users SET password_hash = NULL WHERE email = 'test@test.com';

# Intentar login:
POST /api/auth/login
{
  "email": "test@test.com",
  "password": "cualquiera"
}

✅ Respuesta esperada: 500 Internal Server Error
✅ Console debe mostrar: [AUTH ERROR] User test@test.com has NULL password_hash
```

### **Prueba 5: Usuario con password_hash en texto plano**
```bash
# En MySQL ejecutar:
UPDATE users SET password_hash = 'texto_plano' WHERE email = 'test@test.com';

# Intentar login:
POST /api/auth/login
{
  "email": "test@test.com",
  "password": "cualquiera"
}

✅ Respuesta esperada: 500 Internal Server Error
✅ Console debe mostrar: [AUTH ERROR] User test@test.com has invalid password_hash (not bcrypt format)
```

### **Prueba 6: Endpoint /api/auth/me**
```bash
GET /api/auth/me
Authorization: Bearer <token>

✅ Respuesta esperada: 200 OK
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@clinica.com",
    "name": "Administrador",
    "role": "admin"
  }
}
```

### **Prueba 7: Token Inválido o Expirado**
```bash
GET /api/auth/me
Authorization: Bearer token_invalido

✅ Respuesta esperada: 401 Unauthorized
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## 🚀 Pasos para Probar

### 1. **Verificar Configuración**
```bash
cd backend
cat .env
# Verificar que todos los campos DB_* y JWT_SECRET estén configurados
```

### 2. **Iniciar Backend**
```bash
npm run dev

# Verificar en consola:
# ✅ Configuración mostrada correctamente
# ✅ Database connected successfully
# ✅ Server running on port 5050
```

### 3. **Corregir Contraseñas Existentes**
```bash
npm run fix-passwords
# Esto revisa todos los usuarios y corrige password_hash
```

### 4. **O Crear Usuario Admin de Prueba**
```bash
npm run create-admin
# Email: admin@clinica.com
# Password: 123456
```

### 5. **Probar Login desde Frontend**
```bash
cd frontend
npm run dev
# Abrir http://localhost:5173/login
# Usar: admin@clinica.com / 123456
```

### 6. **Verificar Logs en Backend**
```bash
# En consola del backend deberías ver:
[AUTH] Login attempt for email: admin@clinica.com
[AUTH] User found: admin@clinica.com, ID: 1
[AUTH] Comparing password for user: admin@clinica.com
[AUTH] Login successful for user: admin@clinica.com
```

### 7. **Probar Credenciales Incorrectas**
```bash
# Intentar login con password incorrecto
# Verificar que:
# ✅ Frontend muestra "Email o contraseña incorrectos"
# ✅ Backend devuelve 401 (no 500)
# ✅ Console muestra: [AUTH] Invalid password for user: ...
```

---

## 📝 Generar Hash Manual

Si necesitas hashear una contraseña específica:

```bash
npm run generate-hash
# Ingresa la contraseña cuando se solicite
# Copia el hash generado
# Ejecuta el SQL UPDATE proporcionado
```

O en Node.js directamente:
```javascript
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('tu_password', 10);
console.log(hash);
```

SQL para actualizar:
```sql
UPDATE users 
SET password_hash = '$2a$10$...hash...', 
    password = NULL 
WHERE email = 'tu_email@ejemplo.com';
```

---

## 🔐 Seguridad Implementada

✅ Contraseñas hasheadas con bcrypt (10 rounds)
✅ No se expone password ni password_hash en API
✅ Validación de formato bcrypt antes de comparar
✅ Rate limiting en login (5 intentos / 15 min)
✅ JWT con expiración
✅ Errores genéricos para evitar enumeración de usuarios
✅ Logging para auditoría sin exponer datos sensibles

---

## 🐛 Debugging

### Si sigues teniendo errores 500:
1. Revisar logs de backend en consola
2. Verificar que password_hash en BD sea formato bcrypt válido
3. Ejecutar `npm run fix-passwords`
4. Verificar que .env tenga JWT_SECRET configurado
5. Revisar que DB_NAME sea correcto

### Si sigues teniendo "Invalid credentials":
1. Verificar que el usuario exista en BD
2. Ejecutar `npm run create-admin` para crear usuario de prueba
3. Verificar en consola backend qué paso falla
4. Intentar con password "123456" después de crear-admin

---

## 📊 Logs de Ejemplo

### Login exitoso:
```
[AUTH] Login attempt for email: admin@clinica.com
[AUTH] User found: admin@clinica.com, ID: 1
[AUTH] Comparing password for user: admin@clinica.com
[AUTH] Login successful for user: admin@clinica.com
POST /api/auth/login 200 245ms
```

### Password incorrecta:
```
[AUTH] Login attempt for email: admin@clinica.com
[AUTH] User found: admin@clinica.com, ID: 1
[AUTH] Comparing password for user: admin@clinica.com
[AUTH] Invalid password for user: admin@clinica.com
[LOGIN ERROR]: Invalid credentials
[ERROR HANDLER]: {
  message: 'Invalid credentials',
  statusCode: 401,
  path: '/api/auth/login',
  method: 'POST'
}
POST /api/auth/login 401 102ms
```

### Usuario no encontrado:
```
[AUTH] Login attempt for email: noexiste@test.com
[AUTH] User not found: noexiste@test.com
[LOGIN ERROR]: Invalid credentials
POST /api/auth/login 401 5ms
```
