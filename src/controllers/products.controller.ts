import { Request, Response } from "express";
import prisma from "../db";

export const ProductController = {
  async getAllProducts(req: Request, res: Response) {
    const products = await prisma.product.findMany({});

    return res.json(products);
  },
};
