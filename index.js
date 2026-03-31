import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/restaurants", async (req, res) => {
  try {
    // For now, just return a test response
    res.json({ restaurants: [{ id: 1, name: "Test Restaurant" }] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[STANDALONE] Server running on port ${PORT}`);
});
