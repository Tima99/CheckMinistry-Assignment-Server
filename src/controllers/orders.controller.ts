import { Request, Response } from "express";
import prisma from "../db";

export const OrderController = {
  // Get all orders
  async getAllOrders(req: Request, res: Response) {
    try {
      // Fetch All Orders Rows including count of products
      const orderRows = await prisma.order.findMany({
        select: {
          id: true,
          orderDescription: true,
          createdAt: true,
          _count: {
            select: { orderMaps: true },
          },
        },
      });

      // Format orders rows data
      const ordersWithProductCount = orderRows.map((order) => {
        return {
          ...order,
          count: order._count.orderMaps,
          //  remove fields
          _count: undefined,
        };
      });

      res.json(ordersWithProductCount);
    } catch (message) {
      res.status(500).json({ message: (message as Error).message });
    }
  },

  // Get order by ID
  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Validate Inputs
      if (isNaN(Number(id))) {
        return res.status(400).json({ message: "Invalid Order Id" });
      }

      // Find Order with their products details
      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: { orderMaps: { include: { product: true } } },
      });

      if (!order) return res.status(404).json({ message: "Order not found" });

      res.json(order);
    } catch (message) {
      res.status(500).json({ message: (message as Error).message });
    }
  },

  // Create new order
  async createOrder(req: Request, res: Response) {
    try {
      const { orderDescription, productIds } = req.body;

      // Create Order with valid products
      const order = await prisma.order.create({
        data: {
          orderDescription,
          orderMaps: {
            create: productIds.map((pid: number) => ({ productId: pid })),
          },
        },
      });

      res.status(201).json({
        id: order.id,
        orderDescription: order.orderDescription,
        createdAt: order.createdAt,
        productCount: productIds.length,
      });
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  },

  // Update order
  async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { orderDescription } = req.body;

      const order = await prisma.order.update({
        where: { id: Number(id) },
        data: { orderDescription },
      });

      res.json(order);
    } catch (message) {
      res.status(500).json({ message: (message as Error).message });
    }
  },

  // Delete order
  async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.order.delete({ where: { id: Number(id) } });
      res.status(204).send();
    } catch (message) {
      res.status(500).json({ message: (message as Error).message });
    }
  },
};
