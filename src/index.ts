import express, { Request, Response, NextFunction } from "express";
import apiRoutes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Create versioned API
app.use("/api/v1", apiRoutes);

// Global error handler - for unexpected server errors
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong!" });
});

// Catch all invalid routes (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not a valid route" });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
