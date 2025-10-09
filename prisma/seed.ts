import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      id: 1,
      productName: "HP laptop",
      productDescription: "This is HP laptop",
    },
    {
      id: 2,
      productName: "Lenovo laptop",
      productDescription: "This is lenovo",
    },
    { id: 3, productName: "Car", productDescription: "This is Car" },
    { id: 4, productName: "Bike", productDescription: "This is Bike" },
  ];

  // Delete all old products and insert new ones in a single transaction
  await prisma.$transaction([
    prisma.product.deleteMany(), // delete all existing products
    ...products.map((p) => prisma.product.create({ data: p })), // insert new products
  ]);

  console.log("Products seeded successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
