import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5174;

app.use(cors());
app.use(express.json());

// Basic health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "api", time: new Date().toISOString() });
});

// Example endpoint
app.get("/api/greeting", (_req: Request, res: Response) => {
  res.json({ message: "Hello from the backend!" });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("API error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`[api] listening on http://0.0.0.0:${port}`);
});

