import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import prisma from "../db";

// Zod schema for creating order
const orderSchema = z.object({
  orderDescription: z.string().trim().min(1, "Order description is required"),
  productIds: z.array(z.number()).nonempty("At least one product is required"),
});

export const validateCreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Parse and validate request body
    const parsed = await orderSchema.parseAsync(req.body);

    // DB validation
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: parsed.productIds } },
      select: { id: true },
    });

    if (existingProducts.length !== parsed.productIds.length) {
      const existingIds = existingProducts.map((p) => p.id);
      const invalidIds = parsed.productIds.filter(
        (id) => !existingIds.includes(id)
      );
      return res
        .status(400)
        .json({ message: `Invalid productIds: ${invalidIds.join(", ")}` });
    }

    req.body = parsed;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const firstError = err.issues[0];
      return res.status(400).json({ message: firstError.message });
    }

    // Other errors
    return res.status(500).json({ message: (err as Error).message });
  }
};
