import { Router } from "express";
import { OrderController } from "../controllers/orders.controller";
import { validateCreateOrder } from "../middlewares/validateInputs";

const router = Router();

// Get all orders
router.get("/", OrderController.getAllOrders);

// Search Orders
router.get("/search", OrderController.deleteOrder);

// Get order by ID
router.get("/:id", OrderController.getOrderById);

// Create new order with validation
router.post("/", validateCreateOrder, OrderController.createOrder);

// Update order by ID
router.put("/:id", OrderController.updateOrder);

// Delete order by ID
router.delete("/:id", OrderController.deleteOrder);

export default router;
