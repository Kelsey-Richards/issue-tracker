// Student Name: Kelsey Richards
// Date: 9/6/2026

// This is a simple Express server that responds to health check requests.
import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});