import { Request, Response } from "express";
import prisma from "../db";
import formatOrdersWithCount from "../utils/formatOrdersWithCount";

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
            select: { products: true },
          },
        },
      });

      // Format orders rows data
      const ordersWithProductCount = formatOrdersWithCount(orderRows);

      res.json({ data: ordersWithProductCount });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
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
        include: { products: { include: { product: true } } },
      });

      if (!order) return res.status(404).json({ message: "Order not found" });

      res.json({ data: order });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
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
          products: {
            create: productIds.map((pid: number) => ({ productId: pid })),
          },
        },
      });

      res.status(201).json({
        data: {
          id: order.id,
          orderDescription: order.orderDescription,
          createdAt: order.createdAt,
          productCount: productIds.length,
        },
      });
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  },

  // Update order
  async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { orderDescription, productIds } = req.body;

      if (!Array.isArray(productIds)) {
        return res.status(400).json({ message: "productIds must be an array" });
      }

      // Fetch existing product mappings
      const existingOrder = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: { products: true },
      });

      if (!existingOrder)
        return res.status(404).json({ message: "Order not found" });

      const existingProductIds = existingOrder.products.map(
        (product) => product.productId
      );

      // Determine which mappings to remove and which to add
      const toRemove = existingProductIds.filter(
        (pid) => !productIds.includes(pid)
      );
      const toAdd = productIds.filter(
        (pid) => !existingProductIds.includes(pid)
      );

      // Update db query
      const order = await prisma.$transaction([
        prisma.order.update({
          where: { id: Number(id) },
          data: {
            orderDescription,
            products: {
              // remove old mappings
              deleteMany: { productId: { in: toRemove } },
              // add new mappings
              create: toAdd.map((pid) => ({ productId: pid })),
            },
          },
        }),
      ]);

      res.json({ data: order });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  // Delete order
  async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.order.delete({ where: { id: Number(id) } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  // Search Order
  async searchOrder(req: Request, res: Response) {
    try {
      const { q: query } = req.query;

      if (typeof query !== "string") {
        return res.status(404).json({ message: "Bad Request Exception" });
      }

      // if no search query their return all orders
      if (!query?.length) {
        return await this.getAllOrders(req, res);
      }

      let orders;

      const commonSelectQuery = {
        id: true,
        orderDescription: true,
        createdAt: true,
        _count: { select: { products: true } },
      };

      if (!isNaN(Number(query))) {
        // If the query is a valid number, search only by 'id' using findUnique for faster lookup
        const order = await prisma.order.findUnique({
          where: { id: Number(query) },
          select: commonSelectQuery,
        });

        orders = order ? [order] : [];
      } else {
        // Otherwise, search by 'orderDescription' using case-insensitive findMany
        const orderRows = await prisma.order.findMany({
          where: {
            orderDescription: { contains: query, mode: "insensitive" },
          },
          select: commonSelectQuery,
        });

        orders = orderRows;
      }

      // Format orders
      orders = formatOrdersWithCount(orders);

      res.json({ data: orders });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
};
