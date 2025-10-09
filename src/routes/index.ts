import { Router, Request, Response } from "express";
import orderRoutes from "./orders.routes";
import productRoutes from "./products.routes";

const router = Router();

// Base versioned API
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);

// 404 handler for unknown routes under /api/v1
router.use((req: Request, res: Response) => {
  res.status(404).json({ error: "V1 Route Not Found" });
});

export default router;
