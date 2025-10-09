import express, { Request, Response, NextFunction } from "express";
import apiRoutes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Create versioned API
app.use("/api/v1", apiRoutes);

// Global error handler - for unexpected server errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
