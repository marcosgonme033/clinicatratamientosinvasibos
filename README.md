# Clínica Tratamientos Invasivos

Sistema profesional de gestión de historial de clientes y sesiones invasivas.

## Stack Tecnológico

- **Backend**: Node.js + Express
- **Base de Datos**: MySQL
- **Frontend**: React + Vite
- **Autenticación**: JWT
- **Validación**: Zod

## Requisitos Previos

- Node.js 18+
- MySQL 8+

## Instalación Local

### 1. Configurar Base de Datos

Crear base de datos:
```sql
CREATE DATABASE clinica_invasivos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
npm install

# Copiar y configurar variables de entorno
copy .env.example .env
# Editar .env con tus credenciales de MySQL

# Ejecutar migraciones
npm run migrate

# Ejecutar seeds (datos de ejemplo)
npm run seed

# Iniciar servidor
npm run dev
```

El backend estará en: http://localhost:5050

### 3. Frontend

```bash
cd frontend
npm install

# Copiar variables de entorno
copy .env.example .env

# Iniciar aplicación
npm run dev
```

El frontend estará en: http://localhost:5173

## Credenciales de Prueba

- **Admin**: admin@clinica.com / admin123
- **Clínica**: clinica@clinica.com / clinica123

## Variables de Entorno

### Backend (.env)
```
PORT=5050
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=clinica_invasivos
DB_USER=root
DB_PASSWORD=tu_password

JWT_SECRET=clave_secreta_muy_larga_cambiar_en_produccion

CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5050/api
```

## Despliegue en cPanel

### 1. Preparar Base de Datos

1. Crear base de datos MySQL en cPanel
2. Crear usuario y asignar permisos
3. Importar migraciones manualmente o usar phpMyAdmin

### 2. Backend

```bash
# En local, construir si es necesario
cd backend
npm install --production

# Subir archivos via FTP/SFTP a cPanel:
- /backend/* -> /home/usuario/backend/

# En cPanel terminal:
cd ~/backend
npm install --production
npm run migrate
npm run seed

# Configurar Node.js App en cPanel:
- Application root: backend
- Application URL: api.tudominio.com
- Application startup file: src/server.js
- Node.js version: 18+
```

### 3. Frontend

```bash
# En local:
cd frontend
npm run build

# Subir contenido de dist/ a cPanel:
- dist/* -> /public_html/ (o subdirectorio)

# Actualizar VITE_API_URL antes de build:
VITE_API_URL=https://api.tudominio.com/api
```

### 4. Configurar Variables de Entorno en cPanel

En Node.js App settings, agregar:
- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD
- JWT_SECRET
- CORS_ORIGIN
- NODE_ENV=production

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/         # Configuración DB y JWT
│   ├── middlewares/    # Auth, validación, errores
│   ├── routes/         # Rutas API
│   ├── controllers/    # Controladores
│   ├── services/       # Lógica de negocio
│   ├── repositories/   # Acceso a datos
│   ├── migrations/     # Migraciones SQL
│   ├── seeds/          # Datos de ejemplo
│   ├── utils/          # Schemas y utilidades
│   └── server.js       # Punto de entrada
├── .env.example
└── package.json

frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   ├── context/        # Context API (Auth)
│   ├── services/       # Servicios API
│   ├── index.css       # Estilos globales
│   ├── App.jsx         # App principal
│   └── main.jsx        # Punto de entrada
├── index.html
├── .env.example
└── package.json
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual

### Clientes
- `GET /api/clients?search=` - Listar clientes
- `POST /api/clients` - Crear cliente
- `GET /api/clients/:id` - Obtener cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `GET /api/clients/:id/sessions` - Sesiones del cliente

### Sesiones
- `POST /api/sessions` - Crear sesión
- `GET /api/sessions/:id` - Obtener sesión
- `PUT /api/sessions/:id` - Actualizar sesión
- `DELETE /api/sessions/:id` - Eliminar sesión (solo admin)

## Roles

- **admin**: Acceso completo, puede eliminar sesiones
- **clinica**: Crear y editar clientes y sesiones

## Seguridad

- JWT para autenticación
- Rate limiting en login (5 intentos / 15 min)
- Helmet para headers HTTP
- CORS configurado
- Validación con Zod
- Sanitización de inputs

## Logs y Auditoría

Todas las operaciones críticas se registran en `audit_logs`:
- CREATE_CLIENT
- UPDATE_CLIENT
- CREATE_SESSION
- UPDATE_SESSION
- DELETE_SESSION
