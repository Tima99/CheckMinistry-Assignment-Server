import { Router } from "express";
import { ProductController } from "../controllers/products.controller";

const router = Router();

// Get all products
router.get("/", ProductController.getAllProducts);

export default router;
