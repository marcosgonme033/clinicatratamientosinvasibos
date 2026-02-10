// netlify/functions/api.js

const express = require("express");
const serverless = require("serverless-http");

const app = express();

// ✅ Middleware para parsear JSON (sin esto req.body suele ser undefined)
app.use(express.json());

// 🔎 Endpoint de prueba
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 🔐 LOGIN (demo). Sustituye la lógica por la real cuando quieras.
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  // ✅ Respuesta temporal para validar que ya NO hay 404
  return res.json({ ok: true });
});

module.exports.handler = serverless(app);
