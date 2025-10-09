// Seed file helps in intializing intial or defined data
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const products = [
    { productName: "HP laptop", productDescription: "This is HP laptop" },
    { productName: "Lenovo laptop", productDescription: "This is lenovo" },
    { productName: "Car", productDescription: "This is Car" },
    { productName: "Bike", productDescription: "This is Bike" },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log("Products seeded successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
