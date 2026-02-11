import express from "express";

const app = express();
const PORT = process.env.PORT || 5050;

app.get("/health", (req, res) => res.json({ ok: true, port: PORT }));

app.listen(PORT, () => console.log("PING server on", PORT));
