"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/validations";
import type { ActionState } from "@/actions/categories";

export type QuickAddProductResult =
  | { error: string }
  | {
      product: {
        id: string;
        name: string;
        displayName: string;
        categoryId: string;
        uomAbbreviation: string;
      };
    };

export async function getProducts(categoryId?: string, includeInactive = false) {
  await requireAuth();
  return prisma.product.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(includeInactive ? {} : { active: true }),
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { category: true, uom: true },
  });
}

export async function getProduct(id: string) {
  await requireAuth();
  return prisma.product.findUnique({
    where: { id },
    include: { category: true, uom: true },
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
    uomId: formData.get("uomId"),
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
    uomId: formData.get("uomId"),
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

export async function quickAddProductAction(
  name: string,
  categoryId: string,
  uomId: string,
): Promise<QuickAddProductResult> {
  await requireAuth();

  const parsed = productSchema.safeParse({
    name: name.trim(),
    categoryId,
    uomId,
    sortOrder: 0,
    active: true,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const existing = await prisma.product.findFirst({
    where: {
      categoryId: parsed.data.categoryId,
      name: { equals: parsed.data.name, mode: "insensitive" },
    },
    include: { uom: true },
  });

  const product =
    existing ??
    (await prisma.product.create({
      data: parsed.data,
      include: { uom: true },
    }));

  revalidatePath("/purchase/new");
  revalidatePath("/admin/products");

  return {
    product: {
      id: product.id,
      name: product.name,
      displayName: `${product.name} (${product.uom.abbreviation})`,
      categoryId: product.categoryId,
      uomAbbreviation: product.uom.abbreviation,
    },
  };
}
