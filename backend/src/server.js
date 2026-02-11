import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { testConnection } from "./config/database.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// ---------- CORS ----------
const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mcpegasus.net",
  "http://mcpegasus.net",
];

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : DEFAULT_ORIGINS;

console.log(`\n🔒 CORS allowed origins: ${allowedOrigins.join(", ")}`);

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin(origin, cb) {
      // Permitir peticiones sin origin (curl, Postman, server-to-server)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ----- DB status (para health y diagnósticos) -----
let dbOk = false;

// Health check (OJO: como tu app está montada en /api en cPanel,
// esto se verá como https://mcpegasus.net/api/health)
app.get("/health", async (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    db: dbOk ? "up" : "down",
  });
});

// Routes
// IMPORTANTÍSIMO: NO pongas /api aquí, porque cPanel ya te monta en /api
// Resultado final será: /api/auth, /api/clients, /api/sessions
app.use("/auth", authRoutes);
app.use("/clients", clientRoutes);
app.use("/sessions", sessionRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Log configuration (sin exponer password)
    console.log("\n📋 Server Configuration:");
    console.log(`   PORT: ${PORT}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || "development"}`);
    console.log(`   DB_HOST: ${process.env.DB_HOST}`);
    console.log(`   DB_NAME: ${process.env.DB_NAME}`);
    console.log(`   DB_USER: ${process.env.DB_USER}`);
    console.log(`   CORS_ORIGINS: ${allowedOrigins.join(", ")}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? "✓ Set" : "✗ Missing"}\n`);

    // NO matar el proceso si DB falla (evita 503 en cPanel)
    try {
      dbOk = await testConnection();
      if (!dbOk) {
        console.error("⚠️ DB connection failed. API will run but DB endpoints may fail.");
      }
    } catch (e) {
      dbOk = false;
      console.error("⚠️ DB connection threw an error. API will run but DB endpoints may fail.");
      console.error(e);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`   Health check: /health (mounted as /api/health in cPanel)\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    // Aquí sí tiene sentido salir: es un fallo real del proceso
    process.exit(1);
  }
};

startServer();
