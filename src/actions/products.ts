"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/validations";
import type { ActionState } from "@/actions/categories";

export async function getProducts(categoryId?: string, includeInactive = false) {
  await requireAuth();
  return prisma.product.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(includeInactive ? {} : { active: true }),
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { category: true },
  });
}

export async function getProduct(id: string) {
  await requireAuth();
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function createProductAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    sortOrder: formData.get("sortOrder") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const existing = await prisma.product.findUnique({
    where: {
      categoryId_name: {
        categoryId: parsed.data.categoryId,
        name: parsed.data.name,
      },
    },
  });

  if (existing) {
    return { error: "This product already exists in the selected category" };
  }

  await prisma.product.create({ data: parsed.data });
  revalidatePath("/admin/products");
  return { success: "Product created" };
}

export async function updateProductAction(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    sortOrder: formData.get("sortOrder") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const existing = await prisma.product.findFirst({
    where: {
      categoryId: parsed.data.categoryId,
      name: parsed.data.name,
      NOT: { id },
    },
  });

  if (existing) {
    return { error: "This product already exists in the selected category" };
  }

  await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/products");
  return { success: "Product updated" };
}
