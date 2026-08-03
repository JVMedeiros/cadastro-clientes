import app from "./app.js";
import { migrate } from "./db/migrate.js";

const PORT = parseInt(process.env.PORT || "3001");

async function start(): Promise<void> {
  await migrate();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
