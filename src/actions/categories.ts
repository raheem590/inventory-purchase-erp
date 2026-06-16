"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { categorySchema, slugify } from "@/lib/validations";

export type ActionState = {
  error?: string;
  success?: string;
};

export async function getCategories(includeInactive = false) {
  await requireAuth();
  return prisma.category.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { products: true } },
    },
  });
}

export async function getCategory(id: string) {
  await requireAuth();
  return prisma.category.findUnique({ where: { id } });
}

export async function createCategoryAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const slug = slugify(parsed.data.name);
  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: parsed.data.name }, { slug }] },
  });

  if (existing) {
    return { error: "A category with this name already exists" };
  }

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug,
      sortOrder: parsed.data.sortOrder,
      active: parsed.data.active,
    },
  });

  revalidatePath("/admin/categories");
  return { success: "Category created" };
}

export async function updateCategoryAction(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const slug = slugify(parsed.data.name);
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name: parsed.data.name }, { slug }],
      NOT: { id },
    },
  });

  if (existing) {
    return { error: "A category with this name already exists" };
  }

  await prisma.category.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug,
      sortOrder: parsed.data.sortOrder,
      active: parsed.data.active,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${id}`);
  return { success: "Category updated" };
}
