// Student Name: Kelsey Richards
// Date: 10/10/2026

import "dotenv/config";

import { app } from "./app.js";
import { getDb } from "./db.js";

const PORT = Number(process.env.PORT) || 3000;

// Connect to MongoDB, then start the server
async function startServer() {
  try {
    await getDb();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
