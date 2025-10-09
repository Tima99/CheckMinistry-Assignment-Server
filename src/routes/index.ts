import { Router, Request, Response } from "express";
import orderRoutes from "./orders.routes";
import productRoutes from "./products.routes";

const router = Router();

// Base versioned API
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);

export default router;
