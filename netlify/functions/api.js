// netlify/functions/api.js

const express = require("express");
const serverless = require("serverless-http");

const app = express();

// middlewares
app.use(express.json());

// 🔎 endpoint de prueba (muy importante)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 🔐 AUTH (AJUSTA ESTO A TU CÓDIGO REAL)
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // aquí deberías llamar a tu lógica real
  // esto es SOLO para probar que la ruta funciona
  if (email && password) {
    return res.json({ ok: true });
  }

  res.status(400).json({ error: "Missing credentials" });
});

module.exports.handler = serverless(app);
