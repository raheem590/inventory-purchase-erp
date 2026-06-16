import "dotenv/config";
import { createPrismaClient } from "../src/lib/db";

const prisma = createPrismaClient();

const seedData = [
  {
    name: "Vegetables Market",
    slug: "vegetables-market",
    sortOrder: 1,
    products: ["Tomato", "Carrot", "Potato", "Onion", "Beans"],
  },
  {
    name: "Stationery Hyder",
    slug: "stationery-hyder",
    sortOrder: 2,
    products: ["Rice", "Lentil", "Semolina", "Sugar", "Salt"],
  },
  {
    name: "Stationery Afsal",
    slug: "stationery-afsal",
    sortOrder: 3,
    products: ["Biscuit", "Notebook", "Pen", "Pencil", "Eraser"],
  },
];

async function main() {
  const piece = await prisma.unitOfMeasure.upsert({
    where: { abbreviation: "pc" },
    update: {
      name: "Piece",
      sortOrder: 1,
      active: true,
    },
    create: {
      name: "Piece",
      abbreviation: "pc",
      sortOrder: 1,
      active: true,
    },
  });

  await prisma.unitOfMeasure.upsert({
    where: { abbreviation: "kg" },
    update: {
      name: "Kilogram",
      sortOrder: 2,
      active: true,
    },
    create: {
      name: "Kilogram",
      abbreviation: "kg",
      sortOrder: 2,
      active: true,
    },
  });

  await prisma.unitOfMeasure.upsert({
    where: { abbreviation: "ltr" },
    update: {
      name: "Liter",
      sortOrder: 3,
      active: true,
    },
    create: {
      name: "Liter",
      abbreviation: "ltr",
      sortOrder: 3,
      active: true,
    },
  });

  for (const category of seedData) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        sortOrder: category.sortOrder,
        active: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        sortOrder: category.sortOrder,
        active: true,
      },
    });

    for (const [index, productName] of category.products.entries()) {
      await prisma.product.upsert({
        where: {
          categoryId_name: {
            categoryId: createdCategory.id,
            name: productName,
          },
        },
        update: {
          sortOrder: index + 1,
          active: true,
          uomId: piece.id,
        },
        create: {
          name: productName,
          categoryId: createdCategory.id,
          uomId: piece.id,
          sortOrder: index + 1,
          active: true,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
