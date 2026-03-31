#!/usr/bin/env node

import express from "express";
import cors from "cors";
import restaurantsRouter from './server/routes/restaurants-router.js';

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/restaurants', restaurantsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Server running" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`Try: curl http://localhost:${PORT}/api/restaurants`);
});
